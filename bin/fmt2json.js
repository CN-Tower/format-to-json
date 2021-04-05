#!/usr/bin/env node

const fn = require('funclib');
const program = require('commander');
const { prompt } = require('enquirer');
const package = require('../package.json');
const fmt2json = require('../fmt2json');

program.version(package.version)
  .option('-v, --version', 'output the version number')
  .option('-i, --indent <indent>', 'Indnet number.')
  .option('-q, --qtMark <qtMark>', `Quotation mark, one of ['""', "''", '"', "'"]`, '""')
  .option('-e, --escape', 'Escape format result.')
  .option('-u, --unescape', 'Unescape source before format.')
  .option('-s, --strict', 'Strict mode.')
  .option('-r, --resultOnly', 'Result only, not return the format info.')
  .parse(process.argv);

const { indent, qtMark, strict, unescape, resultOnly } = program;

const options = {};
if (indent && indent.match(/^([1-9])$/)) {
  options.indent = +indent;
}
if(['""', "''", '"', "'"].includes(qtMark)) {
  const qtArr = qtMark.split();
  if (qtMark.length === 2) {
    options.keyQtMark = qtArr[0];
    options.valQtMark = qtArr[1];
  } else {
    options.keyQtMark = '';
    options.valQtMark = qtArr[0];
  }
} else {
  throw new Error(`qtMark mast one of ['""', "''", '"', "'"], for key and value, single mark means no key mark just for value.`);
}
if (strict) options.strict = true;
if (unescape) options.unescape = true;
if (resultOnly) options.resultOnly = true;

prompt({
  type: 'input',
  name: 'source',
  message: 'Input a string to foramt:'
}).then(({ source }) => {
  if (resultOnly) {
    fmt2json(source, options).then(result => {
      console.log(fn.chalk(result, 'cyan'));
    });
  } else {
    fmt2json(source, options).then(res => {
      fn.log('', { title: `format-to-json(${package.version})`, pre: true });
      console.log(fn.chalk(res.result, 'cyan'));
      console.log(fn.array(66, '-').join(''));
      console.log(res.status);
      fn.log('', { end: true });
    });
  }
});
