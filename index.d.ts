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

interface FormatResult {
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
  };
}

declare function fmt2json(source: string, options?: FormatOptions): FormatResult;
declare function fmt2json(source: string, options: FormatOptionsResultOnly): string;

export = fmt2json;
