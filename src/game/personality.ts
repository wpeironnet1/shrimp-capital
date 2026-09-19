export type ShrimpPersonality = 'Curious' | 'Hyper' | 'Lazy' | 'Shy' | 'Greedy' | 'Lucky' | 'Bold' | 'Diligent';

export type ShrimpReaction = 'wiggle' | 'dart' | 'bubbles' | 'reverse' | 'spin' | 'accessory';

export type ShrimpPersonalityProfile = {
  name: ShrimpPersonality;
  tagline: string;
  reactionBias: ShrimpReaction;
  driftMultiplier: number;
  bobMultiplier: number;
};

const profiles: ShrimpPersonalityProfile[] = [
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 1.7, bobMultiplier: 1.28 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 3.8, bobMultiplier: 2.8 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.42, bobMultiplier: 0.44 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.58, bobMultiplier: 0.62 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 2.65, bobMultiplier: 1.72 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.58, bobMultiplier: 1.38 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 3.05, bobMultiplier: 2.05 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.82, bobMultiplier: 0.84 },
];

// Reactions are weighted enough to make temperament readable, but deliberately
// retain a broad repertoire so repeated taps feel like interacting with a tiny
// animal rather than replaying one canned animation.
const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'bubbles', 'reverse', 'dart', 'spin', 'bubbles', 'wiggle', 'reverse'],
  Hyper: ['dart', 'dart', 'dart', 'spin', 'spin', 'wiggle', 'reverse', 'bubbles', 'dart', 'wiggle'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'wiggle', 'wiggle', 'reverse', 'spin', 'dart', 'bubbles', 'reverse'],
  Shy: ['reverse', 'reverse', 'reverse', 'bubbles', 'bubbles', 'wiggle', 'dart', 'spin', 'reverse', 'wiggle'],
  Greedy: ['dart', 'dart', 'dart', 'wiggle', 'bubbles', 'spin', 'reverse', 'dart', 'wiggle', 'bubbles'],
  Lucky: ['spin', 'spin', 'spin', 'bubbles', 'wiggle', 'dart', 'reverse', 'spin', 'bubbles', 'wiggle'],
  Bold: ['spin', 'spin', 'spin', 'dart', 'dart', 'reverse', 'wiggle', 'bubbles', 'dart', 'spin'],
  Diligent: ['wiggle', 'wiggle', 'bubbles', 'bubbles', 'reverse', 'reverse', 'dart', 'spin', 'wiggle', 'bubbles'],
};

const accessoryShowoffWeight: Record<ShrimpPersonality, number> = {
  Curious: 7,
  Hyper: 5,
  Lazy: 4,
  Shy: 2,
  Greedy: 7,
  Lucky: 8,
  Bold: 9,
  Diligent: 11,
};

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function personalityFor(seed: string): ShrimpPersonalityProfile {
  return profiles[hashSeed(seed) % profiles.length];
}

export function personalityForSpecies(speciesId: string, populationIndex = 0): ShrimpPersonalityProfile {
  return personalityFor(`${speciesId}-${Math.max(0, populationIndex)}`);
}

/**
 * Tap reactions are weighted by temperament instead of drawing from one
 * generic pool. Rare accessories now inherit temperament too: a shy shrimp
 * only occasionally flashes its crown/visor, while Bold and Diligent shrimp
 * deliberately show theirs off. This keeps rare animals collectible without
 * turning every dressed shrimp into the same canned animation.
 */
export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  if (hasAccessory) {
    const showoffWeight = accessoryShowoffWeight[profile.name];
    for (let i = 0; i < showoffWeight; i += 1) pool.push('accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  // Per-animal variation prevents rows of same-species shrimp from moving in lockstep.
  // The wider range is intentional: even two Hyper shrimp should not look cloned.
  const distanceVariation = 0.55 + (hashSeed(`${seed}-distance`) % 126) / 100;
  const cadenceVariation = 0.52 + (hashSeed(`${seed}-cadence`) % 126) / 100;
  const breathingVariation = 0.78 + (hashSeed(`${seed}-breathing`) % 49) / 100;
  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.9,
    Hyper: 0.62,
    Lazy: 1.42,
    Shy: 1.3,
    Greedy: 0.74,
    Lucky: 0.96,
    Bold: 0.68,
    Diligent: 1.14,
  };
  const rawDrift = Math.round(baseDrift * profile.driftMultiplier * distanceVariation);
  // Quiet shrimp still visibly cruise on a narrow phone, while energetic shrimp
  // can cross a meaningful portion of the tank without escaping the glass.
  const driftDistance = Math.max(7, Math.min(52, rawDrift));
  return {
    driftDistance,
    bobDuration: Math.max(320, Math.min(4600, Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name]))),
  };
}
