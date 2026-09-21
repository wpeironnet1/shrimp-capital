import { personalityFor, personalityMotion, personalityReactionPool } from '../personality';

const coreReactions = ['dart', 'spin', 'bubbles', 'wiggle', 'reverse'] as const;

describe('shrimp personality game feel', () => {
  it('keeps every shrimp tap repertoire varied instead of collapsing to one animation', () => {
    for (let index = 0; index < 48; index += 1) {
      const seed = `desk-shrimp-${index}`;
      const pool = personalityReactionPool(seed, false);
      const distinctCore = new Set(pool.filter(reaction => reaction !== 'accessory'));
      expect(distinctCore.size).toBeGreaterThanOrEqual(5);
      for (const reaction of coreReactions) expect(pool).toContain(reaction);
    }
  });

  it('makes equipped shrimp visibly capable of showing off their rare accessory', () => {
    for (let index = 0; index < 24; index += 1) {
      const pool = personalityReactionPool(`accessory-shrimp-${index}`, true);
      const accessoryWeight = pool.filter(reaction => reaction === 'accessory').length / pool.length;
      expect(pool).toContain('accessory');
      expect(accessoryWeight).toBeGreaterThanOrEqual(0.25);
    }
  });

  it('preserves strong personality contrast in autonomous aquarium motion', () => {
    const samples = Array.from({ length: 120 }, (_, index) => {
      const seed = `motion-audit-${index}`;
      return { profile: personalityFor(seed), motion: personalityMotion(seed, 13, 1200) };
    });
    const hyper = samples.find(sample => sample.profile.name === 'Hyper');
    const lazy = samples.find(sample => sample.profile.name === 'Lazy');
    const shark = samples.find(sample => sample.profile.name === 'Shark');
    const diamond = samples.find(sample => sample.profile.name === 'Diamond Hands');
    expect(hyper).toBeDefined();
    expect(lazy).toBeDefined();
    expect(shark).toBeDefined();
    expect(diamond).toBeDefined();
    expect(hyper!.motion.driftDistance).toBeGreaterThan(lazy!.motion.driftDistance * 8);
    expect(shark!.motion.driftDistance).toBeGreaterThan(diamond!.motion.driftDistance * 8);
    expect(lazy!.motion.bobDuration).toBeGreaterThan(hyper!.motion.bobDuration * 6);
  });
});
