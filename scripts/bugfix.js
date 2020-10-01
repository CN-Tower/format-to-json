const fn = require('funclib');
const path = require('path');

const rootPath = path.resolve(__dirname, '../');

const fmtJsPath = path.join(rootPath, 'format2json.js');
const fmtMinJsPath = path.join(rootPath, 'format2json.min.js');

let fmtJsTpl = fn.rd(fmtJsPath);

fmtJsTpl = fmtJsTpl.replace(/\}\)\(undefined\);/, '})(this);');

fn.wt(fmtJsPath, fmtJsTpl);
fn.wt(fmtMinJsPath, fmtJsTpl);
console.log('\n[bugfix] Fix the built template.');