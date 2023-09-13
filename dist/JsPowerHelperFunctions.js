/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***************************************!*\
  !*** ./src/JsPowerHelperFunctions.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addQuotes: () => (/* binding */ addQuotes),
/* harmony export */   cleanStr: () => (/* binding */ cleanStr),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fixQuotes: () => (/* binding */ fixQuotes),
/* harmony export */   getDirectivesFromString: () => (/* binding */ getDirectivesFromString),
/* harmony export */   getMatchBlock: () => (/* binding */ getMatchBlock),
/* harmony export */   getMatchInBetween: () => (/* binding */ getMatchInBetween),
/* harmony export */   removeQuotes: () => (/* binding */ removeQuotes),
/* harmony export */   setExpString: () => (/* binding */ setExpString),
/* harmony export */   setLookUpExp: () => (/* binding */ setLookUpExp)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower

/**
 * handles the following patterns to get an object from string attributes
 * // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
 * // Matches the Array as string: [value, value] OR ['value','value']
 * // Matches a multi-array string like [[value,value]],value]
 * // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
 * // Matches string ID or class: literals Id(#) or class (.). Note that in Vue it needs to be in quotes attr="'#theId'"
 * // Mathes simple directive function style: directive(#idOr.Class)
 * Note: all the above with the exception of the Id/class will be converted into actual objects
 */
/**
 * Converts strings formats into objects
 * @function getDirectivesFromString
 * @param {String|Array|Object} settings
 * @return {Object|void|null}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 * @example getDirectivesFromString('[[value,value]],value]') // {directive: 'values', directive2: 'values'}
 * @example getDirectivesFromString('directive.tablet|mobile(...values)') // {directive: {tablet: 'values', mobile: 'values'}}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 */
