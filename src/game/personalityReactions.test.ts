import { personalityFor, personalityMotion, personalityReactionPool } from './personality';

describe('shrimp personality reactions', () => {
  const seeds = Array.from({ length: 40 }, (_, index) => `reaction-shrimp-${index}`);

  it('keeps the complete tap-reaction vocabulary available across personalities', () => {
    const expected = ['bubbles', 'dart', 'reverse', 'spin', 'wiggle'];

    for (const seed of seeds) {
      const pool = new Set(personalityReactionPool(seed, false));
      for (const reaction of expected) expect(pool.has(reaction as any)).toBe(true);
      expect(pool.has('accessory')).toBe(false);
    }
  });

  it('makes collectible wardrobe unlock a conspicuous accessory flourish', () => {
    for (const seed of seeds) {
      const plain = personalityReactionPool(seed, false);
      const dressed = personalityReactionPool(seed, true);
      const flourishes = dressed.filter(reaction => reaction === 'accessory').length;

      expect(flourishes).toBeGreaterThanOrEqual(10);
      expect(dressed.length).toBeGreaterThan(plain.length);
    }
  });

  it('keeps personalities visually distinct in their cruising motion', () => {
    const samples = seeds.map(seed => ({
      name: personalityFor(seed).name,
      ...personalityMotion(seed, 13, 1200),
    }));
    const driftBands = new Set(samples.map(sample => Math.round(sample.driftDistance / 8)));
    const bobBands = new Set(samples.map(sample => Math.round(sample.bobDuration / 400)));

    expect(new Set(samples.map(sample => sample.name)).size).toBeGreaterThanOrEqual(12);
    expect(driftBands.size).toBeGreaterThanOrEqual(7);
    expect(bobBands.size).toBeGreaterThanOrEqual(7);
  });
});
