import { habitatPoseFor, socialMomentDelay, socialMomentFor, socialFormationOffset } from './aquariumChoreography';

describe('living aquarium choreography', () => {
  it('is deterministic for the same shrimp and cycle', () => {
    expect(habitatPoseFor('cherry-3', 4)).toEqual(habitatPoseFor('cherry-3', 4));
    expect(socialMomentDelay('cherry-3', 4)).toBe(socialMomentDelay('cherry-3', 4));
    expect(socialMomentFor('tank-8', 4)).toEqual(socialMomentFor('tank-8', 4));
  });

  it('keeps every habitat pose inside safe animation bounds', () => {
    const seeds = Array.from({ length: 40 }, (_, i) => `shrimp-${i}`);
    for (const seed of seeds) {
      for (let cycle = 0; cycle < 12; cycle += 1) {
        const pose = habitatPoseFor(seed, cycle);
        expect(pose.xBias).toBeGreaterThanOrEqual(-1);
        expect(pose.xBias).toBeLessThanOrEqual(1);
        expect(pose.yBias).toBeGreaterThanOrEqual(-1);
        expect(pose.yBias).toBeLessThanOrEqual(1);
        expect(pose.dwellMs).toBeGreaterThanOrEqual(2500);
        expect(pose.dwellMs).toBeLessThanOrEqual(15000);
        expect(pose.bubbleChance).toBeGreaterThanOrEqual(0);
        expect(pose.bubbleChance).toBeLessThanOrEqual(1);
        expect(pose.speedScale).toBeGreaterThan(0);
      }
    }
  });

  it('produces a varied living habitat rather than one repeated swim state', () => {
    const behaviors = new Set<string>();
    const zones = new Set<string>();
    for (let i = 0; i < 60; i += 1) {
      for (let cycle = 0; cycle < 8; cycle += 1) {
        const pose = habitatPoseFor(`desk-${i}`, cycle);
        behaviors.add(pose.behavior);
        zones.add(pose.zone);
      }
    }
    expect(behaviors).toEqual(new Set(['patrol', 'graze', 'hide', 'rest', 'inspect', 'school']));
    expect(zones).toEqual(new Set(['open-water', 'substrate', 'plants', 'equipment', 'school']));
  });

  it('gives different cycles new destinations without touching save data', () => {
    const poses = Array.from({ length: 10 }, (_, cycle) => habitatPoseFor('market-maker-7', cycle));
    const destinations = new Set(poses.map(pose => `${pose.zone}:${pose.xBias.toFixed(2)}:${pose.yBias.toFixed(2)}`));
    expect(destinations.size).toBeGreaterThan(4);
  });

  it('introduces a young desk with a personality parade and a full tank with a bubble rally', () => {
    for (const population of [3, 4, 5, 7, 9, 10, 11]) {
      expect(socialMomentFor(`tank-${population}`, 0).kind).toBe('personality-parade');
    }
    expect(socialMomentFor('tank-12', 0).kind).toBe('bubble-rally');
  });

  it('keeps individual social pacing calm while filled tanks burst more often', () => {
    for (let i = 0; i < 50; i += 1) {
      const delay = socialMomentDelay(`social-${i}`, i);
      expect(delay).toBeGreaterThanOrEqual(9000);
      expect(delay).toBeLessThanOrEqual(26000);
    }
    for (const population of [3, 5, 8, 12]) {
      for (let cycle = 0; cycle < 18; cycle += 1) {
        const delay = socialMomentDelay(`tank-${population}`, cycle);
        expect(delay).toBeGreaterThanOrEqual(7000);
        expect(delay).toBeLessThanOrEqual(21000);
      }
    }
  });

  it('cycles through every social spectacle in a mature tank', () => {
    const kinds = new Set(Array.from({ length: 36 }, (_, cycle) => socialMomentFor('tank-12', cycle).kind));
    expect(kinds).toEqual(new Set(['school-run', 'feeding-rush', 'bubble-rally', 'market-panic', 'personality-parade']));
  });

  it('keeps social formations inside safe normalized choreography bounds', () => {
    for (const population of [3, 6, 9, 12]) {
      for (let cycle = 0; cycle < 12; cycle += 1) {
        const moment = socialMomentFor(`tank-${population}`, cycle);
        for (let index = 0; index < population; index += 1) {
          const offset = socialFormationOffset(index, population, moment);
          expect(offset.x).toBeGreaterThanOrEqual(-1.1);
          expect(offset.x).toBeLessThanOrEqual(1.1);
          expect(offset.y).toBeGreaterThanOrEqual(-1.1);
          expect(offset.y).toBeLessThanOrEqual(1.1);
        }
      }
    }
  });
});
