import '../lib/materialize/css/materialize.css';
import '../lib/materialize/js/materialize';
import '../css/index.styl';

import * as TMPL from './tmpl';
import * as Utils from './utils';
import projectRegistry from '../../projects.yaml';
import starSrouce from '../../stars.json';

function renderComponent(key, $seletor, data, callback) {
  document.querySelector($seletor).innerHTML = Utils.template(TMPL[key], data);
  callback && callback();
}

function renderPage() {
  renderComponent('header', '#app-header');
  renderComponent('footer', '#app-footer');
  renderComponent('siderMenu', '.app-sider-menu', {
    category: Object.keys(projectRegistry)
  });
  renderComponent('projects', '.app-project-content', {
    projects: projectRegistry,
    stars: starSrouce
  });
}

window.onload = () => {
  renderPage();
  M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));
};
