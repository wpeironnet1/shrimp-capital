import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const tank = readFileSync(new URL('../src/components/Tank.tsx', import.meta.url), 'utf8');
const farm = readFileSync(new URL('../src/screens/FarmScreen.tsx', import.meta.url), 'utf8');
const personality = readFileSync(new URL('../src/game/personality.ts', import.meta.url), 'utf8');

test('tank keeps a varied set of direct shrimp reactions', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) {
    assert.ok(tank.includes(`'${reaction}'`), `missing ${reaction} shrimp reaction`);
  }
  assert.match(tank, /Haptics\.(impactAsync|selectionAsync)/, 'shrimp reactions should retain tactile feedback');
  assert.match(tank, /personalityReactionPool\(seed,Boolean\(shrimp\.accessory\)\)/, 'tap reactions should remain personality-driven');
});

test('living aquarium keeps visibly distinct personality motion', () => {
  assert.match(tank, /personalityMotion\(seed,/, 'tank actors should use personality motion');
  assert.match(tank, /motion\.bobDuration/, 'personality should influence bob cadence');
  assert.match(tank, /motion\.driftDistance/, 'personality should influence cruising distance');
  for (const personalityName of ['Curious', 'Hyper', 'Lazy', 'Shy', 'Greedy', 'Lucky', 'Bold', 'Diligent']) {
    assert.ok(personality.includes(`${personalityName}:`), `missing ${personalityName} motion profile`);
  }
  assert.match(personality, /motionBand/, 'personality motion should retain explicit visual motion bands');
  assert.match(personality, /minDrift: 72, maxDrift: 92/, 'hyper shrimp should retain a visibly broad patrol range');
  assert.match(personality, /minDrift: 1, maxDrift: 5/, 'lazy shrimp should retain a visibly tiny patrol range');
});

test('rare accessories remain visually special discoveries', () => {
  for (const accessory of ['chain', 'crown', 'visor', 'suit']) {
    assert.ok(tank.includes(accessory), `tank lost ${accessory} accessory support`);
  }
  assert.match(tank, /AccessorySparkles/, 'rare accessory reactions should keep a dedicated sparkle effect');
  assert.match(personality, /pool\.push\([\s\S]*?'accessory'/, 'accessories should retain weighted show-off reactions');
  assert.match(tank, /ImpactFeedbackStyle\.Medium/, 'rare show-off reactions should feel stronger than ordinary taps');
});

test('jumping shrimp receive explicit foreground priority', () => {
  const jumpLayer = tank.match(/zIndex:(?:jumping|jumpToken)\?(\d+):/);
  assert.ok(jumpLayer, 'jumping shrimp should have an explicit foreground z-index');
  assert.ok(Number(jumpLayer[1]) >= 200, `jump foreground layer is too low: ${jumpLayer[1]}`);
  assert.match(tank, /elevation:(?:jumping|jumpToken)\?\d+:/, 'native jump foreground should also use elevation');
  assert.match(tank, /JumpEffects animation=\{jump\}/, 'jump should keep dedicated splash and landing effects');
});

test('tank event overlays yield while a shrimp jump is active', () => {
  assert.match(farm, /showTankEvent=!jumpingShrimp/, 'FarmScreen should suppress event overlays during jumps');
  assert.match(farm, /showTankEvent&&feedingFrenzy/, 'feeding overlay must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]power['"]/, 'power event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]inspection['"]/, 'inspection event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]visitor['"]/, 'visitor event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]treasure['"]/, 'treasure event must respect jump focus');
});
