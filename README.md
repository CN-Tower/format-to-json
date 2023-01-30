# format-to-json

<p align="center">
  <a href="https://unpkg.com/format-to-json@2.1.1/index.html">
    <img src="https://github.com/CN-Tower/format-to-json/blob/master/images/format_html.png?raw=true">
  </a>
</p>

[![npm](https://img.shields.io/npm/v/format-to-json.svg)](https://www.npmjs.com/package/format-to-json)
[![LICENSE MIT](https://img.shields.io/npm/l/format-to-json.svg)](https://github.com/CN-Tower/format-to-json/blob/master/LICENSE)

> Format string to a json like template

- [Usages](#Usages)
  - [In html](#in-html)
  - [In javascript](#in-javascript)
- [Interface](#Interface)
  - [fmt2json](#mehtod-fmt2json)
  - [FormatOptions](#interface-formatoptions)
  - [FormatResult](#interface-formatresult)
- [Terminal](#Terminal)

## Usages

#### In html

```html
<script src="https://unpkg.com/format-to-json@3.0.0/fmt2json.min.js"></script>
<script>
  const source = `{"zjson":"ZJSON","description":"Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}`;

  const jsonString = fmt2json(source, { resultOnly: true });
  console.log(jsonString);
</script>
```

#### In javascript

Run: `npm install format-to-json --save`;

```javascript
const fmt2json = require('format-to-json');
const source =
  '{"zjson":"ZJSON","description":"Online json formatter","version":"v4.1.8","updateTime":"2018-11-23","url":"http://zjson.net","project":"http://github.com/CN-Tower/zjson","language":["中文（简体）","English"],"keywords":["zjson","json formatter"],"content":{"array":["element 001","element 002"],"boolean":true,"null":null,"number":123,"string":"Hello World","object":{"property":"value","key":"val"}}}';

const fmtInfo = fmt2json(source);
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

#### [Mehtod] fmt2json

```typescript
declare function fmt2json(source: string, options?: FormatOptions): FormatResult;
declare function fmt2json(source: string, options: FormatOptionsResultOnly): string;
```

#### [Interface] FormatOptions

```typescript
interface FormatOptions {
  indent?: number; // Integer, Large then 0, default: 2
  expand?: boolean; // Default: true
  strict?: boolean; // Default: false
  escape?: boolean; // Default: false
  unscape?: boolean; // Default: false
  keyQtMark?: "'" | '"' | ''; // Default: "\""
  valQtMark?: "'" | '"'; // Default: "\""
}
interface FormatOptionsResultOnly extends FormatOptions {
  resultOnly: true
}
```

#### [Interface] FormatResult

```typescript
interface FormatResult {
  result: string;
  status: {
    fmtLines: number;
    fmtTime: number; // milliseconds
    fmtType: 'info' | 'success' | 'warning' | 'danger';
    fmtSign: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
    message: string;
    errFormat: boolean;
    errIndex: number;
    errExpect: string;
    errNear: string;
  };
}
```

## Terminal

<p align="left">
  <img width="500" src="https://github.com/CN-Tower/format-to-json/blob/master/images/format_cmd.png?raw=true">
</p>

Run: `npm install -g format-to-json`  
Run: `fmt2json -h`

```terminal
Usage: fmt2json [options]

Options:
  -V, --version          output the version number
  -v, --version          output the version number
  -i, --indent <indent>  Indnet number.
  -q, --qtMark <qtMark>  Quotation mark, one of ['""', "''", '"', "'"] (default: "\"\"")
  -c, --collapse         Collapse the formatted results.
  -e, --escape           Escape the formatted results.
  -u, --unescape         Unescape source before format.
  -s, --strict           Strict mode.
  -r, --resultOnly       Result only, not return the formatted info.
  -h, --help             output usage information
```

Run: `fmt2json -i 4 -q "'"`

```terminal
√ Input a string to foramt: · [{name: "Tom", age: 28, gender: "male"}]

==================================================================
                [21:50:53] format-to-json(3.0.0)
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
  fmtTime: 0.9257959127426147,
  message: 'Success formated 8 lines!',
  errFormat: false,
  errIndex: NaN,
  errExpect: '',
  errNear: '' }
==================================================================
```
