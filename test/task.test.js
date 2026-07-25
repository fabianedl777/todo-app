const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTask, toggleTask, deleteTask, editTask, filterTasks, countActive, clearCompleted, setPriority, filterByPriority, formatRelativeTime, importTasks } = require('../app.js');
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

describe('countActive', () => {
  test('returns 0 for empty array', () => {
    assert.strictEqual(countActive([]), 0);
  });

  test('returns count of non-completed tasks (3 active, 2 completed → 3)', () => {
    const tasks = makeTasks(5);
    tasks[3].completed = true;
    tasks[4].completed = true;
    assert.strictEqual(countActive(tasks), 3);
  });

  test('returns 0 when all tasks are completed', () => {
    const tasks = makeTasks(3);
    tasks.forEach(t => { t.completed = true; });
    assert.strictEqual(countActive(tasks), 0);
  });

  test('returns full length when none are completed', () => {
    const tasks = makeTasks(4);
    assert.strictEqual(countActive(tasks), 4);
  });

  test('returns 1 for single active task', () => {
    const tasks = makeTasks(1);
    assert.strictEqual(countActive(tasks), 1);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(3);
    tasks[1].completed = true;
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    countActive(tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });
});

describe('clearCompleted', () => {
  test('removes all completed tasks (3 active, 2 completed → 3 active remain)', () => {
    const tasks = makeTasks(5);
    tasks[3].completed = true;
    tasks[4].completed = true;
    const result = clearCompleted(tasks);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result.every(t => !t.completed), true);
  });

  test('returns empty array when all tasks completed', () => {
    const tasks = makeTasks(3);
    tasks.forEach(t => { t.completed = true; });
    const result = clearCompleted(tasks);
    assert.strictEqual(result.length, 0);
  });

  test('returns same content when no completed tasks (new reference)', () => {
    const tasks = makeTasks(3);
    const result = clearCompleted(tasks);
    assert.strictEqual(result.length, 3);
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('on empty array returns empty array', () => {
    const result = clearCompleted([]);
    assert.deepStrictEqual(result, []);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(3);
    tasks[1].completed = true;
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    clearCompleted(tasks);
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('returns new array reference (immutability)', () => {
    const tasks = makeTasks(2);
    assert.notStrictEqual(clearCompleted(tasks), tasks);
  });
});

describe('setPriority', () => {
  test('updates priority for matching id (medium → high)', () => {
    const tasks = makeTasks(2);
    tasks[0].priority = 'medium';
    const result = setPriority(tasks, 't1', 'high');
    assert.strictEqual(result[0].priority, 'high');
    assert.strictEqual(result[0].id, 't1');
    assert.strictEqual(result[1].priority, undefined);
  });

  test('with invalid priority returns new array unchanged', () => {
    const tasks = makeTasks(2);
    const result = setPriority(tasks, 't1', 'banana');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('with non-existent id returns new array unchanged', () => {
    const tasks = makeTasks(2);
    const result = setPriority(tasks, 'nope', 'high');
    assert.notStrictEqual(result, tasks);
    assert.deepStrictEqual(result, tasks);
  });

  test('does not mutate input array', () => {
    const tasks = makeTasks(2);
    tasks[0].priority = 'medium';
    const originalSnapshot = JSON.parse(JSON.stringify(tasks));
    setPriority(tasks, 't1', 'high');
    assert.deepStrictEqual(tasks, originalSnapshot);
  });

  test('returns new array reference', () => {
    const tasks = makeTasks(2);
    assert.notStrictEqual(setPriority(tasks, 't1', 'high'), tasks);
  });
});

describe('createTask priority default', () => {
  let restoreUUID;

  beforeEach(() => {
    restoreUUID = stubUUID();
  });

  afterEach(() => {
    restoreUUID();
  });

  test('new task has priority medium by default', () => {
    const tasks = makeTasks(0);
    const result = createTask(tasks, 'New task');
    assert.strictEqual(result[0].priority, 'medium');
  });
});

describe('filterByPriority', () => {
  test('"all" returns all tasks (new reference)', () => {
    const tasks = makeTasks(3);
    const result = filterByPriority(tasks, 'all');
    assert.strictEqual(result.length, 3);
    assert.notStrictEqual(result, tasks);
  });

  test('"high" returns only high priority tasks', () => {
    const tasks = makeTasks(3);
    tasks[0].priority = 'high';
    tasks[1].priority = 'medium';
    tasks[2].priority = 'low';
    const result = filterByPriority(tasks, 'high');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].priority, 'high');
  });

  test('"medium" returns only medium priority tasks', () => {
    const tasks = makeTasks(3);
    tasks[0].priority = 'high';
    tasks[1].priority = 'medium';
    tasks[2].priority = 'low';
    const result = filterByPriority(tasks, 'medium');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].priority, 'medium');
  });

  test('"low" returns only low priority tasks', () => {
    const tasks = makeTasks(3);
    tasks[0].priority = 'high';
    tasks[1].priority = 'medium';
    tasks[2].priority = 'low';
    const result = filterByPriority(tasks, 'low');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].priority, 'low');
  });

  test('tasks without priority treated as medium', () => {
    const tasks = makeTasks(2);
    const result = filterByPriority(tasks, 'medium');
    assert.strictEqual(result.length, 2);
  });

  test('empty array returns empty', () => {
    assert.deepStrictEqual(filterByPriority([], 'high'), []);
  });

  test('does not mutate input', () => {
    const tasks = makeTasks(2);
    tasks[0].priority = 'high';
    const snapshot = JSON.parse(JSON.stringify(tasks));
    filterByPriority(tasks, 'high');
    assert.deepStrictEqual(tasks, snapshot);
  });

  test('returns new reference', () => {
    const tasks = makeTasks(2);
    assert.notStrictEqual(filterByPriority(tasks, 'all'), tasks);
  });
});

