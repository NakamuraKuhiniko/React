const shell = require('shelljs');
const axios = require('axios');
const fs = require('fs');

const paths = require('./paths');

let readme = `# [GitHub 值得收藏的前端项目](https://github.com/CareyToboo/github-FE-project)

> 整理与收集的一些比较优秀github项目，方便自己阅读，顺便分享出来，大家一起学习，本篇文章会持续更新，版权归原作者所有。[更新时间: ${new Date().toLocaleString()}]
[预览](https://careytoboo.github.io/github-FE-project/dist/index.html)

`;

const buildProjectItem = (options) => {
  const {
    prokey,
    github = true,
    star = true,
    recommand = false,
    stars = {},
    describe = '',
    url = '',
    demo = '',
    image = '',
  } = options;

  const starCount = stars[prokey];

  let name = prokey;

  if(/\//.test(prokey)) {
    name = prokey.split('/')[1];
  }

  // 格式
  readme += `- [${name}](${github ? `https://github.com/${prokey}` : url}) ${describe} ${
    recommand ? '`recommand`' : '' } ${
    starCount ? `\`star: ${starCount}\`` : '' } ${
    demo ? `[view](${demo})` : '' } ${
    image ? `\n\n![image](${paths.githubImgResouce}/${image})?raw=true` : '' }  \n\n`;
}

module.exports = projects => {

  const stars =  !shell.test('-e', paths.stars) ? {} : JSON.parse(shell.cat(paths.stars).stdout);
  const catgories = Object.keys(projects);

  const websites = projects[catgories.shift()];

  for(let prokey in websites) {
    buildProjectItem(Object.assign({prokey}, websites[prokey]));
  }

  readme += '## 目录\n\n';

  catgories.forEach(catgory => {
    readme += `* [${catgory}](#${catgory.replace(/[\/|、|\.]/g, '').toLowerCase()})\n`;
  });

  readme += '\n';

  catgories.forEach(catgory => {
    const items = projects[catgory];

    readme += `### ${catgory}\n\n`;

    for (let prokey in items) {
      let item = items[prokey];

      if (typeof item === 'string') {
        item = { describe: item };
      }

      buildProjectItem(Object.assign({prokey, stars}, item));
    }
  });

  shell.rm('-rf', paths.build);
  fs.writeFileSync(paths.build, readme, 'utf-8');

  console.log(`${paths.build} 构建成功`);
};
