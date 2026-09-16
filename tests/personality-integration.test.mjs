import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const integration = readFileSync(new URL('../src/game/personalityIntegration.ts', import.meta.url), 'utf8');

test('tank personality adapter connects motion and reaction systems', () => {
  assert.match(integration, /personalityMotion\(shrimpKey/);
  assert.match(integration, /personalityReactionPool\(shrimpKey/);
  assert.match(integration, /label: profile\.name/);
  assert.match(integration, /tagline: profile\.tagline/);
});

test('reaction chooser is bounded for deterministic test random sources', () => {
  assert.match(integration, /Math\.min\(behavior\.reactions\.length - 1/);
  assert.match(integration, /Math\.max\(0, index\)/);
});
