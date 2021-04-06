/**
 * @license
 * format-to-json v2.1.1
 * GitHub Repository <https://github.com/CN-Tower/format-to-json>
 * Released under MIT license <https://github.com/CN-Tower/format-to-json/blob/master/LICENSE>
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (root) {

  var BREAK = '\r\n';
  var SPACE = ' ';

  var OPTIONS = {
    indent: 2,
    isExpand: true,
    isStrict: false,
    isEscape: false,
    isUnscape: false,
    keyQtMark: '"', // '\'' | '\"' | '';
    valQtMark: '"' // '\'' | '\"';
  };

  var ESCAPES_MAP = [{ ptn: /\r\n/mg, str: '' }, { ptn: /\n\r/mg, str: '' }, { ptn: /\n/mg, str: '\\n' }, { ptn: /\r/mg, str: '\\r' }, { ptn: //mg, str: '\\b' }, { ptn: //mg, str: '\\v' }, { ptn: /\f/mg, str: '\\f' }, { ptn: /\t/mg, str: '\\t' }];

  var MESSAGES_MAP = {
    err: function err() {
      return 'Parse Error, an excessive abnormal Json!';
    },
    war: function war(rowIdx) {
      return 'Formated ' + rowIdx + ' lines, abnormal JSON source!';
    },
    scc: function scc(rowIdx) {
      return 'Success formated ' + rowIdx + ' lines!';
    },
    val: function val(rowIdx) {
      return 'Invalid value in line: ' + rowIdx;
    },
    ost: function ost(rowIdx) {
      return 'Expect a string in line: ' + rowIdx;
    },
    col: function col(rowIdx) {
      return 'Expect a colon in line: ' + rowIdx;
    },
    end: function end(rowIdx, brc) {
      return 'Expect a comma or a "' + brc + '" in line: ' + rowIdx;
    }
  };

  /**
   * =================================================================
   * The main function of `format-to-json` util.
   * @param { string } source 
   * @param { object } options 
   * =================================================================
   */
  function fmt2json(source, options) {
    return new Promise(function (resolve) {
      /**
       * The variables.
       * Should be initialized at the beginning of the format.
       * { fmtSign } Possibal value: 'ost' | 'col' | 'val' | 'end' | 'war' | 'scc' | 'err';
       * { fmtType } Possibal value: 'info' | 'success' | 'warning' | 'danger';
       */
      var fmtSource = source,
          curLevel = 0,
          curIndex = 1,
          exceptType = '',
          exceptSign = '',
          signsQueue = '',
          baseIndent = '',
          isSrcValid = true,
          isFmtError = false,
          resultOnly = false,
          fmtResult = '',
          fmtType = 'info',
          fmtSign = '',
          fmtLines = 0,
          message = '',
          errFormat = false,
          errNear = '',
          errIndex = NaN,
          errExpect = '';

      if (options) {
        if (typeof options.resultOnly === 'boolean') {
          resultOnly = options.resultOnly;
        }
        if (typeof options.expand === 'boolean') {
          OPTIONS.isExpand = options.expand;
        }
        if (typeof options.strict === 'boolean') {
          OPTIONS.isStrict = options.strict;
        }
        if (typeof options.escape === 'boolean') {
          OPTIONS.isEscape = options.escape;
        }
        if (typeof options.unscape === 'boolean') {
          OPTIONS.isUnscape = options.unscape;
        }
        if (typeof options.indent === 'number' && options.indent > 0) {
          OPTIONS.indent = options.indent;
        };
        if (['\'', '"', ''].indexOf(options.keyQtMark) > -1) {
          OPTIONS.keyQtMark = options.keyQtMark;
        }
        if (['\'', '"'].indexOf(options.valQtMark) > -1) {
          OPTIONS.valQtMark = options.valQtMark;
        }
      }
      baseIndent = getBaseIndent();

      try {
        try {
          if (fmtSource !== '') eval('fmtSource = ' + fmtSource);
          if (fmtSource === '' || ['object', 'boolean'].indexOf(typeof fmtSource === 'undefined' ? 'undefined' : _typeof(fmtSource)) > -1) {
            doNormalFormat(fmtSource);
          } else {
            if (OPTIONS.isUnscape) {
              fmtSource = fmtSource.replace(/\\"/mg, '"').replace(/\\\\/mg, '\\');
            }
            doSpecialFormat();
          }
        } catch (err) {
          // console.log(err);
          if (OPTIONS.isUnscape) {
            fmtSource = fmtSource.replace(/\\"/mg, '"').replace(/\\\\/mg, '\\');
          }
          doSpecialFormat();
        }
      } catch (err) {
        // console.log(err);
        isFmtError = true;
      } finally {
        setFmtStatus();
        resolve(resultOnly ? fmtResult : {
          result: fmtResult,
          status: {
            fmtType: fmtType, fmtSign: fmtSign, fmtLines: fmtLines, message: message,
            errFormat: errFormat, errIndex: errIndex, errExpect: errExpect, errNear: errNear
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
        if ([true, false, null, ''].indexOf(src) > -1) {
          return fmtResult += String(src);
        }
        if (OPTIONS.isStrict) {
          src = JSON.parse(JSON.stringify(src));
        }
        src instanceof Array ? arrayHandler(src) : objectHandler(src);
      }

      function arrayHandler(srcArr) {
        var curIndent = void 0;
        if (srcArr.length > 0) {
          fmtResult += brkLine4Normal('[');
          if (OPTIONS.isExpand) curIndex++;
          curLevel++;
          for (var i = 0; i < srcArr.length; i++) {
            curIndent = OPTIONS.isExpand ? getCurIndent() : '';
            fmtResult += curIndent;
            valueHandler(srcArr[i]);
            fmtResult += brkLine4Normal(i < srcArr.length - 1 ? ',' : '');
          }
          curLevel--;
          curIndent = OPTIONS.isExpand ? getCurIndent() : '';
          fmtResult += curIndent + ']';
        } else {
          fmtResult += '[]';
        }
      }

      function objectHandler(srcObj) {
        var objKeys = Object.keys(srcObj);
        if (objKeys.length > 0) {
          var curIndent = void 0,
              index = 0;
          fmtResult += brkLine4Normal('{');
          curLevel++;
          for (var key in srcObj) {
            index++;
            var prop = quoteNormalStr(key, OPTIONS.keyQtMark);
            curIndent = OPTIONS.isExpand ? getCurIndent() : '';
            fmtResult += curIndent;
            fmtResult += prop;
            fmtResult += OPTIONS.isExpand ? ': ' : ':';
            valueHandler(srcObj[key]);
            fmtResult += brkLine4Normal(index < objKeys.length ? ',' : '');
          }
          curLevel--;
          curIndent = OPTIONS.isExpand ? getCurIndent() : '';
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
            return fmtResult += quoteNormalStr(value, OPTIONS.valQtMark);
        }
      }

      /**
       * =================================================================
       * Format the Abnormal JSON source
       * =================================================================
       */
      function doSpecialFormat() {
        fmtSource = fmtSource.replace(/^\s*/, '');
        if (fmtSource.length === 0) return;
        var isMatched = false;
        switch (fmtSource[0]) {
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
          var unicMt = fmtSource.match(/^u(\s)?'|^u(\s)?"/);
          if (unicMt) {
            isMatched = true;
            unicHandler(unicMt[0]);
          }
        }
        if (!isMatched) {
          var numbMt = fmtSource.match(/^(-?[0-9]+\.?[0-9]*|0[xX][0-9a-fA-F]+)/);
          if (numbMt) {
            isMatched = true;
            numbHandler(numbMt[0]);
          }
        }
        if (!isMatched) {
          var boolMt = fmtSource.match(/^(true|false|True|False)/);
          if (boolMt) {
            isMatched = true;
            boolHandler(boolMt[0]);
          }
        }
        if (!isMatched) {
          var nullMt = fmtSource.match(/^(null|undefined|None|NaN)/);
          if (nullMt) {
            isMatched = true;
            nullHandler(nullMt[0]);
          }
        }
        if (!isMatched) otheHandler();
        return doSpecialFormat();
      }

      function quotaHandler() {
        var rest = getSrcRest();
        var restIdx = getNextQuotaIndex(fmtSource[0], rest);
        chkFmtExpect(fmtSource[0]);
        var quoteMt = fmtSource.substr(0, 1);
        var isProperty = exceptType === 'ost';
        var strInQuote = '';
        if (restIdx > -1) {
          strInQuote = fmtSource.substr(1, restIdx);
          fmtResult += quoteSpecialStr(strInQuote, quoteMt, isProperty);
          setFmtExpect(fmtSource[0]);
          fmtSource = getSrcRest(restIdx + 2);
        } else {
          strInQuote = fmtSource.substr(1);
          fmtResult += quoteSpecialStr(strInQuote, quoteMt, isProperty);
          setFmtExpect('!');
          fmtSource = '';
        }
      }

      function colonHandler() {
        fmtResult += OPTIONS.isExpand ? ': ' : ':';
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        fmtSource = getSrcRest();
      }

      function commaHandler() {
        var curIndent = getCurIndent();
        if (OPTIONS.isExpand) curIndex++;
        fmtResult += OPTIONS.isExpand ? ',' + (BREAK + curIndent) : ',';
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        fmtSource = getSrcRest();
        if (fmtSource.replace(/(\r)?\n|\s/mg, '') === '') setFmtError('val');
      }

      function objPreHandler() {
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        if (fmtSource[1] && fmtSource[1] === '}') {
          fmtResult += '{}';
          setFmtExpect('}');
          fmtSource = getSrcRest(2);
        } else {
          curLevel++;
          fmtResult += '{';
          brkLine4Special();
          fmtSource = getSrcRest();
        }
      }

      function objEndHandler() {
        curLevel--;
        brkLine4Special('}');
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        fmtSource = getSrcRest();
      }

      function arrPreHandler() {
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        if (fmtSource[1] && fmtSource[1] === ']') {
          fmtResult += '[]';
          setFmtExpect(']');
          fmtSource = getSrcRest(2);
        } else {
          curLevel++;
          fmtResult += '[';
          brkLine4Special();
          fmtSource = getSrcRest();
        }
      }

      function arrEndHandler() {
        curLevel--;
        brkLine4Special(']');
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        fmtSource = getSrcRest();
      }

      function tupPreHandler() {
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        if (fmtSource[1] && fmtSource[1] === ')') {
          fmtResult += OPTIONS.isStrict ? '[]' : '()';
          setFmtExpect(')');
          fmtSource = getSrcRest(2);
        } else {
          curLevel++;
          fmtResult += OPTIONS.isStrict ? '[' : '(';
          brkLine4Special();
          fmtSource = getSrcRest();
        }
      }

      function tupEndHandler() {
        curLevel--;
        brkLine4Special(OPTIONS.isStrict ? ']' : ')');
        chkFmtExpect(fmtSource[0]);
        setFmtExpect(fmtSource[0]);
        fmtSource = getSrcRest();
      }

      function unicHandler(unicMt) {
        var rest = getSrcRest(unicMt.length);
        var restIdx = unicMt.indexOf('\'') > -1 ? getNextQuotaIndex('\'', rest) : getNextQuotaIndex('"', rest);
        chkFmtExpect('u');
        var isProperty = exceptType === 'ost';
        var uniqStr = '';
        if (restIdx > -1) {
          var cutIdx = restIdx + unicMt.length + 1;
          uniqStr = fmtSource.substr(unicMt.length, cutIdx - unicMt.length - 1);
          fmtResult += quoteSpecialStr(uniqStr, unicMt, isProperty);
          setFmtExpect('u');
          fmtSource = getSrcRest(cutIdx);
        } else {
          uniqStr = fmtSource.substr(unicMt.length);
          fmtResult += quoteSpecialStr(uniqStr, unicMt, isProperty);
          setFmtExpect('!');
          fmtSource = '';
        }
      }

      function numbHandler(numbMt) {
        fmtResult += numbMt;
        chkFmtExpect('n');
        setFmtExpect('n');
        fmtSource = getSrcRest(numbMt.length);
      }

      function boolHandler(boolMt) {
        fmtResult += OPTIONS.isStrict ? boolMt.toLowerCase() : boolMt;
        chkFmtExpect('b');
        setFmtExpect('b');
        fmtSource = getSrcRest(boolMt.length);
      }

      function nullHandler(nullMt) {
        fmtResult += OPTIONS.isStrict ? 'null' : nullMt;
        chkFmtExpect('N');
        setFmtExpect('N');
        fmtSource = getSrcRest(nullMt.length);
      }

      function otheHandler() {
        var strMatch = fmtSource.match(/^[^\{\}\[\]\(\):,]*/);
        var strMated = strMatch && strMatch[0] || '';
        if (strMated) {
          fmtResult += strMated;
          chkFmtExpect('!');
          fmtSource = getSrcRest(strMated.length);
        }
      }

      function chkFmtExpect(sign) {
        if (isSrcValid) {
          switch (exceptType) {
            case 'val':
              if (':,}])!'.indexOf(sign) > -1) {
                setFmtError('val');
              }break;
            case 'ost':
              if ('\'"unbN'.indexOf(sign) === -1) {
                setFmtError('ost');
              }break;
            case 'end':
              var endBracket = getBracketPair(exceptSign);
              if ([',', endBracket].indexOf(sign) === -1) {
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

      function setFmtError(sign) {
        var brc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        switch (sign) {
          case 'war':
            fmtType = 'warning';break;
          case 'scc':
            fmtType = 'success';break;
          default:
            fmtType = 'danger';break;
        }
        if (['ost', 'col', 'val', 'end'].indexOf(sign) > -1) {
          errFormat = true;
          isSrcValid = false;
          errExpect = brc;
          errIndex = curIndex;
          console.log(fmtResult);
          console.log(fmtSource);
          var rstTrailing = fmtResult.substr(-20).replace(/^(\s|\n|\r\n)*/, '').replace(/(\n|\r\n)/mg, '\\n');
          var srcLeading = fmtSource.substr(0, 10).replace(/(\s|\n|\r\n)*$/, '').replace(/(\n|\r\n)/mg, '\\n');
          errNear = '...' + rstTrailing + '>>>>>>' + srcLeading;
        }
        fmtSign = sign;
        message = MESSAGES_MAP[sign](curIndex, brc);
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
        if (!OPTIONS.isExpand) return str;
        curIndex++;
        return str + BREAK;
      }

      function brkLine4Special() {
        var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (!OPTIONS.isExpand) return fmtResult += str;
        curIndex++;
        fmtResult += BREAK + getCurIndent() + str;
      }

      function quoteNormalStr(qtStr, quote) {
        var isFromAbnormal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var isEscape = OPTIONS.isEscape && OPTIONS.keyQtMark === '"' && quote === '"' && (!isFromAbnormal || OPTIONS.isStrict);
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

      function quoteSpecialStr(qtStr, quoteMt, isProperty) {
        var quote = isProperty ? OPTIONS.keyQtMark : OPTIONS.valQtMark;
        qtStr = qtStr.replace(/(?!\\[b|f|n|\\|r|t|x|v|'|"|0])\\/mg, '');
        qtStr = qtStr.replace(/\\\"/mg, '\"');
        qtStr = qtStr.replace(/\\\'/mg, '\'');
        qtStr = quoteNormalStr(qtStr, quote, true);
        if (!OPTIONS.isStrict && quoteMt.length > 1) {
          qtStr = quoteMt.substr(0, quoteMt.length - 1) + qtStr;
        }
        return qtStr;
      }

      function getSrcRest() {
        var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        return fmtSource.length > len ? fmtSource.substr(len) : '';
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
        for (var i = 0; i < OPTIONS.indent; i++) {
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
    });
  }

  /**
   * =================================================================
   * UMD modules define.
   * =================================================================
   */
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return fmt2json;
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = fmt2json;
  } else {
    root.fmt2json = fmt2json;
  }
})(this);