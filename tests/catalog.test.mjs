import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const catalog = readFileSync(new URL('../src/game/catalog.ts', import.meta.url), 'utf8');
const entries = [...catalog.matchAll(/\{ id: '([^']+)', name: '([^']+)', rarity: '([^']+)', emoji: '[^']+', basePrice: (\d+), hatchSeconds: (\d+), unlockLevel: (\d+), color:/g)]
  .map((match) => ({ id: match[1], rarity: match[3], price: Number(match[4]), hatch: Number(match[5]), level: Number(match[6]) }));

test('species ladder contains a long, increasingly valuable collection', () => {
  assert.equal(entries.length, 24);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
  assert.deepEqual(entries.slice(1).map((entry, index) => entry.price > entries[index].price), Array(entries.length - 1).fill(true));
  assert.deepEqual(entries.slice(1).map((entry, index) => entry.level >= entries[index].level), Array(entries.length - 1).fill(true));
  assert.ok(new Set(entries.map((entry) => entry.rarity)).size >= 7);
  assert.ok(entries.at(-1).price >= 100_000);
});
