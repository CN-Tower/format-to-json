# format-to-json

[![npm](https://img.shields.io/npm/v/format-to-json.svg)](https://www.npmjs.com/package/format-to-json)
[![LICENSE MIT](https://img.shields.io/npm/l/format-to-json.svg)](https://github.com/CN-Tower/format-to-json/blob/master/LICENSE)

> Format string to a json like template 

* [Usages](#Usages)
  - [In HTML](#in-html)
  - [In JavaScript](#in-javascript)
* [Intterface](#Interface)
  - [format2json](#mehtod-format2json)
  - [FormatOptions](#interface-formatoptions)
  - [FormatResult](#interface-formatresult)
* [Terminal](#Terminal)


## Usages
#### In HTML
```html
<script src="https://unpkg.com/format-to-json@1.0.0/format-to-json.min.js"></script>
<script>
  const source = `{"zjson":"ZJSON","description":"Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}`;
  const jsonLike = await format2json(source, { resultOnly: true });
  console.log(jsonLike);
</script>
```
#### In Javascript
Run: `npm install format-to-json --save`;
```javascript
const format2json = require('format-to-json');

const source = '{"zjson":"ZJSON","description":"Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}';

fmtInfo = await format2json(source);
console.log(fmtInfo.result);
```
Result:
```terminal
{
  "zjson": "ZJSON",
  "description": "Online json formatter",
  "version": "v4.1.8",
  "updateTime": "2018-11-23",
  "url": "http://zjson.net",
  "project": "http://github.com/CN-Tower/zjson",
  "language": [
    "中文（简体）",
    "English"
  ],
  "keywords": [
    "zjson",
    "json formatter"
  ],
  "content": {
    "array": [
      "element 001",
      "element 002"
    ],
    "boolean": true,
    "null": null,
    "number": 123,
    "string": "Hello World",
    "object": {
      "property": "value",
      "key": "val"
    }
  }
}
```

## Interface

#### [Mehtod] format2json
```typescript
format2json(source: string, options?: FormatOptions): Promise<FormatResult | string>;
```
#### [Interface] FormatOptions
```typescript
interface FormatOptions {
  indent?: number;      // Integer, Large then 0, default: 2
  isExpand?: boolean;   // Default: true
  isStrict?: boolean;   // Default: false
  isEscape?: boolean;   // Default: false
  isUnscape?: boolean;  // Default: false
  keyQtMark?: "'" | "\"" | ""; // Default: "\""
  valQtMark?: "'" | "\"";      // Default: "\""
}
```
#### [Interface] FormatResult
```typescript
// If `{ resultOnly: true }` in option,
// Just eturn the format result string.
interface FormatResult {
  result: string;
  status: {
    fmtType: 'info' | 'success' | 'warning' | 'danger';
    fmtSign: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
    fmtLines: number;
    message: string;
    errFormat: boolean;
    errIndex: number;
    errExpect: string;
    errNear: string;
  }
}
```

## Terminal

Run: `npm install -g format-to-json`
Run: `format2json -h`
```terminal
Usage: format2json [options]

Options:
  -V, --version                output the version number
  -i, --indent [indent]        Indnet for the format.
  -k, --keyQtMark [keyQtMark]  Key quotation mark.
  -v, --valQtMark [valQtMark]  Value quotation mark.
  -S, --isStrict               Strict format to a JSON template.
  -U, --isUnescape             Unescape the source.
  -R, --resultOnly             Print the format result only.
  -h, --help                   output usage information
```
Run: `format2json -i 4 -k "" -v "'"`
```terminal
√ Input a string to foramt: · [{name: "Tom", age: 28, gender: "male"}]

==================================================================
                [10:42:20] format-to-json(1.0.0)
------------------------------------------------------------------
[
    {
        name: 'Tom',
        age: 28,
        gender: 'male'
    }
]
------------------------------------------------------------------
{ fmtType: 'success',
  fmtSign: 'scc',
  fmtLines: 8,
  message: 'Success formated 8 lines!',
  errFormat: false,
  errIndex: NaN,
  errExpect: '',
  errNear: '' }
==================================================================
```