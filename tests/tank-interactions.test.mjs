import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const tank = readFileSync(new URL('../src/components/Tank.tsx', import.meta.url), 'utf8');
const farm = readFileSync(new URL('../src/screens/FarmScreen.tsx', import.meta.url), 'utf8');

test('tank keeps a varied set of direct shrimp reactions', () => {
  for (const reaction of ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', 'accessory']) {
    assert.ok(tank.includes(`'${reaction}'`), `missing ${reaction} shrimp reaction`);
  }
  assert.match(tank, /Haptics\.(impactAsync|selectionAsync)/, 'shrimp reactions should retain tactile feedback');
});

test('jumping shrimp receive explicit foreground priority', () => {
  const jumpLayer = tank.match(/zIndex:(?:jumping|jumpToken)\?(\d+):/);
  assert.ok(jumpLayer, 'jumping shrimp should have an explicit foreground z-index');
  assert.ok(Number(jumpLayer[1]) >= 200, `jump foreground layer is too low: ${jumpLayer[1]}`);
  assert.match(tank, /elevation:(?:jumping|jumpToken)\?\d+:/, 'native jump foreground should also use elevation');
});

test('tank event overlays yield while a shrimp jump is active', () => {
  assert.match(farm, /showTankEvent=!jumpingShrimp/, 'FarmScreen should suppress event overlays during jumps');
  assert.match(farm, /showTankEvent&&feedingFrenzy/, 'feeding overlay must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]power['"]/, 'power event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]inspection['"]/, 'inspection event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]visitor['"]/, 'visitor event must respect jump focus');
  assert.match(farm, /showTankEvent&&ambientEvent===['"]treasure['"]/, 'treasure event must respect jump focus');
});
