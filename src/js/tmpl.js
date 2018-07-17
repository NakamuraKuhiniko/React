export const header = `
<nav>
  <div class="nav-wrapper">
    <a href="https://github.com/CareyToboo" target="_blank" class="brand-logo">
      <span class="inline logo-icon"></span><span class="inline">前端资源收集</span>
    </a>
  </div>
</nav>
`;

export const footer = `
<div class="page-footer" ></div>
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
              <div class="mult-text-flow"><% info.describe || info %></div>
            </div>
          </div>
        </div>
      </div>
    <% } %>
  </div>
<% } %>
`;
