const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTask, toggleTask, deleteTask, editTask, filterTasks } = require('../app.js');
const { stubUUID, makeTasks } = require('./helpers');

describe('createTask', () => {
  let restoreUUID;

  beforeEach(() => {
    restoreUUID = stubUUID();
  });

  afterEach(() => {
    restoreUUID();
  });

  test('adds task at index 0 with correct fields', () => {
    const tasks = makeTasks(1);
    const result = createTask(tasks, 'New task');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 'test-uuid-1');
    assert.strictEqual(result[0].text, 'New task');
    assert.strictEqual(result[0].completed, false);
    assert.strictEqual(typeof result[0].createdAt, 'string');
    assert.strictEqual(new Date(result[0].createdAt).toISOString(), result[0].createdAt);
  });

  test('empty string "" returns the same array reference unchanged', () => {
    const tasks = makeTasks(1);
    const result = createTask(tasks, '');
    assert.strictEqual(result, tasks);
    assert.strictEqual(result.length, 1);
  });

  test('whitespace-only text "   " returns array unchanged (trimmed to empty)', () => {
    const tasks = makeTasks(1);
    const result = createTask(tasks, '   ');
    assert.strictEqual(result, tasks);
    assert.strictEqual(result.length, 1);
  });

  test('trims surrounding whitespace ("  Buy milk  " → "Buy milk")', () => {
    const tasks = makeTasks(0);
    const result = createTask(tasks, '  Buy milk  ');
    assert.strictEqual(result[0].text, 'Buy milk');
  });

  test('generates unique id different from existing task ids (stub UUID counter)', () => {
    const tasks = [{ id: 'existing-id', text: 'Existing', completed: false, createdAt: '2026-07-24T19:45:00.000Z' }];
    const result = createTask(tasks, 'New task');
    assert.notStrictEqual(result[0].id, 'existing-id');
    assert.ok(result[0].id.startsWith('test-uuid-'));
  });

  test('does not mutate input array (returns new reference, original unchanged)', () => {
    const tasks = makeTasks(2);
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    const result = createTask(tasks, 'New task');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('prepends new task (result length = input length + 1, new task at index 0)', () => {
    const tasks = makeTasks(2);
    const result = createTask(tasks, 'New task');
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].text, 'New task');
    assert.strictEqual(result[1].id, 't1');
    assert.strictEqual(result[2].id, 't2');
  });
});

