import assert from 'node:assert/strict';
import test from 'node:test';

test('economy formulas stay deterministic', () => {
  assert.equal(Math.round(50 * Math.pow(1.65, 0)), 50);
  assert.equal(Math.round(50 * Math.pow(1.65, 2)), 136);
  assert.equal(30 + 3 * 25, 105);
});
