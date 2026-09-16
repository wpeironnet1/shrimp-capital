import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const farm = readFileSync(new URL('../src/screens/FarmScreen.tsx', import.meta.url), 'utf8');
const personality = readFileSync(new URL('../src/game/personality.ts', import.meta.url), 'utf8');

test('shrimp personnel files surface deterministic personalities', () => {
  assert.match(farm, /import \{ personalityFor \} from '\.\.\/game\/personality'/);
  assert.match(farm, /const inspectedPersonality=inspected\?personalityFor/);
  assert.match(farm, /PERSONALITY · \{inspectedPersonality\.name\.toUpperCase\(\)\}/);
  assert.match(farm, /\{inspectedPersonality\.tagline\}/);
});

test('personality system provides behavioral tuning, not cosmetic labels only', () => {
  assert.match(personality, /reactionBias:/);
  assert.match(personality, /driftMultiplier:/);
  assert.match(personality, /bobMultiplier:/);
  assert.match(personality, /personalityReactionPool/);
});
