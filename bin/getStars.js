const schedule = require('node-schedule');
const axios = require('axios');
const shell = require('shelljs');
const fs = require('fs');
const yaml = require('js-yaml');

const paths = require('./paths');

// 请先获取 githubToken 文档: https://blog.csdn.net/bing900713/article/details/80222188
// 再次运行 yarn stars 命令
if (!getGithubToken()) {
  return
}

const _now = Date.now();

let _result = { _createTime: _now, _errorKeys: [] };
const _queueLength = 10; // 并发请求数量 【根据网络情况调整】
const _requestTimer = 20; // 1-59 请求间隔 单位 秒 【根据网络情况调整】
const _errorKeys = []; // 记录请求出错key

let _allRequestCount = 0; // 记录一共请求的数量

const _newRequestKeys = getNewKeys();
const _requestQueue = getRequestQueue(_newRequestKeys);

if (!_allRequestCount) { // 没有需要更新的项目
  console.log('no projects need request stars.\n');
  return;
}

console.log(`\n ${new Date()} start request ${_allRequestCount} projects.\n`);

requestQueueStars(_requestQueue); // 请求所有 数据

// 获取 所有数据
function requestQueueStars(queue) {
  let index = 0;

  const job = schedule.scheduleJob(`${_requestTimer} * * * * *`, () => {
    if (index >= queue.length) {
      console.log('you have finshed all requests.\n');
      job.cancel();
      return;
    }
    const q = queue[index++];
    getStars(q);
  });

  // queue.forEach((q, index) => { // 循环请求获取数据超级慢！
  //   let timer = setTimeout(() => { // 每隔固定时间 并非固定数量的请求
  //     getStars(q);
  //     clearTimeout(timer);
  //     timer = null;
  //   }, _requestTimer * index * 1000)
  // });
}

// 从github中获取 star 数量
function getStars(queue) {
  console.log(`request projects:\n  ${queue.join('\n  ')}\n`);

  Promise.all(queue.map(key =>
    axios.get(`${paths.githubApi}/repos/${key}?access_token=${getGithubToken()}`)
      .catch(error => _errorKeys.push(key)) // 避免一个错误 引起整个 queue 数据浪费
    ))
      .catch(() => _errorKeys.concat(queue)) // 意外错误处理
      .then(resDataAr => {
        resDataAr.forEach((resdata, index) => {
          const projectKey = queue[index];
          if (!resdata.data || !resdata.data.stargazers_count) { // 如果没有对应数据 直接返回
            console.log(`error: ${projectKey}`);
            return;
          }
          const count = resdata.data.stargazers_count;
          _result[projectKey] = count; // 获取 star 数量
          console.log(`success: ${projectKey} ${count}`);
        });
        saveStars(); // 每一次并发请求数据 都存储一次文件， 防止数据丢失
      });
}

// 存储 获取的数据
function saveStars() {
  shell.rm('-rf', paths.stars);
  fs.writeFileSync(paths.stars, JSON.stringify(_result, null, 2), 'utf-8');
  if (_errorKeys.length) {
    _result._errorKeys = _errorKeys; // 记录所有错误key
  }

  const success = Object.keys(_result).filter(i => _newRequestKeys.find(j => i === j));

  console.log('------------------------------------------------');
  console.log(`save stars file, all: ${
    _allRequestCount } success: ${ success.length } error: ${ _errorKeys.length }`);
  console.log('------------------------------------------------\n');
}

// 获取配置文件中 github项目 的 projectkey
function getProjectKeys() {
  const projects = yaml.load(shell.cat(paths.projects));

  const keys = [];
  for (let catgory in projects) {
    const items = projects[catgory];
    for (prokey in items) {
      const { star = true, github = true } = items[prokey];
      if (!star || !github) break;
      keys.push(prokey);
    }
  }
  return keys;
}

// 获取 一个月内 新 添加的项目
function getNewKeys() {
  const keys = getProjectKeys();

  if (!shell.test('-e', paths.stars)) return keys; // 不存在stars文件

  const stars = JSON.parse(shell.cat(paths.stars).stdout);
  const month = 30 * 24 * 60 * 60 * 1000;
  const newKeys = [];

  if (_now - (stars._createTime || 0) > month) return keys; // 超过一周重新获取数据

  _result = stars;
  _result._errorKeys = [];

  for (let i = 0; i < keys.length; i++) {
    if (!stars[keys[i]]){
      newKeys.push(keys[i]);
    }
  }

  return newKeys;
};

// 将项目的key值 按照固定长度 打包成数组 队列
function getRequestQueue(newKeys) {
  const len = newKeys.length;
  _allRequestCount = len;

  if (len <= _queueLength) return [newKeys];

  const requestQueue = [];
  let i = 0;

  while(newKeys[i]) {
    requestQueue.push(newKeys.slice(i, i + _queueLength));
    i += _queueLength;
  }

  if (i % _queueLength != 0) {
    requestQueue.push(newKeys.slice(i - _queueLength, len));
  }

  return requestQueue;
}

function getGithubToken() {
  let token = ''
  try {
    token = require('./githubToken')
  } catch {
    //
  }
  if (!token) {
    console.warn(`
  ------------------------------------------------

  不存在 githubToken, 无法完成请求star数
  获取 githubToken 方式: https://blog.csdn.net/bing900713/article/details/80222188

  请新建 './bin/githubToken.js' 文件，并复制token到该文件，再次运行 'yarn stars' 命令即可

  module.exports = 'your github token';

  ------------------------------------------------
    `)
    return
  }
}
