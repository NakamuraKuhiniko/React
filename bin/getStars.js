const schedule = require('node-schedule');
const axios = require('axios');
const shell = require('shelljs');
const fs = require('fs');
const yaml = require('js-yaml');

const paths = require('./paths');

const token = 'edda2640e3e5390e0d426033ac60ae7e3633555b';
const projects = yaml.load(shell.cat(paths.projects));

let index = 0;
let errorKeys = [];
let result = { createTime: Date.now() };

const newKeys = getNewKeys();

if (!newKeys.length) return; // 没有需要更新的项目

console.log(`\n ${new Date()} counts: ${newKeys.length}`);

const stars = schedule.scheduleJob('2 * * * * *', () => {
  const projectKey = newKeys[index];

  if (!projectKey) { // 直到请求到最后一个项目
    saveStars();
    stars.cancel();
    return;
  }

  axios.get(`${paths.githubApi}/repos/${projectKey}?access_token=${token}`).then(res => {
    result[projectKey] = res.data.stargazers_count; // 获取 star 数量
    console.log(`success: ${index} ${projectKey}`);
    if (index % 10 === 0) {
      saveStars();
    }
  }).catch(() => {
    errorKeys.push[projectKey];
    console.log(`error: ${index} ${projectKey}`);
  });
  index++;
});

function saveStars() {
  shell.rm('-rf', paths.stars);
  result.errorKeys = errorKeys;
  fs.writeFileSync(paths.stars, JSON.stringify(result, null, 2), 'utf-8');
  let i = 0;
  newKeys.forEach(key => {
    if (result[key]) {
      i++;
    }
  });
  console.log(`save stars file:  all: ${newKeys.length} result: ${i} error: ${errorKeys.length}`);
}

function getProjectKeys() {
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

function getNewKeys() {
  const keys = getProjectKeys();

  if (!shell.test('-e', paths.stars)) return keys; // 不存在stars文件
  const stars = JSON.parse(shell.cat(paths.stars).stdout);
  const month = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - stars.createTime > month) return keys; // 超过一周重新获取数据

  const newKeys = [];
  result = stars;

  for (let i = 0; i < keys.length; i++) {
    if (!stars[keys[i]]){
      newKeys.push(keys[i]);
    }
  }

  return newKeys;
};
