import { aquariumLifeLabel, aquariumLifePlan, aquariumLifePoolFor } from '../aquariumLife';

const beats = ['cruise','forage','rest','inspect','hide','chase','surface','school','bubble-trail'] as const;

describe('aquarium life planning', () => {
  it('is deterministic for a shrimp and cycle while evolving over time', () => {
    const first = aquariumLifePlan('ghost-0', 3);
    expect(aquariumLifePlan('ghost-0', 3)).toEqual(first);
    const timeline = Array.from({ length: 12 }, (_, cycle) => aquariumLifePlan('ghost-0', cycle).primary);
    expect(new Set(timeline).size).toBeGreaterThan(1);
  });

  it('keeps every plan inside safe animation bounds', () => {
    for (const seed of ['ghost-0','tiger-2','amano-4','crystal-7','royal-11']) {
      for (let cycle = 0; cycle < 20; cycle += 1) {
        const plan = aquariumLifePlan(seed, cycle);
        expect(beats).toContain(plan.primary);
        expect(beats).toContain(plan.secondary);
        expect(plan.secondary).not.toBe(plan.primary);
        expect(plan.pauseMs).toBeGreaterThanOrEqual(650);
        expect(plan.pauseMs).toBeLessThanOrEqual(4100);
        expect(plan.speedMultiplier).toBeGreaterThan(0);
        expect(plan.speedMultiplier).toBeLessThanOrEqual(1.55);
        expect(plan.travelScale).toBeGreaterThanOrEqual(0.72);
        expect(plan.travelScale).toBeLessThanOrEqual(1.45);
        expect(plan.verticalBias).toBeGreaterThanOrEqual(-0.9);
        expect(plan.verticalBias).toBeLessThanOrEqual(0.88);
      }
    }
  });

  it('gives personalities recognizable behavior pools', () => {
    const pools = Array.from({ length: 24 }, (_, index) => aquariumLifePoolFor(`desk-shrimp-${index}`).join('|'));
    expect(new Set(pools).size).toBeGreaterThan(3);
    expect(pools.some(pool => pool.includes('rest'))).toBe(true);
    expect(pools.some(pool => pool.includes('chase'))).toBe(true);
    expect(pools.some(pool => pool.includes('inspect'))).toBe(true);
  });

  it('has a Wall Street flavored player-facing label for every beat', () => {
    for (const beat of beats) {
      const label = aquariumLifeLabel(beat);
      expect(label.length).toBeGreaterThan(5);
      expect(label).toBe(label.toUpperCase());
    }
  });
});
