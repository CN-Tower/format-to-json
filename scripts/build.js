const fn = require('funclib');
const path = require('path');

const rootPath = path.resolve(__dirname, '../');

const lcsPath = path.join(rootPath, 'scripts/license.js');
const fmtJsPath = path.join(rootPath, 'format2json.js');
const fmtMinJsPath = path.join(rootPath, 'format2json.min.js');

const lcsTpl = fn.rd(lcsPath);
let fmtJsTpl = lcsTpl + fn.rd(fmtJsPath);
let fmtMinJsTpl = lcsTpl + fn.rd(fmtMinJsPath);

console.log('[build] Add license prefix.');

fn.wt(fmtJsPath, fmtJsTpl);
fn.wt(fmtMinJsPath, fmtMinJsTpl);

fn.log('Build Success!', { title: '#Build' });
