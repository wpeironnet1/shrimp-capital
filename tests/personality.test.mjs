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
  assert.ok(source.includes('personalityMotion'));
  assert.ok(source.includes('distanceVariation'));
  assert.ok(source.includes('cadenceVariation'));
});

test('personality motion stays deterministic and bounded for tank animation safety', () => {
  assert.ok(source.includes('personalityForSpecies'));
  assert.ok(source.includes("personalityFor(`${speciesId}-${Math.max(0, populationIndex)}`)"));
  assert.ok(source.includes('motionBand'));
  assert.ok(source.includes('Math.max(band.minDrift, Math.min(band.maxDrift'));
  assert.ok(source.includes('Math.max(band.minBob, Math.min(band.maxBob'));
  for (const personality of ['Curious', 'Hyper', 'Lazy', 'Shy', 'Greedy', 'Lucky', 'Bold', 'Diligent']) {
    assert.ok(source.includes(`${personality}: { minDrift:`), `missing safe motion band for ${personality}`);
  }
});

test('tap reaction pool preserves every core reaction and recognizable temperament weighting', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse']) {
    assert.ok(source.includes(`'${reaction}'`), `missing ${reaction} reaction`);
  }
  assert.ok(source.includes('const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]>'));
  assert.ok(source.includes('pool.push(signature, signature, signature, secondary, secondary)'));
  assert.ok(source.includes('accessoryShowoffWeight'));
  assert.ok(source.includes("pool.push('accessory')"));
});

test('rare accessories remain materially more expressive without erasing personality', () => {
  assert.ok(source.includes('Shy: 20'));
  assert.ok(source.includes('Bold: 46'));
  assert.ok(source.includes('Diligent: 50'));
  assert.ok(source.includes('for (let i = 0; i < showoffWeight; i += 1)'));
  assert.ok(source.includes('secondaryReactionFor'));
});
