const fn = require('funclib');
const fmt2json = require('../');
const fmt2jsonSrc = require('../src/fmt2json');

const source = '{"name":"zjson","title":"ZJSON | 转杰森","desc":"An online JSON formatting tool","description":"一个在线JSON格式化工具","version":"6.0.0","updateTime":"2024-07-06","webset":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","algorithm":"https://github.com/CN-Tower/format-to-json","language":[{"en-US":"English"},{"zh-CN":"简体中文"}],"keywords":["zjson","转杰森","json-formatter","json格式化","strin-to-json","字符串转JSON"],"jsonProps":{"string":"Hello world","number":1234567890,"boolean":true,"null":null,"array":["element 01","element 02"],"object":{"key":"val","property":"value"}},"arrs":[[[[],[]]]]}';

const isSrc = process.argv[2] === '--src'
let fmtInfo;
if (isSrc) {
  fmtInfo = fmt2jsonSrc(source, { withDetails: true });
} else {
  fmtInfo = fmt2json(source, { withDetails: true });
}

fn.log('', { title: `format-to-json ${isSrc ? '(src)' : '(rst)'}`, pre: true });
console.log(fmtInfo);
fn.log('', { end: true });
