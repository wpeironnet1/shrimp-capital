import { socialFormationOffset, socialMomentDelay, socialMomentFor } from '../aquariumChoreography';

describe('living aquarium choreography', () => {
  it('guarantees all four signature social moments in every four-event reel', () => {
    for (const seed of ['tank-3', 'tank-7', 'tank-12']) {
      const kinds = Array.from({ length: 4 }, (_, cycle) => socialMomentFor(seed, cycle).kind);
      expect(new Set(kinds)).toEqual(new Set(['school-run', 'feeding-rush', 'bubble-rally', 'market-panic']));
    }
  });

  it('keeps social moments frequent enough to make the tank feel alive without becoming constant noise', () => {
    for (let cycle = 0; cycle < 16; cycle += 1) {
      const delay = socialMomentDelay('tank-8', cycle);
      expect(delay).toBeGreaterThanOrEqual(15_000);
      expect(delay).toBeLessThanOrEqual(30_000);
    }
  });

  it('makes a crowded aquarium visibly livelier than a startup tank', () => {
    let startupTotal = 0;
    let crowdedTotal = 0;
    for (let cycle = 0; cycle < 24; cycle += 1) {
      startupTotal += socialMomentDelay('tank-3', cycle);
      crowdedTotal += socialMomentDelay('tank-12', cycle);
    }
    expect(crowdedTotal).toBeLessThan(startupTotal * .72);
  });

  it('keeps population-aware cadence inside deliberate spectacle bounds', () => {
    for (let cycle = 0; cycle < 24; cycle += 1) {
      expect(socialMomentDelay('tank-3', cycle)).toBeGreaterThanOrEqual(20_500);
      expect(socialMomentDelay('tank-3', cycle)).toBeLessThanOrEqual(30_000);
      expect(socialMomentDelay('tank-12', cycle)).toBeGreaterThanOrEqual(12_000);
      expect(socialMomentDelay('tank-12', cycle)).toBeLessThanOrEqual(18_000);
    }
  });

  it('gives each spectacle a visibly different formation', () => {
    const moments = ['school-run', 'feeding-rush', 'bubble-rally', 'market-panic'] as const;
    const signatures = moments.map((kind) => {
      const moment = { ...socialMomentFor('formation-seed', 0), kind };
      return [0, 1, 2, 3, 4]
        .map((index) => socialFormationOffset(index, 5, moment))
        .map(({ x, y }) => `${x.toFixed(2)}:${y.toFixed(2)}`)
        .join('|');
    });
    expect(new Set(signatures).size).toBe(moments.length);
  });

  it('keeps formation offsets bounded inside the aquarium choreography envelope', () => {
    for (let cycle = 0; cycle < 12; cycle += 1) {
      const moment = socialMomentFor('bounds-seed', cycle);
      for (let index = 0; index < 12; index += 1) {
        const { x, y } = socialFormationOffset(index, 12, moment);
        expect(Math.abs(x)).toBeLessThanOrEqual(1);
        expect(Math.abs(y)).toBeLessThanOrEqual(1);
      }
    }
  });
});
