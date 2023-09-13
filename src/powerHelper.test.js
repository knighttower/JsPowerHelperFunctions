import { test } from 'vitest';
import assert from 'assert';
import {
  getDirectivesFromString,
  getMatchInBetween,
  getMatchBlock,
  cleanStr,
  setExpString,
  setLookUpExp,
  removeQuotes,
  fixQuotes,
  addQuotes
} from './JsPowerHelperFunctions.js'; // Change this to the actual path

// Testing getDirectivesFromString
test('getDirectivesFromString - should return null for empty settings', () => {
  const result = getDirectivesFromString(null);
  assert.equal(result, null);
});

test('getDirectivesFromString - should return settings for object type', () => {
  const result = getDirectivesFromString({ key: 'value' });
  assert.deepEqual(result, { key: 'value' });
});

test('getDirectivesFromString - should handle string ID or class', () => {
  const result = getDirectivesFromString('#id');
  assert.equal(result, '#id');
});

// Add more tests for getDirectivesFromString as per your scenarios

// Testing getMatchInBetween
test('getMatchInBetween - should return correct substring', () => {
  const result = getMatchInBetween('hello world', 'h', 'd');
  assert.equal(result, 'ello worl');
});

// Add more tests for getMatchInBetween

// Testing getMatchBlock
test('getMatchBlock - should return correct match block', () => {
  const result = getMatchBlock('is a <hello world> today', '<', 'w');
  assert.equal(result, '<hello w');
});

// Add more tests for getMatchBlock

// Testing cleanStr
test('cleanStr - should return string without delimiters', () => {
  const result = cleanStr('hello world', 'h', 'd');
  assert.equal(result, 'ello worl');
});

// Add more tests for cleanStr

// Testing setExpString
test('setExpString - should escape string for regex', () => {
  const result = setExpString('<hello');
  assert.equal(result, '\<hello');
});

// Add more tests for setExpString

// Testing setLookUpExp
test('setLookUpExp - should return regex pattern string', () => {
  const result = setLookUpExp('h', 'd');
  assert.equal(result, 'h((.|\n)*?)d');
});

// Add more tests for setLookUpExp

// Testing removeQuotes
test('removeQuotes - should remove quotes from string', () => {
  const result = removeQuotes('"hello"');
  assert.equal(result, 'hello');
});

// Testing fixQuotes
test('fixQuotes - should replace single quotes with double quotes', () => {
  const result = fixQuotes("'hello'");
  assert.equal(result, '"hello"');
});

// Testing addQuotes
test('addQuotes - should add double quotes around the string', () => {
  const result = addQuotes('hello');
  assert.equal(result, '"hello"');
});

// ... continue adding tests for other utility functions
