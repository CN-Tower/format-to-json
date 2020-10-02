#!/usr/bin/env node

const fn = require('funclib');
const program = require('commander');
const { prompt } = require('enquirer');
const package = require('../package.json');
const format2json = require('../src/format2json');

program.version(package.version)
  .option('-i, --indent [indent]', 'Indnet for the format.')
  .option('-k, --keyQtMark [keyQtMark]', 'Key quotation mark.')
  .option('-v, --valQtMark [valQtMark]', 'Value quotation mark.')
  .option('-S, --isStrict', 'Strict format to a JSON template.')
  .option('-U, --isUnescape', 'Unescape the source.')
  .option('-R, --resultOnly', 'Print the format result only.')
  .parse(process.argv);

const { indent, keyQtMark, valQtMark, isStrict, isUnescape, resultOnly } = program;

const options = {};

if (indent && indent.match(/^([1-9])$/)) options.indent = +indent;
if (['\'', '"', ''].includes(keyQtMark)) options.keyQtMark = keyQtMark;
if (['\'', '"'].includes(valQtMark)) options.valQtMark = valQtMark;
if (isStrict) options.isStrict = true;
if (isUnescape) options.isUnescape = true;
if (resultOnly) options.resultOnly = true;

prompt({
  type: 'input',
  name: 'source',
  message: 'Input a string to foramt:'
}).then(({ source }) => {
  if (resultOnly) {
    format2json(source, options).then(result => {
      console.log(fn.chalk(result, 'cyan'));
    });
  } else {
    format2json(source, options).then(res => {
      fn.log('', { title: `format-to-json(${package.version})`, pre: true });
      console.log(fn.chalk(res.result, 'cyan'));
      console.log(fn.array(66, '-').join(''));
      console.log(res.status);
      fn.log('', { end: true });
    });
  }
});
