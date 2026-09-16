import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const provider = readFileSync(new URL('../src/game/GameProvider.tsx', import.meta.url), 'utf8');

test('game saves stay versioned while retaining legacy read compatibility', () => {
  assert.match(provider, /const SAVE_VERSION = \d+;/);
  assert.match(provider, /type GameSaveEnvelope = \{ version: number; state: Partial<GameState> \};/);
  assert.match(provider, /'state' in parsed/);
  assert.match(provider, /return parsed as Partial<GameState>/, 'legacy unwrapped saves should remain readable');
});

test('save normalization backfills launch-critical nested state', () => {
  for (const field of ['shrimp', 'mutations', 'lineage', 'discoveredSpecies', 'upgrades', 'conditions', 'stats', 'claimedMissions']) {
    assert.ok(provider.includes(`${field}: { ...initialState.${field}`), `missing safe merge for ${field}`);
  }
  assert.match(provider, /conditionUpdatedAt: parsed\.conditionUpdatedAt \?\? parsed\.lastUpdatedAt \?\? Date\.now\(\)/);
  assert.match(provider, /chain: value\?\.chain \?\? 0/);
  assert.match(provider, /visor: value\?\.visor \?\? 0/);
  assert.match(provider, /suit: value\?\.suit \?\? 0/);
});

test('decor corruption is isolated from the primary game save', () => {
  assert.match(provider, /could not read aquarium decor\. Keeping the game save intact\./);
  assert.match(provider, /return \{ owned: \{\}, placed: \{\} \};/);
  assert.match(provider, /persistDecor\(ownedDecor, placedDecor\)\.catch/);
});
