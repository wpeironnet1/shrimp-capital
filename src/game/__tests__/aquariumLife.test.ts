import { aquariumLifeLabel, aquariumLifePlan, aquariumLifePoolFor, aquariumSocialPlan } from '../aquariumLife';

const beats = ['cruise','forage','rest','inspect','hide','chase','surface','school','bubble-trail'] as const;
const habitatTargets = ['open-water','substrate','plants','equipment','surface','school'] as const;
const socialFx = ['bell','crumbs','bubbles','ticker','glimmer'] as const;
const socialHaptics = ['light','success','none'] as const;

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
        expect(habitatTargets).toContain(plan.habitatTarget);
        expect(plan.settleScale).toBeGreaterThanOrEqual(.88);
        expect(plan.settleScale).toBeLessThanOrEqual(1.04);
      }
    }
  });

  it('maps recognizable behaviors to physical aquarium zones', () => {
    const plans = Array.from({ length: 120 }, (_, cycle) => aquariumLifePlan('habitat-audit', cycle));
    const byBeat = new Map(plans.map(plan => [plan.primary, plan]));
    if (byBeat.has('forage')) expect(byBeat.get('forage')?.habitatTarget).toBe('substrate');
    if (byBeat.has('rest')) expect(byBeat.get('rest')?.habitatTarget).toBe('plants');
    if (byBeat.has('inspect')) expect(byBeat.get('inspect')?.habitatTarget).toBe('equipment');
    if (byBeat.has('surface')) expect(byBeat.get('surface')?.habitatTarget).toBe('surface');
    if (byBeat.has('school')) expect(byBeat.get('school')?.habitatTarget).toBe('school');
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

  it('creates safe deterministic tank-wide social choreography', () => {
    const first = aquariumSocialPlan('main-tank', 4, 12);
    expect(aquariumSocialPlan('main-tank', 4, 12)).toEqual(first);
    const timeline = Array.from({ length: 20 }, (_, cycle) => aquariumSocialPlan('main-tank', cycle, 8));
    expect(new Set(timeline.map(plan => plan.moment)).size).toBeGreaterThan(2);
    for (const plan of timeline) {
      expect(beats).toContain(plan.leadBeat);
      expect(beats).toContain(plan.echoBeat);
      expect(plan.staggerMs).toBeGreaterThanOrEqual(45);
      expect(plan.staggerMs).toBeLessThanOrEqual(130);
      expect(plan.durationMs).toBeGreaterThanOrEqual(1450);
      expect(plan.durationMs).toBeLessThanOrEqual(3000);
      expect(plan.intensity).toBeGreaterThanOrEqual(.55);
      expect(plan.intensity).toBeLessThanOrEqual(1);
      expect(plan.label.length).toBeGreaterThan(5);
      expect(plan.label).toBe(plan.label.toUpperCase());
      expect(socialFx).toContain(plan.fx);
      expect(socialHaptics).toContain(plan.haptic);
    }
  });

  it('keeps each social moment visually recognizable instead of collapsing into one generic effect', () => {
    const plans = Array.from({ length: 80 }, (_, cycle) => aquariumSocialPlan('presentation-audit', cycle, 12));
    const byMoment = new Map(plans.map(plan => [plan.moment, plan]));
    expect(byMoment.size).toBe(5);
    expect(new Set([...byMoment.values()].map(plan => plan.fx)).size).toBe(5);
    expect(new Set([...byMoment.values()].map(plan => plan.label)).size).toBe(5);
  });

  it('scales social-moment intensity with a fuller aquarium', () => {
    expect(aquariumSocialPlan('main-tank', 2, 12).intensity)
      .toBeGreaterThan(aquariumSocialPlan('main-tank', 2, 1).intensity);
  });
});
