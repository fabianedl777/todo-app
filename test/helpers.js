class MockStorage {
  constructor() {
    this.data = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
  }
  setItem(key, value) {
    this.data[key] = value;
  }
  removeItem(key) {
    delete this.data[key];
  }
}

let uuidCounter = 0;
function stubUUID() {
  const original = crypto.randomUUID;
  crypto.randomUUID = () => `test-uuid-${++uuidCounter}`;
  return () => { crypto.randomUUID = original; };
}

function makeTasks(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i + 1}`,
    text: `Task ${i + 1}`,
    completed: false,
    createdAt: `2026-07-24T19:45:0${i}.000Z`,
  }));
}

module.exports = { MockStorage, stubUUID, makeTasks };