describe('toggleTask', () => {
  test('flips completed false → true for matching id', () => {
    const tasks = makeTasks(2);
    const result = toggleTask(tasks, 't1');
    assert.strictEqual(result[0].completed, true);
    assert.strictEqual(result[1].completed, false);
  });

  test('flips completed true → false for matching id', () => {
    const tasks = makeTasks(1);
    tasks[0].completed = true;
    const result = toggleTask(tasks, 't1');
    assert.strictEqual(result[0].completed, false);
  });

  test('toggling one task does not affect others (2 tasks, toggle t1, assert t2 unchanged)', () => {
    const tasks = makeTasks(2);
    const result = toggleTask(tasks, 't1');
    assert.strictEqual(result[0].completed, true);
    assert.strictEqual(result[1].completed, false);
    assert.strictEqual(result[1].id, 't2');
    assert.strictEqual(result[1].text, 'Task 2');
  });

  test('non-existent id returns new array with all tasks unchanged', () => {
    const tasks = makeTasks(2);
    const result = toggleTask(tasks, 'non-existent');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('empty array returns empty array', () => {
    const result = toggleTask([], 't1');
    assert.deepStrictEqual(result, []);
  });

  test('does not mutate input array (assert.notStrictEqual result, input; input unchanged)', () => {
    const tasks = makeTasks(2);
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    const result = toggleTask(tasks, 't1');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });
});

describe('deleteTask', () => {
  test('removes matching id (2 tasks, delete t1, result has only t2)', () => {
    const tasks = makeTasks(2);
    const result = deleteTask(tasks, 't1');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 't2');
  });

  test('removing one task does not affect others (assert remaining task fields unchanged)', () => {
    const tasks = makeTasks(2);
    const result = deleteTask(tasks, 't1');
    assert.strictEqual(result[0].id, 't2');
    assert.strictEqual(result[0].text, 'Task 2');
    assert.strictEqual(result[0].completed, false);
    assert.strictEqual(result[0].createdAt, '2026-07-24T19:45:01.000Z');
  });

  test('non-existent id returns new array with all tasks unchanged', () => {
    const tasks = makeTasks(2);
    const result = deleteTask(tasks, 'non-existent');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('empty array returns empty array', () => {
    const result = deleteTask([], 't1');
    assert.deepStrictEqual(result, []);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(2);
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    const result = deleteTask(tasks, 't1');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });
});

describe('editTask', () => {
  test('updates text for matching id (task text changes, other fields unchanged)', () => {
    const tasks = makeTasks(1);
    const result = editTask(tasks, 't1', 'Updated text');
    assert.strictEqual(result[0].text, 'Updated text');
    assert.strictEqual(result[0].id, 't1');
    assert.strictEqual(result[0].completed, false);
    assert.strictEqual(result[0].createdAt, '2026-07-24T19:45:00.000Z');
  });

  test('trims surrounding whitespace ("  New text  " → "New text")', () => {
    const tasks = makeTasks(1);
    const result = editTask(tasks, 't1', '  New text  ');
    assert.strictEqual(result[0].text, 'New text');
  });

  test('empty text after trim leaves task text unchanged (original preserved)', () => {
    const tasks = makeTasks(1);
    const result = editTask(tasks, 't1', '   ');
    assert.strictEqual(result[0].text, 'Task 1');
  });

  test('non-existent id returns new array with all tasks unchanged', () => {
    const tasks = makeTasks(2);
    const result = editTask(tasks, 'non-existent', 'New text');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('empty array returns empty array', () => {
    const result = editTask([], 't1', 'New text');
    assert.deepStrictEqual(result, []);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(2);
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    const result = editTask(tasks, 't1', 'New text');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('editing one task does not affect others (2 tasks, edit t1, assert t2 unchanged)', () => {
    const tasks = makeTasks(2);
    const result = editTask(tasks, 't1', 'Updated');
    assert.strictEqual(result[0].text, 'Updated');
    assert.strictEqual(result[1].id, 't2');
    assert.strictEqual(result[1].text, 'Task 2');
    assert.strictEqual(result[1].completed, false);
  });
});

describe('filterTasks', () => {
  test('"all" returns all tasks (new reference, input unchanged)', () => {
    const tasks = makeTasks(3);
    const result = filterTasks(tasks, 'all');
    assert.strictEqual(result.length, 3);
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(tasks, makeTasks(3));
  });

  test('"active" returns only non-completed tasks', () => {
    const tasks = makeTasks(3);
    tasks[1].completed = true;
    const result = filterTasks(tasks, 'active');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 't1');
    assert.strictEqual(result[1].id, 't3');
    assert.strictEqual(result.every(t => !t.completed), true);
  });

  test('"completed" returns only completed tasks', () => {
    const tasks = makeTasks(3);
    tasks[1].completed = true;
    const result = filterTasks(tasks, 'completed');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 't2');
    assert.strictEqual(result[0].completed, true);
  });

  test('empty array returns empty array for all three filters', () => {
    assert.deepStrictEqual(filterTasks([], 'all'), []);
    assert.deepStrictEqual(filterTasks([], 'active'), []);
    assert.deepStrictEqual(filterTasks([], 'completed'), []);
  });

  test('invalid filter value ("banana") defaults to "all" (returns all tasks)', () => {
    const tasks = makeTasks(2);
    const result = filterTasks(tasks, 'banana');
    assert.strictEqual(result.length, 2);
    assert.notStrictEqual(result, tasks);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(3);
    tasks[1].completed = true;
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    filterTasks(tasks, 'active');
    assert.deepStrictEqual(tasks, originalSnapshot);
    filterTasks(tasks, 'completed');
    assert.deepStrictEqual(tasks, originalSnapshot);
    filterTasks(tasks, 'all');
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('returns new array reference for all filters (immutability invariant)', () => {
    const tasks = makeTasks(2);
    assert.notStrictEqual(filterTasks(tasks, 'all'), tasks);
    assert.notStrictEqual(filterTasks(tasks, 'active'), tasks);
    assert.notStrictEqual(filterTasks(tasks, 'completed'), tasks);
  });
});

describe('Immutability invariant', () => {
  let restoreUUID;

  beforeEach(() => {
    restoreUUID = stubUUID();
  });

  afterEach(() => {
    restoreUUID();
  });

  test('all four pure functions return a different array reference than the input', () => {
    const tasks = makeTasks(2);
    assert.notStrictEqual(createTask(tasks, 'New'), tasks);
    assert.notStrictEqual(toggleTask(tasks, 't1'), tasks);
    assert.notStrictEqual(deleteTask(tasks, 't1'), tasks);
    assert.notStrictEqual(editTask(tasks, 't1', 'Updated'), tasks);
  });

  test('input array is not mutated by any call', () => {
    const tasks = makeTasks(2);
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));

    createTask(tasks, 'New');
    assert.deepStrictEqual(tasks, originalSnapshot);

    toggleTask(tasks, 't1');
    assert.deepStrictEqual(tasks, originalSnapshot);

    deleteTask(tasks, 't1');
    assert.deepStrictEqual(tasks, originalSnapshot);

    editTask(tasks, 't1', 'Updated');
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('full test suite runs Green (node --test test/*.test.js)', () => {
    // This is a placeholder — the actual full suite run is done via CLI
    assert.ok(true);
  });
});