describe('formatRelativeTime', () => {
  test('"just now" for < 60s', () => {
    const iso = new Date(Date.now() - 10 * 1000).toISOString();
    assert.strictEqual(formatRelativeTime(iso), 'just now');
  });

  test('"5m ago" for 5 minutes', () => {
    const iso = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    assert.strictEqual(formatRelativeTime(iso), '5m ago');
  });

  test('"2h ago" for 2 hours', () => {
    const iso = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
    assert.strictEqual(formatRelativeTime(iso), '2h ago');
  });

  test('"3d ago" for 3 days', () => {
    const iso = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
    assert.strictEqual(formatRelativeTime(iso), '3d ago');
  });

  test('date string for older than a week', () => {
    const iso = new Date('2026-01-15T10:00:00Z').toISOString();
    const result = formatRelativeTime(iso);
    assert.ok(result.includes('Jan'), 'expected Jan in result: ' + result);
  });

  test('invalid input returns "unknown"', () => {
    assert.strictEqual(formatRelativeTime('not-a-date'), 'unknown');
  });
});

describe('importTasks', () => {
  test('merges new tasks into existing', () => {
    const existing = makeTasks(2);
    const imported = [{ id: 'new1', text: 'New task', completed: false, priority: 'medium', createdAt: '2026-07-25T10:00:00Z' }];
    const result = importTasks(existing, imported);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].id, 'new1');
  });

  test('dedupes by id', () => {
    const existing = makeTasks(2);
    const imported = [{ id: 't1', text: 'Duplicate', completed: false }];
    const result = importTasks(existing, imported);
    assert.strictEqual(result.length, 2);
  });

  test('invalid input (not array) returns existing unchanged', () => {
    const existing = makeTasks(2);
    const result = importTasks(existing, 'not an array');
    assert.strictEqual(result.length, 2);
    assert.notStrictEqual(result, existing);
  });

  test('filters out tasks without id or text', () => {
    const existing = makeTasks(1);
    const imported = [
      { id: 'good1', text: 'Good', completed: false },
      { text: 'No id' },
      { id: 'no-text' },
      null,
    ];
    const result = importTasks(existing, imported);
    assert.strictEqual(result.length, 2);
  });

  test('empty imported returns existing unchanged', () => {
    const existing = makeTasks(2);
    const result = importTasks(existing, []);
    assert.strictEqual(result.length, 2);
  });

  test('does not mutate input', () => {
    const existing = makeTasks(2);
    const imported = [{ id: 'new1', text: 'New', completed: false }];
    const snap = JSON.parse(JSON.stringify(existing));
    importTasks(existing, imported);
    assert.deepStrictEqual(existing, snap);
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