#!/usr/bin/env node

const fn = require('funclib');
const program = require('commander');
const { prompt } = require('enquirer');

const package = require('../package.json');
const fmt2json = require('../fmt2json');

program
  .version(package.version)
  .option('-v, --version', 'output the version number')
  .option('-i, --indent <indent>', 'Indnet number.')
  .option('-q, --qtMark <qtMark>', `Quotation mark, one of ['""', "''", '"', "'"]`, '""')
  .option('-c, --collapse', 'Collapse the formatted results.')
  .option('-e, --escape', 'Escape the formatted results.')
  .option('-u, --unescape', 'Unescape source before format.')
  .option('-s, --strict', 'Strict mode.')
  .option('-d, --details', 'Return with formatted details info.')
  .parse(process.argv);

const { indent, qtMark, strict, collapse, escape, unescape, details } = program;

const options = {};
if (indent && indent.match(/^([1-9])$/)) {
  options.indent = +indent;
}
if (['""', "''", '"', "'"].includes(qtMark)) {
  const qtArr = qtMark.split();
  if (qtMark.length === 2) {
    options.keyQtMark = qtArr[0];
    options.valQtMark = qtArr[1];
  } else {
    options.keyQtMark = '';
    options.valQtMark = qtArr[0];
  }
} else {
  throw new Error(
    `qtMark mast one of ['""', "''", '"', "'"], for key and value, single mark means no key mark just for value.`
  );
}
if (collapse) options.expand = false;
if (escape) options.escape = true;
if (unescape) options.unescape = true;
if (strict) options.strict = true;
if (details) options.withDetails = true;

prompt({
  type: 'input',
  name: 'source',
  message: 'Input a string to foramt:',
}).then(({ source }) => {
  if (details) {
    const fmtInfo = fmt2json(source, options);
    fn.log('', { title: `format-to-json(${package.version})`, pre: true });
    console.log(fn.chalk(fmtInfo.result, 'cyan'));
    console.log(fn.array(66, '-').join(''));
    delete fmtInfo.result;
    console.log(fmtInfo);
    fn.log('', { end: true });
  } else {
    const jsonString = fmt2json(source, options);
    console.log(fn.chalk(jsonString, 'cyan'));
  }
});
