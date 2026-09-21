import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tank = readFileSync(new URL('../src/components/Tank.tsx', import.meta.url), 'utf8');
const shrimp = readFileSync(new URL('../src/components/PixelShrimp.tsx', import.meta.url), 'utf8');
const office = readFileSync(new URL('../src/components/TankOfficeDecor.tsx', import.meta.url), 'utf8');

test('aquarium keeps the full tactile shrimp reaction vocabulary', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) {
    assert.match(tank, new RegExp(`['\"]${reaction}['\"]`), `missing ${reaction} reaction`);
  }
  assert.match(tank, /personalityReactionPool/);
  assert.match(tank, /personalityMotion/);
  assert.match(tank, /schoolToken/);
});

test('jump spectacle remains above ordinary aquarium actors and clears overlays', () => {
  assert.match(tank, /zIndex:jumpToken\?300:30-index/);
  assert.match(tank, /elevation:jumpToken\?80:0/);
  assert.match(tank, /onJumpState\?\.\(true\)/);
  assert.match(tank, /JumpEffects/);
});

test('rare collectible accessories retain bespoke pixel treatment', () => {
  for (const accessory of ['chain', 'crown', 'visor', 'suit']) {
    assert.match(shrimp, new RegExp(`accessory===['\"]${accessory}['\"]`), `missing ${accessory} art`);
  }
  assert.match(tank, /AccessorySparkles/);
});

test('office progression remains visibly staged instead of menu-only', () => {
  assert.match(office, /furnished>=3&&<MarketTicker/);
  assert.match(office, /furnished>=5&&<SkylineWindow/);
  assert.match(office, /furnished>=7&&<ExecutiveGlow/);
  assert.match(office, /SHELL STREET/);
  assert.match(office, /EXECUTIVE FLOOR · LIVE/);
});
