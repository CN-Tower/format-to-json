interface FormatOptions {
  indent?: number; // Integer, Large then 0, default: 2
  expand?: boolean; // Default: true
  strict?: boolean; // Default: false
  escape?: boolean; // Default: false
  unscape?: boolean; // Default: false
  keyQtMark?: "'" | '"' | ''; // Default: "\""
  valQtMark?: "'" | '"'; // Default: "\""
}

interface FormatResult {
  result: string;
  fmtType: 'info' | 'success' | 'warning' | 'danger';
  fmtSign: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
  fmtLines: number;
  fmtTime: number;
  message: string;
  errFormat: boolean;
  errIndex: number;
  errNear: string;
  errExpect: string;
}

declare function fmt2json(source: string, options?: FormatOptions): string;
declare function fmt2json(source: string, options: FormatOptions & { withDetails: true }): FormatResult;

export = fmt2json;
