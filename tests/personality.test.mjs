import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/game/personality.ts', import.meta.url), 'utf8');
const names = [...source.matchAll(/name: '([^']+)'/g)].map((match) => match[1]);
const biases = [...source.matchAll(/reactionBias: '([^']+)'/g)].map((match) => match[1]);

test('personality roster is varied and finance-flavored', () => {
  assert.equal(names.length, 8);
  assert.equal(new Set(names).size, 8);
  assert.ok(source.includes('TRADING FLOOR'));
  assert.ok(source.includes('BUYS THE DIP'));
  assert.ok(source.includes('QUARTERLY FILING'));
});

test('personality profiles influence multiple animation dimensions', () => {
  assert.equal(biases.length, 8);
  assert.ok(new Set(biases).size >= 5);
  assert.equal((source.match(/driftMultiplier:/g) ?? []).length, 9);
  assert.equal((source.match(/bobMultiplier:/g) ?? []).length, 9);
  assert.ok(source.includes('hashSeed(seed) % profiles.length'));
  assert.ok(source.includes("pool.push('accessory', 'accessory')"));
});

test('personality motion stays deterministic and bounded for tank animation safety', () => {
  assert.ok(source.includes('personalityForSpecies'));
  assert.ok(source.includes("personalityFor(`${speciesId}-${Math.max(0, populationIndex)}`)"));
  assert.ok(source.includes('Math.max(5, Math.round(baseDrift * profile.driftMultiplier))'));
  assert.ok(source.includes('Math.max(650, Math.round(baseBobDuration / profile.bobMultiplier))'));
});

test('tap reaction pool preserves every core reaction plus safe personality weighting', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse']) {
    assert.ok(source.includes(`'${reaction}'`), `missing ${reaction} reaction`);
  }
  assert.ok(source.includes("profile.reactionBias === 'accessory' && !hasAccessory ? 'wiggle' : profile.reactionBias"));
  assert.ok(source.includes('safeBias, safeBias'));
  assert.ok(source.includes("pool.push('accessory', 'accessory')"));
});
