import {
  personalityFor,
  personalityMotion,
  personalityReactionPool,
  signatureReactionFor,
} from '../personality';

const SHRIMP_SAMPLE = Array.from({ length: 80 }, (_, index) => `aquarium-shrimp-${index}`);

describe('living aquarium vitality', () => {
  it('keeps every visible shrimp moving while preserving meaningful temperament differences', () => {
    const motions = SHRIMP_SAMPLE.map(seed => ({
      seed,
      profile: personalityFor(seed),
      motion: personalityMotion(seed, 13, 1350),
    }));

    for (const { motion } of motions) {
      expect(motion.driftDistance).toBeGreaterThan(0);
      expect(motion.bobDuration).toBeGreaterThan(0);
      expect(motion.driftDistance).toBeLessThanOrEqual(92);
      expect(motion.bobDuration).toBeLessThanOrEqual(8200);
    }

    const driftDistances = motions.map(({ motion }) => motion.driftDistance);
    const bobDurations = motions.map(({ motion }) => motion.bobDuration);
    expect(Math.max(...driftDistances) - Math.min(...driftDistances)).toBeGreaterThanOrEqual(45);
    expect(Math.max(...bobDurations) - Math.min(...bobDurations)).toBeGreaterThanOrEqual(2500);
  });

  it('gives a population multiple signature reactions instead of a single canned tap animation', () => {
    const signatures = new Set(SHRIMP_SAMPLE.map(signatureReactionFor));
    expect(signatures.size).toBeGreaterThanOrEqual(4);
  });

  it('keeps personality reactions varied for every shrimp', () => {
    for (const seed of SHRIMP_SAMPLE) {
      const reactions = new Set(personalityReactionPool(seed, false));
      expect(reactions.size).toBeGreaterThanOrEqual(5);
    }
  });

  it('makes rare accessories a dominant collectible tap moment without removing personality', () => {
    for (const seed of SHRIMP_SAMPLE.slice(0, 24)) {
      const pool = personalityReactionPool(seed, true);
      const accessoryMoments = pool.filter(reaction => reaction === 'accessory').length;
      const otherMoments = pool.filter(reaction => reaction !== 'accessory').length;

      expect(accessoryMoments).toBeGreaterThan(otherMoments / 2);
      expect(new Set(pool.filter(reaction => reaction !== 'accessory')).size).toBeGreaterThanOrEqual(4);
    }
  });
});
