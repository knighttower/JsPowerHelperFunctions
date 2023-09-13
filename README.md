
# PowerHelper Library Documentation

This file was created as part of "adaptive.js" (https://github.com/knighttower/adaptive.js) but it can use in any project by itself due to the functionality offered by its module functions.  
Find oter cool things at [knighttower.io](https://knighttower.io)  
[![release version](https://github.com/knighttower/JsPowerHelperFunctions/actions/workflows/pre-release.yml/badge.svg?branch=development)](https://github.com/knighttower/JsPowerHelperFunctions/actions/workflows/pre-release.yml)[![NPM published](https://github.com/knighttower/JsPowerHelperFunctions/actions/workflows/to-npm.yml/badge.svg?branch=development)](https://github.com/knighttower/JsPowerHelperFunctions/actions/workflows/to-npm.yml)


## Table of Contents
- [getDirectivesFromString](#getDirectivesFromString)
- [findAndReplaceInArray](#findAndReplaceInArray)
- [getMatchInBetween](#getMatchInBetween)
- [getMatchBlock](#getMatchBlock)
- [cleanStr](#cleanStr)
- [setExpString](#setExpString)
- [setLookUpExp](#setLookUpExp)
- [removeQuotes](#removeQuotes)
- [fixQuotes](#fixQuotes)
- [addQuotes](#addQuotes)

---

### getDirectivesFromString


**Note**: All the above with the exception of the Id/class will be converted into actual objects

**Function Signature**
```javascript
function getDirectivesFromString(settings: String|Array|Object): Object|void|null;
```
Converts strings formats into objects.

- **Function**: `getDirectivesFromString(settings)`
- **Parameters**: `{String|Array|Object} settings`
- **Returns**: `{Object|void|null}`  

Handles the following patterns to get an object from string attributes:
- Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
- Matches the Array as string: [value, value] OR ['value','value']
- Matches a multi-array string like [[value,value]],value]
- Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
- Matches string ID or class: literals Id(#) or class (.). Note that in Vue it needs to be in quotes attr="'#theId'"
- Matches simple directive function style: directive(#idOr.Class)  

**Examples**
```javascript
getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
getDirectivesFromString('[[value,value]],value]') // {directive: 'values', directive2: 'values'}
getDirectivesFromString('directive.tablet|mobile(...values)') // {directive: {tablet: 'values', mobile: 'values'}}
getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
```

---


### findAndReplaceInArray
**Function Signature**
```javascript
function findAndReplaceInArray(arr: Array, find: String, value: Array|Object|String): Null|Array;
```
Recursively will loop in array to find the desired target.

- **Function**: `findAndReplaceInArray(arr, find, value)`
- **Parameters**: `{Array} arr`, `{String} find`, `{Array|Object|String} value`
- **Returns**: `{Null|Array}`

**Examples**
```javascript
/**
 * Recursively will loop in array to find the desired target
 * @function findAndReplaceInArray
 * @param {Array} arr
 * @param {String} find The target (needle)
 * @param {Array|Object|String} value Replacer
 * @return {Null|Array}
 * @example findAndReplaceInArray([1,2,3,4,5], 3, 'three') // [1,2,'three',4,5]
 */  
```

---

### getMatchInBetween
**Function Signature**
```javascript
function getMatchInBetween(str: String, p1: String|Regex, p2: String|Regex, all: Boolean): String|Array|Null;
```
Find a match in between two delimeters, either string or regex given, returns clean matches.

- **Function**: `getMatchInBetween(str, p1, p2, all)`
- **Parameters**: `{String} str`, `{String|Regex} p1`, `{String|Regex} p2`, `{Boolean} all`
- **Returns**: `{String|Array|Null}`


**Examples**
```javascript
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
```

---

### getMatchBlock  
``getMatchBlock(str, p1, p2, all = false)``  

```javascript
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
```  

---

### cleanStr  
Clean a string from delimeters or just trimmed if no delimeters given  

**Function Signature**
```javascript
function cleanStr(str: String, p1: String|Regex, p2: String|Regex): String;
```

**Examples**
```javascript
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
```

---

### setExpString  
Scapes a string to create a regex or returns the regex if it already is an expression  


``setExpString(exp)``  

```
/**
 * Scapes a string to create a regex or returns the regex if it already is an expression
 * @function setExpString
 * @param {String|Regex} exp
 * @return {String|Regex}
 * @example setExpString('hello') // '\h\e\l\l\o'
 * @example setExpString(/hello/) // /hello/
 * @example setExpString([hello]) // \\[hello\\/ then use like new new RegExp(setExpString(StringOrRegex))
 */
```
---

### setLookUpExp  
Regex builder to get a match in between two delimeters  

``setLookUpExp(p1, p2)``  

```javascript
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
```  
---

### removeQuotes
**Function Signature**
```javascript
function removeQuotes(str: String): String;
```

**Examples**
```javascript
/**
 * Remove quotes from a string
 * @function removeQuotes
 * @param {String} str
 * @return {String}
 * @example removeQuotes('"hello"') // hello
 * @example removeQuotes("'hello'") // hello
 */
```

---

### fixQuotes
```javascript
/**
 * Fix quotes from a string
 * @function fixQuotes
 * @param {String} str
 * @return {String}
 * @example fixQuotes("'hello'") // "hello"
 * @example fixQuotes('"hello"') // "hello"
 */
```

---

### addQuotes
```javascript
/**
 * Add quotes to a string
 * @function addQuotes
 * @param {String} str
 * @return {String}
 * @example addQuotes('hello') // "hello"
 */  
 ```  

