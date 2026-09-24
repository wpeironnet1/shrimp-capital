import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tank = readFileSync(new URL('../src/components/Tank.tsx', import.meta.url), 'utf8');
const shrimp = readFileSync(new URL('../src/components/PixelShrimp.tsx', import.meta.url), 'utf8');
const office = readFileSync(new URL('../src/components/TankOfficeDecor.tsx', import.meta.url), 'utf8');
const choreography = readFileSync(new URL('../src/game/aquariumChoreography.ts', import.meta.url), 'utf8');

test('aquarium keeps the full tactile shrimp reaction vocabulary', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) assert.match(tank, new RegExp(`['\\"]${reaction}['\\"]`), `missing ${reaction} reaction`);
  assert.match(tank, /personalityReactionPool/);
  assert.match(tank, /personalityMotion/);
  assert.match(tank, /schoolEvent/);
});

test('whole-tank spectacles are wired into the live aquarium and scale with maturity', () => {
  assert.match(tank, /socialMomentDelay/);
  assert.match(tank, /socialMomentFor/);
  assert.match(tank, /setSchoolEvent/);
  assert.match(choreography, /population>=12/);
  assert.match(choreography, /population>=10/);
  assert.match(choreography, /fullTank=population>=12\?1\.42:population>=10\?1\.18:1/);
  assert.match(choreography, /bubbleIntensity:Math\.min\(2\.5/);
  assert.match(choreography, /reactionCadenceMs:Math\.max\(32/);
  assert.match(choreography, /headlinePunch=headline\?1\.38:1/);
  for (const moment of ['school-run', 'feeding-rush', 'bubble-rally', 'market-panic', 'personality-parade']) assert.match(choreography, new RegExp(`['\\"]${moment}['\\"]`), `missing ${moment} spectacle`);
});

test('mature tanks alternate readable schooling with high-energy trading-floor spectacles', () => {
  const fullTankReel = choreography.match(/population>=12\s*\?\[(.*?)\]\s*:population>=10/s)?.[1] ?? '';
  assert.ok(fullTankReel.length > 0, 'full-tank spectacle reel must be explicit');
  for (const moment of ['school-run', 'market-panic', 'bubble-rally', 'feeding-rush', 'personality-parade']) assert.match(fullTankReel, new RegExp(moment), `full tank should retain ${moment}`);
  assert.match(choreography, /base=population>=3\?11200-fullness\*3400:17000/);
  assert.match(choreography, /span=population>=3\?3600-fullness\*1200:5600/);
  assert.match(choreography, /quietBeat=safeCycle>0&&safeCycle%6===5/);
  assert.match(tank, /Math\.max\(15000,socialMomentDelay/);
});

test('jump spectacle remains above ordinary aquarium actors and clears overlays', () => {
  assert.match(tank, /zIndex:jumpToken\?300:30-index/);
  assert.match(tank, /elevation:jumpToken\?80:0/);
  assert.match(tank, /onJumpState\?\.\(true\)/);
  assert.match(tank, /JumpEffects/);
});

test('rare collectible accessories retain bespoke pixel treatment', () => {
  for (const accessory of ['chain', 'crown', 'visor', 'suit']) assert.match(shrimp, new RegExp(`accessory===['\\"]${accessory}['\\"]`), `missing ${accessory} art`);
  assert.match(tank, /AccessorySparkles/);
});

test('office progression remains visibly staged instead of menu-only', () => {
  assert.match(office, /furnished>=2&&<MarketTicker/);
  assert.match(office, /furnished>=4&&<SkylineWindow/);
  assert.match(office, /furnished>=5&&<TradingFloorGlow/);
  assert.match(office, /furnished>=6&&<ExecutiveGlow/);
  assert.match(office, /furnished>=8&&<ClosingBell/);
  assert.match(office, /SHELL STREET/);
  assert.match(office, /EXECUTIVE FLOOR · LIVE/);
});
