import { socialFormationOffset, socialMomentDelay, socialMomentFor } from '../aquariumChoreography';

describe('living aquarium choreography', () => {
  it('keeps the core four social moments represented and unlocks personality parades in mature tanks', () => {
    const startup = Array.from({ length: 12 }, (_, cycle) => socialMomentFor('tank-3', cycle).kind);
    expect(new Set(startup)).toEqual(new Set(['school-run', 'feeding-rush', 'bubble-rally', 'market-panic']));
    for (const seed of ['tank-7', 'tank-12']) {
      const kinds = Array.from({ length: 18 }, (_, cycle) => socialMomentFor(seed, cycle).kind);
      expect(new Set(kinds)).toEqual(new Set(['school-run', 'feeding-rush', 'bubble-rally', 'market-panic', 'personality-parade']));
    }
  });

  it('gives mature tanks more high-energy spectacle without adding UI clutter', () => {
    const startup = Array.from({ length: 24 }, (_, cycle) => socialMomentFor('tank-3', cycle).kind);
    const mature = Array.from({ length: 24 }, (_, cycle) => socialMomentFor('tank-12', cycle).kind);
    const highEnergy = (kinds: string[]) => kinds.filter(kind => kind === 'bubble-rally' || kind === 'market-panic' || kind === 'personality-parade').length;
    expect(highEnergy(mature)).toBeGreaterThan(highEnergy(startup));
  });

  it('keeps social moments frequent enough to make the tank feel alive without becoming constant noise', () => {
    for (let cycle = 0; cycle < 16; cycle += 1) {
      const delay = socialMomentDelay('tank-8', cycle);
      expect(delay).toBeGreaterThanOrEqual(9_000);
      expect(delay).toBeLessThanOrEqual(17_000);
    }
  });

  it('makes a crowded aquarium visibly livelier than a startup tank', () => {
    let startupTotal = 0;
    let crowdedTotal = 0;
    for (let cycle = 0; cycle < 24; cycle += 1) {
      startupTotal += socialMomentDelay('tank-3', cycle);
      crowdedTotal += socialMomentDelay('tank-12', cycle);
    }
    expect(crowdedTotal).toBeLessThan(startupTotal * .78);
  });

  it('keeps population-aware cadence inside deliberate spectacle bounds including quiet beats', () => {
    for (let cycle = 0; cycle < 24; cycle += 1) {
      expect(socialMomentDelay('tank-3', cycle)).toBeGreaterThanOrEqual(11_000);
      expect(socialMomentDelay('tank-3', cycle)).toBeLessThanOrEqual(19_500);
      expect(socialMomentDelay('tank-12', cycle)).toBeGreaterThanOrEqual(7_500);
      expect(socialMomentDelay('tank-12', cycle)).toBeLessThanOrEqual(14_500);
    }
  });

  it('opens a stocked desk with personality spectacle and a full tank with a bubble rally', () => {
    expect(socialMomentFor('tank-3', 0).kind).toBe('personality-parade');
    expect(socialMomentFor('tank-7', 0).kind).toBe('personality-parade');
    expect(socialMomentFor('tank-12', 0).kind).toBe('bubble-rally');
  });

  it('gives every spectacle a visibly different formation', () => {
    const moments = ['school-run', 'feeding-rush', 'bubble-rally', 'market-panic', 'personality-parade'] as const;
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
    for (let cycle = 0; cycle < 18; cycle += 1) {
      const moment = socialMomentFor('tank-12', cycle);
      for (let index = 0; index < 12; index += 1) {
        const { x, y } = socialFormationOffset(index, 12, moment);
        expect(Math.abs(x)).toBeLessThanOrEqual(1);
        expect(Math.abs(y)).toBeLessThanOrEqual(1);
      }
    }
  });
});
