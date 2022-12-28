/**
 * @license
 * format-to-json v1.0.1
 * GitHub Repository <https://github.com/CN-Tower/format-to-json>
 * Released under MIT license <https://github.com/CN-Tower/format-to-json/blob/master/LICENSE>
 */
declare function fmt2json(
  source: string,
  options?: fmt2json.Options
): Promise<fmt2json.Result | string>;

declare namespace fmt2json {

  interface Options {
    indent?: number;      // Integer, Large then 0, default: 2
    expand?: boolean;   // Default: true
    strict?: boolean;   // Default: false
    escape?: boolean;   // Default: false
    unscape?: boolean;  // Default: false
    keyQtMark?: "'" | "\"" | ""; // Default: "\""
    valQtMark?: "'" | "\"";      // Default: "\""
  }

  interface Result {
    result: string;
    status: {
      fmtLines: number;
      fmtTime: number;
      fmtType: 'info' | 'success' | 'warning' | 'danger';
      fmtSign: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
      message: string;
      errFormat: boolean;
      errIndex: number;
      errExpect: string;
      errNear: string;
    }
  }
}

export = fmt2json;