var getDirectivesFromString = function getDirectivesFromString(settings) {
  if (!settings) {
    return null;
  }
  var values, breakDownId, directive, properties;
  var type = _typeof(settings);
  // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
  var regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;

  // Matches the Array as string: [value, value] OR ['value','value']
  var regexArrayLike = /^\[((.|\n)*?)\]$/gm;
  // Matches a multi-array string like [[value,value]],value]
  var regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;
  // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values) OR directive.breakdown|breakdown2(...values)
  var regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
  var regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
  // Matches string ID or class: literals #... or ....
  var regexIdOrClass = /^(\.|\#)([a-zA-Z]+)/g;
  // Mathes simple directive function style: directive(#idOr.Class)
  var regexFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;
  if (type === 'object' || type === 'array') {
    return settings;
  }
  // Else if String

  if (settings.match(regexIdOrClass)) {
    return settings;
  }
  if (settings.match(regexFunctionString)) {
    directive = settings.split('(')[0].trim();
    values = getMatchInBetween(settings, '(', ')');
    settings = {};
    settings[directive] = values;
    return settings;
  }
  if (settings.match(regexArrayLike)) {
    var start = /^\[/;
    var end = /\]$/;
    var keyProps = getMatchInBetween(settings, start, end);
    keyProps = keyProps.split(',');

    // test if multi-array
    if (settings.match(regexMultiArrayString)) {
      keyProps = getMultiArray(settings);
    }
    keyProps.forEach(function (str) {
      var cleanStr = addQuotes(removeQuotes(str));
      settings = settings.replace(str, cleanStr);
    });
    return JSON.parse(fixQuotes(settings));
  }
  if (settings.match(regexObjectLike)) {
    var _keyProps = getMatchInBetween(settings, '{', ':', true);
    _keyProps = _keyProps.concat(getMatchInBetween(settings, ',', ':', true));
    _keyProps.forEach(function (str) {
      var cleanStr = addQuotes(removeQuotes(str));
      settings = settings.replace(str, cleanStr);
    });
    return JSON.parse(fixQuotes(settings));
  }
  if (settings.match(regexDotObjectString) || settings.match(regexExObjectString)) {
    var setObject = {};
    settings = settings.split('&&');
    settings.forEach(function (command) {
      command = command.trim();
      if (command.match(regexExObjectString)) {
        values = getMatchInBetween(command, '](', ')');
        breakDownId = getMatchInBetween(command, '[', ']');
        directive = command.split('[')[0].trim();
      } else {
        var _properties$;
        values = getMatchInBetween(command, '(', ')');
        command = command.replace(getMatchBlock(command, '(', ')'), '');
        properties = command.split('.');
        directive = properties[0];
        breakDownId = properties[1];
        properties[2] = (_properties$ = properties[2]) !== null && _properties$ !== void 0 ? _properties$ : null;
      }
      values = values.split(',').map(function (cl) {
        return cl.trim();
      }).join(' ');
      if (!setObject[directive]) {
        setObject[directive] = {};
      }
      if (properties && properties[2]) {
        setObject[directive][breakDownId] = {};
        setObject[directive][breakDownId][properties[2]] = values;
      } else {
        setObject[directive][breakDownId] = values;
      }
    });
    return setObject;
  }
};

/**
 * Build the multi-array from a string like
 * @private
 * @param {String} str - find The target (needle)
 * @return {Array}
 */
function getMultiArray(str) {
  var _Object$keys$length;
  var arrays = {};
  var innerArrayRegex = /(\[([^[]*?))\]/gm;
  var start = /^\[/;
  var end = /\]$/;
  str = getMatchInBetween(str, start, end);
  var innerArrays = str.match(innerArrayRegex);
  if (innerArrays) {
    var i = 1;
    while (str.match(innerArrayRegex)) {
      str.match(innerArrayRegex).forEach(function (record, index) {
        var $index = "@".concat(i, "@").concat(index);
        arrays[$index] = record;
        str = str.replace(record, $index);
      });
      i++;
    }
  }
  str = str.split(',');
  var total = ((_Object$keys$length = Object.keys(arrays).length) !== null && _Object$keys$length !== void 0 ? _Object$keys$length : 1) * str.length;
  var loops = 0;
  while (Object.keys(arrays).length > 0) {
    var keys = Object.keys(arrays);
    var tmpStr = str;
    Object.keys(arrays).forEach(function (key) {
      var strArray = getMatchInBetween(arrays[key], start, end).split(',');
      var replaced = findAndReplaceInArray(str, key, strArray);
      if (replaced) {
        str = replaced;
        delete arrays[key];
      }
    });
    if (loops > total) {
      throw new Error('Too many loops, the string passed is malformed' + str);
    }
    loops++;
  }
  return str;
}

/**
 * Recursively will loop in array to find the desired target
 * @function findAndReplaceInArray
 * @param {Array} arr
 * @param {String} find The target (needle)
 * @param {Array|Object|String} value Replacer
 * @return {Null|Array}
 * @example findAndReplaceInArray([1,2,3,4,5], 3, 'three') // [1,2,'three',4,5]
 */
function findAndReplaceInArray(arr, find, value) {
  var results = null;
  var tmpArray = arr;
  arr.forEach(function (prop, index) {
    if (Array.isArray(prop)) {
      var replaced = findAndReplaceInArray(prop, find, value);
      if (replaced) {
        tmpArray[index] = replaced;
        results = tmpArray;
      }
    }
    if (prop === find) {
      if (Array.isArray(value)) {
        value = value.map(function (p) {
          if (!Array.isArray(p)) {
            return p.trim();
          }
          return p;
        });
      }
      tmpArray[index] = value;
      results = tmpArray;
    }
  });
  return results;
}

/**
 * find a match in between two delimeters, either string or regex given, returns clean matches
 * @function getMatchBlock
 * @param {String} str
 * @param {String|Regex} p1
 * @param {String|Regex} p2
 * @param {Boolean} all If it should return all matches or single one (default)
 * @return {String|Array|Null}
 * @example getMatchInBetween('hello world', 'h', 'd') // 'ello worl'
 * @example getMatchInBetween('hello <world/>', '<', '/>', true) // ['world']
 * @example getMatchInBetween('hello <world/>', '<', '/>') // 'world'
 */
function getMatchInBetween(str, p1, p2) {
  var all = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (all) {
    var _getMatchBlock;
    var matches = [];
    var group = (_getMatchBlock = getMatchBlock(str, p1, p2, all)) !== null && _getMatchBlock !== void 0 ? _getMatchBlock : [];
    group.forEach(function (match) {
      matches.push(cleanStr(match, p1, p2));
    });
    return matches;
  } else {
    var _getMatchBlock2;
    str = (_getMatchBlock2 = getMatchBlock(str, p1, p2)) !== null && _getMatchBlock2 !== void 0 ? _getMatchBlock2 : str;
    return cleanStr(str, p1, p2);
  }
}

/**
 * Find math by delimeters returns raw matches
 * @function getMatchBlock
 * @param {String} str
 * @param {String|Regex} p1
 * @param {String|Regex} p2
 * @param {Boolean} all If it should return all matches or single one (default)
 * @return {String|Array|Void}
 * @example getMatchBlock('is a hello world today', 'h', 'd') // 'hello world'
 * @example getMatchBlock('is a hello world today', 'h', 'd', true) // ['hello world']
 * @example getMatchBlock('is a <hello world/> today', '<', '/>') // '<hello world/>'
 */
function getMatchBlock(str, p1, p2) {
  var all = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  p1 = setExpString(p1);
  p2 = setExpString(p2);
  var regex = new RegExp(setLookUpExp(p1, p2), 'gm');
  if (all) {
    return str.match(regex);
  } else {
    return str.match(regex)[0];
  }
}

/**
 * Clean a string from delimeters or just trimmed if no delimeters given
 * @funtion cleanStr
 * @param {String} str - String to use
 * @param {String|Regex} p1 - Delimeter 1
 * @param {String|Regex} p2 - Delimeter 2
 * @return {String}
 * @example cleanStr('hello world', 'h', 'd') // 'ello worl'
 * @example cleanStr('  hello world  ') // 'hello world'
 * @example cleanStr('hello world', 'hello') // 'world'
 * @example cleanStr('Hello World. Sunshine is here!', '\..*!') // Hello World
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g) // ' World. Sunshine is here!'
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g, /Sunshine/g) // ' World.  is here!'
 */
function cleanStr(str, p1, p2) {
  return str.replace(new RegExp(setExpString(p1)), '').replace(new RegExp(setExpString(p2)), '').trim();
}

/**
 * Scapes a string to create a regex or returns the regex if it already is an expression
 * @function setExpString
 * @param {String|Regex} exp
 * @return {String|Regex}
 * @example setExpString('hello') // '\h\e\l\l\o'
 * @example setExpString(/hello/) // /hello/
 * @example setExpString([hello]) // \\[hello\\/ then use like new new RegExp(setExpString(StringOrRegex))
 */
function setExpString(exp) {
  if (exp instanceof RegExp) {
    return exp;
  } else {
    return "\\".concat(exp.split('').join('\\'));
  }
}

/**
 * Regex builder to get a match in between two delimeters
 * @function setLookUpExp
 * @param {String|Regex} p1 - Delimeter 1
 * @param {String|Regex} p2 - Delimeter 2
 * @return {String} - Regex
 * @example setLookUpExp('h', 'd') // 'h((.|\n)*?)d'
 * @usage:
 * const pattern = setLookUpExp(".", "!");
const regex = new RegExp(pattern, 'g');
const text = "Hello World. Sunshine is here! Have fun!";
const matches = text.match(regex);
console.log(matches);  // Output: [". Sunshine is here!"]
 */
function setLookUpExp(p1, p2) {
  var p1IsRegex = p1 instanceof RegExp;
  var p2IsRegex = p2 instanceof RegExp;
  if (p1IsRegex || p2IsRegex) {
    if (p1IsRegex) {
      p1 = p1.source;
    }
    if (p2IsRegex) {
      p2 = p2.source;
    }
  }
  return "".concat(p1, "((.|\n)*?)").concat(p2);
}

/**
 * Remove quotes from a string
 * @function removeQuotes
 * @param {String} str
 * @return {String}
 * @example removeQuotes('"hello"') // hello
 * @example removeQuotes("'hello'") // hello
 */
function removeQuotes(str) {
  return str.replace(/'|"/g, '');
}

/**
 * Fix quotes from a string
 * @function fixQuotes
 * @param {String} str
 * @return {String}
 * @example fixQuotes("'hello'") // "hello"
 * @example fixQuotes('"hello"') // "hello"
 */
function fixQuotes(str) {
  return str.replace(/'/g, '"');
}

/**
 * Add quotes to a string
 * @function addQuotes
 * @param {String} str
 * @return {String}
 * @example addQuotes('hello') // "hello"
 */
function addQuotes(str) {
  return "\"".concat(str, "\"");
}
var powerHelper = {
  getDirectivesFromString: getDirectivesFromString,
  getMatchInBetween: getMatchInBetween,
  getMatchBlock: getMatchBlock,
  cleanStr: cleanStr,
  setExpString: setExpString,
  setLookUpExp: setLookUpExp,
  removeQuotes: removeQuotes,
  fixQuotes: fixQuotes,
  addQuotes: addQuotes
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (powerHelper);
window.powerHelper = __webpack_exports__;
/******/ })()
;