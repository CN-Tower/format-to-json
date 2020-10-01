/**
 * @license
 * format-to-json v1.0.1
 * GitHub Repository <https://github.com/CN-Tower/format-to-json>
 * Released under MIT license <https://github.com/CN-Tower/format-to-json/blob/master/LICENSE>
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (root) {
  /**
   * The variables.
   * Should be initialized at the beginning of the format.
   * { fmtSign } Possibal value: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
   * { fmtType } Possibal value: 'info' | 'success' | 'warning' | 'danger';
   */
  var srcString = void 0,
      curLevel = void 0,
      curIndex = void 0,
      baseIndent = void 0,
      exceptType = void 0,
      exceptSign = void 0,
      signsQueue = void 0,
      isSrcValid = void 0,
      isFmtError = void 0,
      resultOnly = void 0,
      fmtResult = void 0,
      fmtSign = void 0,
      fmtType = void 0,
      fmtLines = void 0,
      message = void 0,
      errFormat = void 0,
      errNear = void 0,
      errIndex = void 0,
      errExpect = void 0,
      fmtOptions = void 0;

  var initVariables = function initVariables(source) {
    srcString = source;
    curLevel = 0;
    curIndex = 1;
    exceptType = '';
    exceptSign = '';
    signsQueue = '';
    isSrcValid = true;
    isFmtError = false;
    resultOnly = false;
    fmtResult = '';
    fmtSign = '';
    fmtType = 'info';
    fmtLines = 0;
    message = '';
    errFormat = false;
    errNear = '';
    errIndex = NaN;
    errExpect = '';
    fmtOptions = {
      indent: 2,
      isExpand: true,
      isStrict: false,
      isEscape: false,
      keyQtMark: '"', // '\'' | '\"' | '';
      valQtMark: '"' // '\'' | '\"';
    };
    baseIndent = getBaseIndent();
  };

  /**
   * The constants.
   */
  var SPACE = ' ';
  var BREAK = '\r\n';

  var ESCAPES_MAP = [{ ptn: /\r\n/mg, str: '' }, { ptn: /\n\r/mg, str: '' }, { ptn: /\n/mg, str: '\\n' }, { ptn: /\r/mg, str: '\\r' }, { ptn: /\f/mg, str: '\\f' }, { ptn: /\t/mg, str: '\\t' }, { ptn: //mg, str: '\\b' }, { ptn: //mg, str: '\\v' }];

  var MESSAGES_MAP = {
    ost: function ost(rowIdx) {
      return 'Expect a string in line: ' + rowIdx;
    },
    col: function col(rowIdx) {
      return 'Expect a colon in line: ' + rowIdx;
    },
    val: function val(rowIdx) {
      return 'Invalid value in line: ' + rowIdx;
    },
    end: function end(rowIdx, brc) {
      return 'Expect a comma or a "' + brc + '" in line: ' + rowIdx;
    },
    war: function war(rowIdx) {
      return 'Formated ' + rowIdx + ' lines, abnormal JSON source!';
    },
    scc: function scc(rowIdx) {
      return 'Success formated ' + rowIdx + ' lines!';
    },
    err: function err() {
      return 'Parse Error, an excessive abnormal Json!';
    }

    /**
     * =================================================================
     * The main function of `format-to-json` util.
     * @param { string } source 
     * @param { object } options 
     * =================================================================
     */
  };function formatToJson(source, options) {
    return new Promise(function (resolve) {
      initVariables(source);
      if (options) {
        if (typeof options.indent === 'number' && options.indent > 0) {
          fmtOptions.indent = options.indent;
        };
        if (typeof options.resultOnly === 'boolean') {
          resultOnly = options.resultOnly;
        }
        if (typeof options.isExpand === 'boolean') {
          fmtOptions.isExpand = options.isExpand;
        }
        if (typeof options.isStrict === 'boolean') {
          fmtOptions.isStrict = options.isStrict;
        }
        if (typeof options.isEscape === 'boolean') {
          fmtOptions.isEscape = options.isEscape;
        }
        if (['\'', '"', ''].includes(options.keyQtMark)) {
          fmtOptions.keyQtMark = options.keyQtMark;
        }
        if (['\'', '"', ''].includes(options.valQtMark)) {
          fmtOptions.valQtMark = options.valQtMark;
        }
      }
      try {
        try {
          if (srcString !== '') eval('srcString = ' + srcString);
          if (srcString === '' || ['object', 'boolean'].includes(typeof srcString === 'undefined' ? 'undefined' : _typeof(srcString))) {
            doNormalFormat(srcString);
          } else {
            doSpecialFormat();
          }
        } catch (err) {
          // console.log(err);
          doSpecialFormat();
        }
      } catch (err) {
        // console.log(err);
        isFmtError = true;
      } finally {
        setFmtStatus();
        resolve(resultOnly ? fmtResult : {
          fmtResult: fmtResult,
          fmtSign: fmtSign,
          fmtType: fmtType,
          fmtLines: fmtLines,
          message: message,
          errFormat: errFormat,
          errNear: errNear,
          errIndex: errIndex,
          errExpect: errExpect
        });
      }
    });
  }

  /**
   * =================================================================
   * Format the Normal JSON source
   * @param {*} src 
   * =================================================================
   */
  function doNormalFormat(src) {
    if ([true, false, null, ''].includes(src)) {
      return fmtResult += String(src);
    }
    if (fmtOptions.isStrict) {
      src = JSON.parse(JSON.stringify(src));
    }
    src instanceof Array ? arrayHandler(src) : objectHandler(src);
  }

  function arrayHandler(srcArr) {
    var curIndent = void 0;
    if (srcArr.length > 0) {
      fmtResult += brkLine4Normal('[');
      if (fmtOptions.isExpand) curIndex++;
      curLevel++;
      for (var i = 0; i < srcArr.length; i++) {
        curIndent = fmtOptions.isExpand ? getCurIndent() : '';
        fmtResult += curIndent;
        valueHandler(srcArr[i]);
        fmtResult += brkLine4Normal(i < srcArr.length - 1 ? ',' : '');
      }
      curLevel--;
      curIndent = fmtOptions.isExpand ? getCurIndent() : '';
      fmtResult += curIndent + ']';
    } else {
      fmtResult += '[]';
    }
  }

  function objectHandler(srcObj) {
    var curIndent = void 0;
    if (Object.keys(srcObj).length > 0) {
      fmtResult += brkLine4Normal('{');
      curLevel++;
      var index = 0;
      var objKeys = Object.keys(srcObj);
      for (var key in srcObj) {
        index++;
        var prop = quoteNormalStr(key, fmtOptions, fmtOptions.keyQtMark);
        curIndent = fmtOptions.isExpand ? getCurIndent() : '';
        fmtResult += curIndent;
        fmtResult += prop;
        fmtResult += fmtOptions.isExpand ? ': ' : ':';
        valueHandler(srcObj[key]);
        fmtResult += brkLine4Normal(index < objKeys.length ? ',' : '');
      }
      curLevel--;
      curIndent = fmtOptions.isExpand ? getCurIndent() : '';
      fmtResult += curIndent + '}';
    } else {
      fmtResult += '{}';
    }
  }

  function valueHandler(value) {
    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
      case 'undefined':case 'function':
        return fmtResult += String(value);
      case 'number':case 'boolean':
        return fmtResult += value;
      case 'object':
        return doNormalFormat(value);
      case 'string':
        return fmtResult += quoteNormalStr(value, fmtOptions, fmtOptions.valQtMark);
    }
  }

  /**
   * =================================================================
   * Format the Abnormal JSON source
   * =================================================================
   */
  function doSpecialFormat() {
    srcString = srcString.replace(/^\s*/, '');
    if (srcString.length === 0) return;
    var isMatched = false;
    switch (srcString[0]) {
      case '\'':
      case '"':
        isMatched = true;quotaHandler();break;
      case ':':
        isMatched = true;colonHandler();break;
      case ',':
        isMatched = true;commaHandler();break;
      case '{':
        isMatched = true;objPreHandler();break;
      case '}':
        isMatched = true;objEndHandler();break;
      case '[':
        isMatched = true;arrPreHandler();break;
      case ']':
        isMatched = true;arrEndHandler();break;
      case '(':
        isMatched = true;tupPreHandler();break;
      case ')':
        isMatched = true;tupEndHandler();break;
    }
    if (!isMatched) {
      var unicMt = srcString.match(/^u(\s)?'|^u(\s)?"/);
      if (unicMt) {
        isMatched = true;
        unicHandler(unicMt[0]);
      }
    }
    if (!isMatched) {
      var numbMt = srcString.match(/^(-?[0-9]+\.?[0-9]*|0[xX][0-9a-fA-F]+)/);
      if (numbMt) {
        isMatched = true;
        numbHandler(numbMt[0]);
      }
    }
    if (!isMatched) {
      var boolMt = srcString.match(/^(true|false|True|False)/);
      if (boolMt) {
        isMatched = true;
        boolHandler(boolMt[0]);
      }
    }
    if (!isMatched) {
      var nullMt = srcString.match(/^(null|undefined|None|NaN)/);
      if (nullMt) {
        isMatched = true;
        nullHandler(nullMt[0]);
      }
    }
    if (!isMatched) otheHandler();
    return doSpecialFormat();
  }

  function quotaHandler() {
    if (srcString[0] === '\'') isSrcJson = false;
    var rest = getSrcRest();
    var restIdx = getNextQuotaIndex(srcString[0], rest);
    chkFmtExpect(srcString[0]);
    var quoteMt = srcString.substr(0, 1);
    var isProperty = exceptType === 'ost';
    var strInQuote = '';
    if (restIdx > -1) {
      strInQuote = srcString.substr(1, restIdx);
      fmtResult += quoteSpecialStr(strInQuote, fmtOptions, quoteMt, isProperty);
      setFmtExpect(srcString[0]);
      srcString = getSrcRest(restIdx + 2);
    } else {
      strInQuote = srcString.substr(1);
      fmtResult += quoteSpecialStr(strInQuote, fmtOptions, quoteMt, isProperty);
      setFmtExpect('!');
      srcString = '';
    }
  }

  function colonHandler() {
    fmtResult += fmtOptions.isExpand ? ': ' : ':';
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    srcString = getSrcRest();
  }

  function commaHandler() {
    var curIndent = getCurIndent();
    if (fmtOptions.isExpand) curIndex++;
    fmtResult += fmtOptions.isExpand ? ',' + (BREAK + curIndent) : ',';
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    srcString = getSrcRest();
    if (srcString.replace(/(\r)?\n|\s/mg, '') === '') setFmtError('val');
  }

  function objPreHandler() {
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    if (srcString[1] && srcString[1] === '}') {
      fmtResult += '{}';
      setFmtExpect('}');
      srcString = getSrcRest(2);
    } else {
      curLevel++;
      fmtResult += '{';
      brkLine4Special();
      srcString = getSrcRest();
    }
  }

  function objEndHandler() {
    curLevel--;
    brkLine4Special('}');
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    srcString = getSrcRest();
  }

  function arrPreHandler() {
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    if (srcString[1] && srcString[1] === ']') {
      fmtResult += '[]';
      setFmtExpect(']');
      srcString = getSrcRest(2);
    } else {
      curLevel++;
      fmtResult += '[';
      brkLine4Special();
      srcString = getSrcRest();
    }
  }

  function arrEndHandler() {
    curLevel--;
    brkLine4Special(']');
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    srcString = getSrcRest();
  }

  function tupPreHandler() {
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    if (srcString[1] && srcString[1] === ')') {
      fmtResult += fmtOptions.isStrict ? '[]' : '()';
      setFmtExpect(')');
      srcString = getSrcRest(2);
    } else {
      curLevel++;
      fmtResult += fmtOptions.isStrict ? '[' : '(';
      brkLine4Special();
      srcString = getSrcRest();
    }
  }

  function tupEndHandler() {
    curLevel--;
    brkLine4Special(fmtOptions.isStrict ? ']' : ')');
    chkFmtExpect(srcString[0]);
    setFmtExpect(srcString[0]);
    srcString = getSrcRest();
  }

  function unicHandler(unicMt) {
    var rest = getSrcRest(unicMt.length);
    var restIdx = unicMt.indexOf('\'') > -1 ? getNextQuotaIndex('\'', rest) : getNextQuotaIndex('"', rest);
    chkFmtExpect('u');
    var isProperty = exceptType === 'ost';
    var uniqStr = '';
    if (restIdx > -1) {
      var cutIdx = restIdx + unicMt.length + 1;
      uniqStr = srcString.substr(unicMt.length, cutIdx - unicMt.length - 1);
      fmtResult += quoteSpecialStr(uniqStr, fmtOptions, unicMt, isProperty);
      setFmtExpect('u');
      srcString = getSrcRest(cutIdx);
    } else {
      uniqStr = srcString.substr(unicMt.length);
      fmtResult += quoteSpecialStr(uniqStr, fmtOptions, unicMt, isProperty);
      setFmtExpect('!');
      srcString = '';
    }
  }

  function numbHandler(numbMt) {
    fmtResult += numbMt;
    chkFmtExpect('n');
    setFmtExpect('n');
    srcString = getSrcRest(numbMt.length);
  }

  function boolHandler(boolMt) {
    fmtResult += fmtOptions.isStrict ? boolMt.toLowerCase() : boolMt;
    chkFmtExpect('b');
    setFmtExpect('b');
    srcString = getSrcRest(boolMt.length);
  }

  function nullHandler(nullMt) {
    fmtResult += fmtOptions.isStrict ? 'null' : nullMt;
    chkFmtExpect('N');
    setFmtExpect('N');
    srcString = getSrcRest(nullMt.length);
  }

  function otheHandler() {
    var strMatch = srcString.match(/^[^\{\}\[\]\(\):,]*/);
    var strMated = strMatch && strMatch[0] || '';
    if (strMated) {
      fmtResult += strMated;
      chkFmtExpect('!');
      srcString = getSrcRest(strMated.length);
    }
  }

  function chkFmtExpect(sign) {
    if (isSrcValid) {
      switch (exceptType) {
        case 'val':
          if (':,}])!'.includes(sign)) {
            setFmtError('val');
          }break;
        case 'ost':
          if (!'\'"unbN'.includes(sign)) {
            setFmtError('ost');
          }break;
        case 'end':
          var endBracket = getBracketPair(exceptSign);
          if (![',', endBracket].includes(sign)) {
            setFmtError('end', endBracket);
          }break;
        case 'col':
          if (sign !== ':') {
            setFmtError('col');
          }break;
      }
    }
  }

  function setFmtExpect(sign) {
    switch (sign) {
      case ':':
        exceptType = 'val';
        break;
      case ',':
        exceptSign === '{' ? exceptType = 'ost' : exceptType = 'val';
        break;
      case '{':
        exceptSign = sign;
        signsQueue += sign;
        exceptType = 'ost';
        break;
      case '}':
        signsQueue = signsQueue.substr(0, signsQueue.length - 1);
        exceptSign = signsQueue.substr(-1);
        exceptType = 'end';
        break;
      case '[':
        exceptSign = sign;
        signsQueue += sign;
        exceptType = 'val';
        break;
      case ']':
        signsQueue = signsQueue.substr(0, signsQueue.length - 1);
        exceptSign = signsQueue.substr(-1);
        exceptType = 'end';
        break;
      case '(':
        exceptSign = sign;
        signsQueue += sign;
        exceptType = 'val';
        break;
      case ')':
        signsQueue = signsQueue.substr(0, signsQueue.length - 1);
        exceptSign = signsQueue.substr(-1);
        exceptType = 'end';
        break;
      case 'u':
      case 'n':
      case 'b':
      case 'N':
      case '"':
      case '\'':
        exceptType === 'ost' ? exceptType = 'col' : exceptType = 'end';
        break;
    }
  }

  function setFmtError(type) {
    var brc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    switch (type) {
      case 'war':
        fmtType = 'warning';break;
      case 'scc':
        fmtType = 'success';break;
      default:
        fmtType = 'danger';break;
    }
    if (['ost', 'col', 'val', 'end'].includes(type)) {
      isSrcValid = false;
      errExpect = brc;
      errIndex = curIndex;
    }
    fmtSign = type;
  }

  function setFmtStatus() {
    if (isFmtError && !errIndex) {
      setFmtError('err');
      errFormat = true;
    } else if (isSrcValid) {
      if (signsQueue) {
        var expBracket = getBracketPair(signsQueue.substr(-1));
        setFmtError('end', expBracket);
      }
      setFmtError('scc');
    }
    fmtLines = curIndex;
  }

  /**
   * =================================================================
   * Util functions for the format.
   * =================================================================
   */

  function brkLine4Normal(str) {
    if (!fmtOptions.isExpand) return str;
    curIndex++;
    return str + BREAK;
  }

  function brkLine4Special() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (!fmtOptions.isExpand) return fmtResult += str;
    curIndex++;
    fmtResult += BREAK + getCurIndent() + str;
  }

  function quoteNormalStr(qtStr, conf, quote) {
    var isFromAbnormal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var isEscape = conf.isEscape && conf.keyQtMark === '"' && quote === '"' && (!isFromAbnormal || conf.isStrict);
    qtStr = isFromAbnormal ? qtStr.replace(/(?!\\[b|f|n|\\|r|t|x|v|'|"|0])\\/mg, '\\\\') : qtStr.replace(/\\/mg, '\\\\');
    ESCAPES_MAP.forEach(function (esp) {
      return qtStr = qtStr.replace(esp.ptn, esp.str);
    });
    var quote_ = isEscape ? '\\' + quote : quote;
    if (isEscape) qtStr = qtStr.replace(/\\/mg, '\\\\');
    switch (quote) {
      case '"':
        qtStr = isEscape ? qtStr.replace(/"/mg, '\\\\\\"') : qtStr.replace(/"/mg, '\\"');
        return quote_ + qtStr + quote_;
      case '\'':
        qtStr = qtStr.replace(/'/mg, '\\\'');
        return quote_ + qtStr + quote_;
      default:
        return qtStr;
    };
  }

  function quoteSpecialStr(qtStr, conf, quoteMt, isProperty) {
    var quote = isProperty ? conf.keyQtMark : conf.valQtMark;
    qtStr = qtStr.replace(/(?!\\[b|f|n|\\|r|t|x|v|'|"|0])\\/mg, '');
    qtStr = qtStr.replace(/\\\"/mg, '\"');
    qtStr = qtStr.replace(/\\\'/mg, '\'');
    qtStr = quoteNormalStr(qtStr, conf, quote, true);
    if (!conf.isStrict && quoteMt.length > 1) {
      qtStr = quoteMt.substr(0, quoteMt.length - 1) + qtStr;
    }
    return qtStr;
  }

  function getSrcRest() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    return srcString.length > len ? srcString.substr(len) : '';
  }

  function getNextQuotaIndex(quo, rest) {
    for (var i = 0; i < rest.length; i++) {
      if (rest[i] === quo) {
        if (i === 0 || rest[i - 1] !== '\\' || rest[i - 1] === '\\' && rest[i - 2] === '\\' && rest[i - 3] !== '\\') {
          return i;
        }
      }
    }
    return -1;
  }

  function getBaseIndent() {
    var indent = '';
    for (var i = 0; i < fmtOptions.indent; i++) {
      indent += SPACE;
    }
    return indent;
  }

  function getCurIndent() {
    var indent = '';
    for (var i = 0; i < curLevel; i++) {
      indent += baseIndent;
    }
    return indent;
  }

  function getBracketPair(braSign) {
    var pre = ['{', '[', '('];
    var end = ['}', ']', ')'];
    var preIdx = pre.indexOf(braSign);
    var endIdx = end.indexOf(braSign);
    return preIdx > -1 ? end[preIdx] : pre[endIdx];
  }

  /**
   * =================================================================
   * UMD modules define.
   * =================================================================
   */
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return formatToJson;
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = formatToJson;
  } else {
    root.formatToJson = formatToJson;
  }
})(this);