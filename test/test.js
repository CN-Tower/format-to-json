var format2json = require('../');

(async () => {
  const source = '{"zjson":"ZJSON","description":"Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}';
  jsonLike = await format2json(source, { resultOnly: true });
  console.log(jsonLike);
})();
