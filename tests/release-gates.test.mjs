import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'));
const eas = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'));
const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');

test('one-command validation covers typecheck, tests, and production web export', () => {
  assert.equal(pkg.scripts.validate, 'npm run typecheck && npm test && npm run build');
  assert.match(ci, /npm run typecheck/);
  assert.match(ci, /npm test/);
  assert.match(ci, /npm run build/);
});

test('native release metadata is explicit and versioned', () => {
  assert.ok(app.expo?.ios?.bundleIdentifier, 'iOS bundle identifier is required');
  assert.match(String(app.expo?.ios?.buildNumber ?? ''), /^\d+$/, 'iOS buildNumber must be numeric');
  assert.ok(app.expo?.android?.package, 'Android package id is required');
  assert.ok(Number.isInteger(app.expo?.android?.versionCode) && app.expo.android.versionCode > 0, 'Android versionCode must be positive');
});

test('EAS production builds auto-increment store build numbers', () => {
  assert.equal(eas.build?.production?.autoIncrement, true);
  assert.ok(eas.submit?.production, 'production submit profile should exist');
});
