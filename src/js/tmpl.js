export const header = `
<nav>
  <div class="nav-wrapper">
    <a href="#!" class="brand-logo"><span class="inline logo-icon"></span><span class="inline">前端资源收集</span></a>
    <ul class="right hide-on-med-and-down">
      <li><a href=""><i class="material-icons">search</i></a></li>
      <li><a href=""><i class="material-icons">view_module</i></a></li>
      <li><a href=""><i class="material-icons">refresh</i></a></li>
      <li><a href=""><i class="material-icons">more_vert</i></a></li>
    </ul>
  </div>
</nav>
`;

export const footer = `
<div  class="row page-footer" >
  <div class="container">
    <div class="row">
      <div class="col l6 s12">
        <h5 class="white-text">Footer Content</h5>
        <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
      </div>
      <div class="col l4 offset-l2 s12">
        <h5 class="white-text">Links</h5>
        <ul>
          <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
          <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
          <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
          <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <div class="container">
    © 2014 Copyright Text
    <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
    </div>
  </div>
</div>
`;

export const siderMenu = `
<ul class="collection pf">
  <% for (let i = 0; i < this.category.length; i++) { const category = this.category[i]; %>
    <a href="#<% category %>" class="collection-item"><span class="title"><% category %></span></a>
  <% } %>
</ul>
`;

export const projects = `
<% for (let categoryKey in this.projects) {  const category = this.projects[categoryKey]; %>
  <div id="<% categoryKey %>" class="row scrollspy ">
    <p class="pushpin"> <% categoryKey %> </p>
    <% for (let prokey in category) { const info = category[prokey]; %>
      <div class="col s4 projects-item">
        <div class="card" style="height:150px;" onclick="javascript:;window.open('<% info.url || ("https://github.com/" + prokey) %>')">
          <div class="card-title">
            <span><% prokey.split('/')[1] || prokey %></span>
            <span class="star-tip fr"><% this.stars[prokey] ? ('star:' + this.stars[prokey]) : '' %></span>
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <div><% info.describe || info %></div>
            </div>
          </div>
        </div>
      </div>
    <% } %>
  </div>
<% } %>
`;
