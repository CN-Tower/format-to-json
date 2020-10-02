# format-to-json

> Format string to a json like template.

[![npm](https://img.shields.io/npm/v/format-to-json.svg)
![LICENSE MIT](https://img.shields.io/npm/l/format-to-json.svg)](https://github.com/CN-Tower/format-to-json/blob/master/LICENSE) 

* [Intterface](#Interface)
* [Usages]()
  - [In terminal]()  
  - [In JavaScript]()

## Interface

#### format2json
```typescript
format2json(source: string, options?: FormatOptions): Promise<FormatResult | string>;
```
#### FormatOptions
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
#### FormatResult
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