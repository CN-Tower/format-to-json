const fn = require('funclib');
const path = require('path');
const package = require('../package.json');

const rootPath = path.resolve(__dirname, '../');

const lcsPath = path.join(rootPath, 'scripts/license.js');
const fmtJsPath = path.join(rootPath, 'fmt2json.js');
const fmtMinJsPath = path.join(rootPath, 'fmt2json.min.js');

const lcsTpl = fn.rd(lcsPath).replace(/v(\d*\.?){3}/, `v${package.version}`);
fn.wt(lcsPath, lcsTpl);

let fmtJsTpl = lcsTpl + fn.rd(fmtJsPath);
let fmtMinJsTpl = lcsTpl + fn.rd(fmtMinJsPath);

console.log('[build] Add license prefix.');

fn.wt(fmtJsPath, fmtJsTpl);
fn.wt(fmtMinJsPath, fmtMinJsTpl);

fn.log('Build Success!', { title: '#Build' });
