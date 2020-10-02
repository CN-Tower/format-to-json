# format-to-json

[![npm](https://img.shields.io/npm/v/format-to-json.svg)]https://www.npmjs.com/package/format-to-json)
[![LICENSE MIT](https://img.shields.io/npm/l/format-to-json.svg)](https://github.com/CN-Tower/format-to-json/blob/master/LICENSE)

> Format string to a json like template 

[[!zjson](./images/zjson.png)](https://www.zjson.net)

* [Usages]()
  - [In terminal]()  
  - [In JavaScript]()
* [Intterface](#Interface)
  - [format2json](#Mehtodformat2json)
  - [FormatOptions](#InterfaceFormatOptions)
  - [FormatResult](#InterfaceFormatResult)


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