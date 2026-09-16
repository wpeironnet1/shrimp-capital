import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo;
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('native identity is stable and App Store launch is intentionally iPhone-first', () => {
  assert.equal(app.name, 'Shrimp Capital');
  assert.equal(app.slug, 'shrimp-capital');
  assert.equal(app.orientation, 'portrait');
  assert.equal(app.ios.supportsTablet, false);
  assert.equal(app.ios.requireFullScreen, true);
  assert.match(app.ios.bundleIdentifier, /^[a-zA-Z][a-zA-Z0-9.-]+$/);
  assert.match(app.android.package, /^[a-zA-Z][a-zA-Z0-9_.]+$/);
});

test('release metadata cannot silently regress', () => {
  assert.match(app.version, /^\d+\.\d+\.\d+$/);
  assert.ok(Number(app.ios.buildNumber) >= 1);
  assert.ok(app.android.versionCode >= 1);
  assert.equal(app.ios.infoPlist.ITSAppUsesNonExemptEncryption, false);
});

test('one-command validation covers type safety, gameplay tests, and production web export', () => {
  assert.ok(pkg.scripts.validate.includes('typecheck'));
  assert.ok(pkg.scripts.validate.includes('test'));
  assert.ok(pkg.scripts.validate.includes('build'));
  assert.equal(pkg.scripts.typecheck, 'tsc --noEmit');
  assert.ok(pkg.scripts.test.includes('tests/*.test.mjs'));
  assert.ok(pkg.scripts.build.includes('expo export --platform web'));
});

test('launch-critical runtime packages remain explicit dependencies', () => {
  for (const dependency of [
    'expo-router',
    'expo-haptics',
    '@react-native-async-storage/async-storage',
    'react-native-safe-area-context',
  ]) {
    assert.ok(pkg.dependencies[dependency], `missing launch dependency: ${dependency}`);
  }
});
