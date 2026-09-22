import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/game/personality.ts', import.meta.url), 'utf8');
const profileBlock = source.slice(source.indexOf('const profiles:'), source.indexOf('const reactionPools:'));
const names = [...profileBlock.matchAll(/name:'([^']+)'/g)].map((match) => match[1]);
const biases = [...profileBlock.matchAll(/reactionBias:'([^']+)'/g)].map((match) => match[1]);

test('personality roster is broad, unique, and finance-flavored', () => {
  assert.equal(names.length, 20);
  assert.equal(new Set(names).size, 20);
  for (const expected of ['Curious', 'Hyper', 'Lazy', 'Contrarian', 'Quant', 'Market Maker', 'Diamond Hands', 'Paper Hands', 'Shark']) {
    assert.ok(names.includes(expected), `missing ${expected}`);
  }
  assert.ok(source.includes('TRADING FLOOR'));
  assert.ok(source.includes('BUYS THE DIP'));
  assert.ok(source.includes('QUARTERLY FILING'));
  assert.ok(source.includes('DARK POOLS OF LIQUIDITY'));
});

test('personality profiles influence multiple animation dimensions', () => {
  assert.equal(biases.length, 20);
  assert.ok(new Set(biases).size >= 5);
  assert.equal((profileBlock.match(/driftMultiplier:/g) ?? []).length, 20);
  assert.equal((profileBlock.match(/bobMultiplier:/g) ?? []).length, 20);
  assert.ok(source.includes('hashSeed(seed)%profiles.length'));
  assert.ok(source.includes('personalityMotion'));
  assert.ok(source.includes('distanceVariation'));
  assert.ok(source.includes('cadenceVariation'));
  assert.ok(source.includes('temperamentPulse'));
});

test('personality motion stays deterministic and bounded for tank animation safety', () => {
  assert.ok(source.includes('personalityForSpecies'));
  assert.ok(source.includes("personalityFor(`${speciesId}-${Math.max(0,populationIndex)}`)"));
  assert.ok(source.includes('motionBand'));
  assert.ok(source.includes('Math.max(band.minDrift,Math.min(band.maxDrift'));
  assert.ok(source.includes('Math.max(band.minBob,Math.min(band.maxBob'));
  for (const personality of names) {
    assert.ok(source.includes(`${personality}:{minDrift:`) || source.includes(`'${personality}':{minDrift:`), `missing safe motion band for ${personality}`);
  }
});

test('tap reaction pool preserves every core reaction and strong individual quirks', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) {
    assert.ok(source.includes(`'${reaction}'`), `missing ${reaction} reaction`);
  }
  assert.ok(source.includes('const reactionPools: Record<ShrimpPersonality,ShrimpReaction[]>'));
  assert.ok(source.includes('signatureReactionFor'));
  assert.ok(source.includes('secondaryReactionFor'));
  assert.ok(source.includes('pool.push(signature,signature,signature,signature,signature,signature,secondary,secondary,secondary)'));
});

test('rare accessories remain materially expressive without erasing personality', () => {
  assert.ok(source.includes("if(hasAccessory)pool.push(...Array(30).fill('accessory')"));
  assert.ok(source.includes("else if(hasAccessory)pool.push(...Array(10).fill('accessory')"));
  assert.ok(source.includes("profile.reactionBias!=='accessory'"));
});

test('habitat behavior gives personalities distinct living-aquarium routines', () => {
  for (const behavior of ['patrol', 'graze', 'hide', 'rest', 'inspect', 'school']) {
    assert.ok(source.includes(`'${behavior}'`), `missing ${behavior} habitat behavior`);
  }
  assert.ok(source.includes('habitatBehaviorFor'));
  assert.ok(source.includes("`${seed}-habitat-${Math.max(0,cycle)}`"));
  assert.ok(source.includes("Social:['school','school'"));
  assert.ok(source.includes("Lazy:['rest','rest'"));
  assert.ok(source.includes("Shy:['hide','hide'"));
});
