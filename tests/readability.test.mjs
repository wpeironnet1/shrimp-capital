import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pixelText = readFileSync(new URL('../src/components/PixelText.tsx', import.meta.url), 'utf8');
const stockBrowser = readFileSync(new URL('../src/components/StockBrowser.tsx', import.meta.url), 'utf8');
const conditions = readFileSync(new URL('../src/components/TankConditionPanel.tsx', import.meta.url), 'utf8');

test('global typography keeps a practical mobile readability floor', () => {
  assert.match(pixelText, /minimumSize = isDisplayPixel \? 12 : (?:1[6-9]|[2-9]\d)/);
  assert.match(pixelText, /maxFontSizeMultiplier=\{1\.5\}/);
  assert.match(pixelText, /allowFontScaling/);
});

test('primary aquarium operation controls remain comfortably tappable', () => {
  assert.match(conditions, /action:\{[^}]*minHeight:(?:6[8-9]|[7-9]\d|[1-9]\d{2,})/);
  assert.match(conditions, /iconBox:\{width:(?:4[0-9]|[5-9]\d),height:(?:4[0-9]|[5-9]\d)/);
  assert.match(conditions, /actionsStacked:\{flexDirection:'column'\}/);
});

test('stock selection and inspection controls preserve mobile touch area', () => {
  assert.match(stockBrowser, /filter:\{minHeight:(?:4[4-9]|[5-9]\d)/);
  assert.match(stockBrowser, /sort:\{minHeight:(?:4[4-9]|[5-9]\d)/);
  assert.match(stockBrowser, /inspectButton:\{minHeight:(?:4[4-9]|[5-9]\d),minWidth:(?:8[0-9]|9\d|[1-9]\d{2,})/);
  assert.match(stockBrowser, /cardPhone:\{width:'100%'/);
  assert.match(stockBrowser, /cardTiny:\{minHeight:/);
});
