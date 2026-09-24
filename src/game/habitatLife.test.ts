import { habitatLifeBeatFor, habitatLifeSequence } from './habitatLife';

describe('personality-driven habitat life', () => {
  it('is deterministic for a shrimp and cycle without touching save state', () => {
    expect(habitatLifeBeatFor('neocaridina-0', 3)).toEqual(habitatLifeBeatFor('neocaridina-0', 3));
  });

  it('produces varied aquarium behavior over a visible sequence', () => {
    const beats = habitatLifeSequence('neocaridina-0', 18);
    expect(beats).toHaveLength(18);
    expect(new Set(beats.map(beat => beat.behavior)).size).toBeGreaterThan(1);
    expect(new Set(beats.map(beat => `${beat.horizontalBias}:${beat.verticalBias}`)).size).toBeGreaterThan(3);
  });

  it('maps habitat behaviors to recognizable aquarium destinations', () => {
    const beats = Array.from({ length: 64 }, (_, cycle) => habitatLifeBeatFor('habitat-coverage-shrimp', cycle));
    const byBehavior = new Map(beats.map(beat => [beat.behavior, beat]));

    if (byBehavior.has('graze')) expect(byBehavior.get('graze')?.propFocus).toBe('substrate');
    if (byBehavior.has('hide')) expect(byBehavior.get('hide')?.propFocus).toBe('plant');
    if (byBehavior.has('inspect')) expect(byBehavior.get('inspect')?.propFocus).toBe('equipment');
    if (byBehavior.has('school')) expect(byBehavior.get('school')?.propFocus).toBe('school');
  });

  it('keeps choreography bounded enough for the aquarium viewport', () => {
    for (let cycle = 0; cycle < 100; cycle += 1) {
      const beat = habitatLifeBeatFor('viewport-safety-shrimp', cycle);
      expect(Math.abs(beat.horizontalBias)).toBeLessThanOrEqual(70);
      expect(Math.abs(beat.verticalBias)).toBeLessThanOrEqual(30);
      expect(beat.pauseMs).toBeGreaterThanOrEqual(1400);
      expect(beat.pauseMs).toBeLessThanOrEqual(7000);
    }
  });

  it('never returns an empty sequence even if a caller requests zero beats', () => {
    expect(habitatLifeSequence('fallback-shrimp', 0)).toHaveLength(1);
  });
});
