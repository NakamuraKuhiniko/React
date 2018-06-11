const yaml = require('js-yaml');
const shell = require('shelljs');

const paths = require('./paths');
const buildReadme = require('./buildReadme');

const args = process.argv.splice(2);

const command = args[0];

const projects = yaml.load(shell.cat(paths.projects));
switch (command) {
  case 'build:rdm': return buildReadme(projects);
  case 'stars': return require('./getStars');
}

