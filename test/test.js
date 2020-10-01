var format2json = require('../format2json');

(async () => {
  jsonLike = await format2json('{a: "aa"}', {});
  console.log(jsonLike.fmtResult);
})();
