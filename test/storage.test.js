const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { saveTasks, loadTasks } = require('../app.js');
const { MockStorage, makeTasks } = require('./helpers');

describe('saveTasks', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    global.localStorage = new MockStorage();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  test('writes JSON to localStorage under "todos" key', () => {
    const tasks = makeTasks(2);
    saveTasks(tasks);
    assert.strictEqual(global.localStorage.data['todos'], JSON.stringify(tasks));
  });

  test('writes "[]" for empty array', () => {
    saveTasks([]);
    assert.strictEqual(global.localStorage.data['todos'], '[]');
  });

  test('swallows QuotaExceededError (no throw)', () => {
    global.localStorage.setItem = () => {
      const err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    };
    assert.doesNotThrow(() => saveTasks(makeTasks(1)));
  });

  test('swallows generic storage error (no throw)', () => {
    global.localStorage.setItem = () => {
      throw new Error('Generic storage error');
    };
    assert.doesNotThrow(() => saveTasks(makeTasks(1)));
  });
});

describe('loadTasks', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    global.localStorage = new MockStorage();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  test('returns parsed array from valid JSON', () => {
    const tasks = makeTasks(2);
    global.localStorage.data['todos'] = JSON.stringify(tasks);
    const result = loadTasks();
    assert.deepStrictEqual(result, tasks);
  });

  test('returns [] when key is missing (getItem returns null)', () => {
    const result = loadTasks();
    assert.deepStrictEqual(result, []);
  });

  test('returns [] on invalid JSON (SyntaxError caught)', () => {
    global.localStorage.data['todos'] = 'not valid json';
    const result = loadTasks();
    assert.deepStrictEqual(result, []);
  });

  test('returns [] when storage throws (security exception)', () => {
    global.localStorage.getItem = () => {
      throw new Error('Security exception');
    };
    const result = loadTasks();
    assert.deepStrictEqual(result, []);
  });

  test('returns [] when parsed value is not an array', () => {
    global.localStorage.data['todos'] = '{}';
    const result = loadTasks();
    assert.deepStrictEqual(result, []);
  });
});

describe('Round-trip', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    global.localStorage = new MockStorage();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  test('save then load returns identical data (all fields preserved)', () => {
    const tasks = makeTasks(2);
    saveTasks(tasks);
    const loaded = loadTasks();
    assert.deepStrictEqual(loaded, tasks);
    assert.strictEqual(loaded.length, 2);
    assert.strictEqual(loaded[0].id, 't1');
    assert.strictEqual(loaded[0].text, 'Task 1');
    assert.strictEqual(loaded[0].completed, false);
    assert.strictEqual(loaded[1].id, 't2');
    assert.strictEqual(loaded[1].text, 'Task 2');
  });
});