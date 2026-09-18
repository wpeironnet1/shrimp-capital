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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 0.9, bobMultiplier: 1.05 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 1.35, bobMultiplier: 1.25 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.62, bobMultiplier: 0.72 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.78, bobMultiplier: 0.88 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 1.12, bobMultiplier: 1.05 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.0, bobMultiplier: 1.0 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 1.18, bobMultiplier: 1.12 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.94, bobMultiplier: 0.96 },
];

const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'reverse', 'bubbles', 'dart', 'spin'],
  Hyper: ['dart', 'dart', 'dart', 'spin', 'spin', 'wiggle', 'reverse'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'wiggle', 'wiggle', 'reverse', 'dart'],
  Shy: ['reverse', 'reverse', 'reverse', 'bubbles', 'wiggle', 'wiggle', 'dart'],
  Greedy: ['dart', 'dart', 'wiggle', 'dart', 'bubbles', 'spin', 'reverse'],
  Lucky: ['spin', 'spin', 'bubbles', 'wiggle', 'spin', 'dart', 'reverse'],
  Bold: ['spin', 'spin', 'dart', 'dart', 'spin', 'reverse', 'wiggle'],
  Diligent: ['wiggle', 'bubbles', 'reverse', 'wiggle', 'bubbles', 'dart', 'spin'],
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
 * Tap reactions are intentionally weighted by temperament instead of drawing
 * from one mostly-generic pool. Players should be able to learn a shrimp's
 * personality just by watching it: Hyper shrimp dart, Lazy shrimp blow
 * bubbles, Shy shrimp back away, and Bold/Lucky shrimp show off with spins.
 * Accessories add a rare show-off beat without replacing the personality.
 */
export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  if (hasAccessory) {
    // Roughly one quarter of taps on an accessorized shrimp become a special
    // sparkle/show-off reaction while its normal temperament remains visible.
    pool.push('accessory', 'accessory', 'accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const variation = 0.9 + (hashSeed(`${seed}-motion`) % 21) / 100;
  return {
    // Small deterministic variation stops same-personality shrimp from moving
    // in lockstep while retaining the strong temperament silhouette.
    driftDistance: Math.max(5, Math.round(baseDrift * profile.driftMultiplier * variation)),
    bobDuration: Math.max(650, Math.round((baseBobDuration / profile.bobMultiplier) / variation)),
  };
}
