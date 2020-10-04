const fn = require('funclib');
const format2json = require('../');

(async () => {
  const source = '{"zjson":"ZJSON","description","Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}';
  fmtInfo = await format2json(source);
  fn.log('', { title: `format-to-json`, pre: true });
  console.log(fn.chalk(fmtInfo.result, 'cyan'));
  console.log(fn.array(66, '-').join(''));
  console.log(fmtInfo.status);
  fn.log('', { end: true });
})();
