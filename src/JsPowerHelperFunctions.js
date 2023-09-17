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
const getDirectivesFromString = function (settings) {
    if (!settings) {
        return null;
    }
    let values, breakDownId, directive, properties;
    const type = typeof settings;
    // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
    const regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;

    // Matches the Array as string: [value, value] OR ['value','value']
    const regexArrayLike = /^\[((.|\n)*?)\]$/gm;
    // Matches a multi-array string like [[value,value]],value]
    const regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;
    // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
    // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
    const regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
    const regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
    // Matches string ID or class: literals #... or ....
    const regexIdOrClass = /^(\.|\#)([a-zA-Z]+)/g;
    // Mathes simple directive function style: directive(#idOr.Class)
    const regexFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;

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
        let start = /^\[/;
        let end = /\]$/;
        let keyProps = getMatchInBetween(settings, start, end);
        keyProps = keyProps.split(',');

        // test if multi-array
        if (settings.match(regexMultiArrayString)) {
            keyProps = getMultiArray(settings);
        }

        keyProps.forEach((str) => {
            let cleanStr = addQuotes(removeQuotes(str));
            settings = settings.replace(str, cleanStr);
        });
        return JSON.parse(fixQuotes(settings));
    }

    if (settings.match(regexObjectLike)) {
        let keyProps = getMatchInBetween(settings, '{', ':', true);
        keyProps = keyProps.concat(getMatchInBetween(settings, ',', ':', true));

        keyProps.forEach((str) => {
            let cleanStr = addQuotes(removeQuotes(str));
            settings = settings.replace(str, cleanStr);
        });
        return JSON.parse(fixQuotes(settings));
    }

    if (settings.match(regexDotObjectString) || settings.match(regexExObjectString)) {
        let setObject = {};

        settings = settings.split('&&');

        settings.forEach((command) => {
            command = command.trim();

            if (command.match(regexExObjectString)) {
                values = getMatchInBetween(command, '](', ')');
                breakDownId = getMatchInBetween(command, '[', ']');
                directive = command.split('[')[0].trim();
            } else {
                values = getMatchInBetween(command, '(', ')');
                command = command.replace(getMatchBlock(command, '(', ')'), '');
                properties = command.split('.');
                directive = properties[0];
                breakDownId = properties[1];
                properties[2] = properties[2] ?? null;
            }

            values = values
                .split(',')
                .map((cl) => cl.trim())
                .join(' ');

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
    let arrays = {};
    let innerArrayRegex = /(\[([^[]*?))\]/gm;
    let start = /^\[/;
    let end = /\]$/;
    str = getMatchInBetween(str, start, end);
    let innerArrays = str.match(innerArrayRegex);

    if (innerArrays) {
        let i = 1;
        while (str.match(innerArrayRegex)) {
            str.match(innerArrayRegex).forEach((record, index) => {
                let $index = `@${i}@${index}`;
                arrays[$index] = record;
                str = str.replace(record, $index);
            });

            i++;
        }
    }

    str = str.split(',');

    const total = (Object.keys(arrays).length ?? 1) * str.length;
    let loops = 0;
    while (Object.keys(arrays).length > 0) {
        let keys = Object.keys(arrays);
        let tmpStr = str;
        Object.keys(arrays).forEach((key) => {
            let strArray = getMatchInBetween(arrays[key], start, end).split(',');
            let replaced = findAndReplaceInArray(str, key, strArray);

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
    let results = null;
    let tmpArray = arr;

    arr.forEach((prop, index) => {
        if (Array.isArray(prop)) {
            let replaced = findAndReplaceInArray(prop, find, value);
            if (replaced) {
                tmpArray[index] = replaced;
                results = tmpArray;
            }
        }
        if (prop === find) {
            if (Array.isArray(value)) {
                value = value.map((p) => {
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
function getMatchInBetween(str, p1, p2, all = false) {
    if (all) {
        let matches = [];
        let group = getMatchBlock(str, p1, p2, all) ?? [];

        group.forEach((match) => {
            matches.push(cleanStr(match, p1, p2));
        });
        return matches;
    } else {
        str = getMatchBlock(str, p1, p2) ?? str;
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
 * @return {String|Array|Null}
 * @example getMatchBlock('is a hello world today', 'h', 'd') // 'hello world'
 * @example getMatchBlock('is a hello world today', 'h', 'd', true) // ['hello world']
 * @example getMatchBlock('is a <hello world/> today', '<', '/>') // '<hello world/>'
 */
function getMatchBlock(str, p1, p2, all = false) {
    p1 = setExpString(p1);
    p2 = setExpString(p2);
    let regex = new RegExp(setLookUpExp(p1, p2), 'gm');
    const matches = str.match(regex);
    if (matches) {
        return all ? matches : matches[0];
    }
    return null;
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
    return str
        .replace(new RegExp(setExpString(p1)), '')
        .replace(new RegExp(setExpString(p2)), '')
        .trim();
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
        return exp
            .split('')
            .map((char) =>
                ['$', '^', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(char)
                    ? `\\${char}`
                    : char,
            )
            .join('');
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
    let p1IsRegex = p1 instanceof RegExp;
    let p2IsRegex = p2 instanceof RegExp;
    if (p1IsRegex || p2IsRegex) {
        if (p1IsRegex) {
            p1 = p1.source;
        }
        if (p2IsRegex) {
            p2 = p2.source;
        }
    }

    return `${p1}((.|\n)*?)${p2}`;
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
    return `"${str}"`;
}
const powerHelper = {
    getDirectivesFromString,
    findAndReplaceInArray,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes,
};
export {
    getDirectivesFromString,
    findAndReplaceInArray,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes,
};
export default powerHelper;
