// 字符串模版
export const template = (tpl, data) => {
  const re = /<%([^%>]+)?%>/g;
  const reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  let code = 'var r=[];\n';
  let cursor = 0;
  let match;

  const add = (line, js) => {
    /* eslint-disable no-unused-expressions */
    js
      ? (code += line.match(reExp) ? `${line}\n` : `r.push(${line});\n`)
      : (code += line !== '' ? `r.push("${line.replace(/"/g, '\\"')}");\n` : '');
    return add;
  };

  while ((match = re.exec(tpl))) {
    add(tpl.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(tpl.substr(cursor, tpl.length - cursor));
  code += 'return r.join("");';
  // eslint-disable-next-line
  return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};
