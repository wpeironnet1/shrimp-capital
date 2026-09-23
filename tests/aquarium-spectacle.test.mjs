import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tank = readFileSync(new URL('../src/components/Tank.tsx', import.meta.url), 'utf8');
const shrimp = readFileSync(new URL('../src/components/PixelShrimp.tsx', import.meta.url), 'utf8');
const office = readFileSync(new URL('../src/components/TankOfficeDecor.tsx', import.meta.url), 'utf8');
const choreography = readFileSync(new URL('../src/game/aquariumChoreography.ts', import.meta.url), 'utf8');

test('aquarium keeps the full tactile shrimp reaction vocabulary', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) {
    assert.match(tank, new RegExp(`['\"]${reaction}['\"]`), `missing ${reaction} reaction`);
  }
  assert.match(tank, /personalityReactionPool/);
  assert.match(tank, /personalityMotion/);
  assert.match(tank, /schoolEvent/);
});

test('whole-tank spectacles are wired into the live aquarium and scale with maturity', () => {
  assert.match(tank, /socialMomentDelay/);
  assert.match(tank, /socialMomentFor/);
  assert.match(tank, /setSchoolEvent/);
  assert.match(choreography, /population>=12/);
  assert.match(choreography, /population>=9/);
  assert.match(choreography, /fullTank=population>=12\?1\.18:1/);
  assert.match(choreography, /bubbleIntensity:Math\.min\(1\.7/);
  assert.match(choreography, /reactionCadenceMs:Math\.max\(48/);
  for (const moment of ['school-run', 'feeding-rush', 'bubble-rally', 'market-panic']) {
    assert.match(choreography, new RegExp(`['\"]${moment}['\"]`), `missing ${moment} spectacle`);
  }
});

test('a full visual tank gets the denser trading-floor rhythm instead of calm schooling', () => {
  const fullTankReel = choreography.match(/population>=12\?\[(.*?)\]:population>=11/s)?.[1] ?? '';
  assert.ok(fullTankReel.length > 0, 'full-tank spectacle reel must be explicit');
  assert.doesNotMatch(fullTankReel, /school-run/);
  assert.match(fullTankReel, /market-panic/);
  assert.match(fullTankReel, /bubble-rally/);
  assert.match(fullTankReel, /feeding-rush/);
  assert.match(choreography, /base=20500-fullness\*10500/);
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
