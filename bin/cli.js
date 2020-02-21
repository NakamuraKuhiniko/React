const yaml = require('js-yaml');
const shell = require('shelljs');

const paths = require('./paths');
const buildReadme = require('./buildReadme');

const args = process.argv.splice(2);

const command = args[0];

const projects = yaml.load(shell.cat(paths.projects));

/**
 * TODO: 
 *  1. 项目，star数，fork数，关注数，数据对比分析，并做成 chart 报表
 *  2. 重写预览页面
 */
switch (command) {
  case 'clean': return shell.rm('-rf', ['./.cache', './dist/*']);
  case 'build:rdm': return buildReadme(projects);
  case 'stars': return require('./getStars');
}

