/**
 * @license
 * format-to-json v1.0.1
 * GitHub Repository <https://github.com/CN-Tower/format-to-json>
 * Released under MIT license <https://github.com/CN-Tower/format-to-json/blob/master/LICENSE>
 */
declare function format2json(
  source: string,
  options?: format2json.FormatOptions
): Promise<format2json.FormatResult | string>;

declare namespace format2json {

  interface FormatOptions {
    indent?: number;      // Integer, Large then 0, default: 2
    isExpand?: boolean;   // Default: true
    isStrict?: boolean;   // Default: false
    isEscape?: boolean;   // Default: false
    isUnscape?: boolean;  // Default: false
    keyQtMark?: "'" | "\"" | ""; // Default: "\""
    valQtMark?: "'" | "\"";      // Default: "\""
  }

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
}

export = format2json;
