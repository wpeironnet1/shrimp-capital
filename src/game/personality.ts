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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 0.92, bobMultiplier: 1.08 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 1.65, bobMultiplier: 1.48 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.48, bobMultiplier: 0.58 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.64, bobMultiplier: 0.78 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 1.28, bobMultiplier: 1.14 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.04, bobMultiplier: 1.04 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 1.42, bobMultiplier: 1.26 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.88, bobMultiplier: 0.92 },
];

// Reactions are deliberately strongly weighted. A player should be able to
// recognize temperament after only a few taps rather than seeing every shrimp
// behave like the same actor with a different label.
const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'wiggle', 'wiggle', 'reverse', 'bubbles', 'dart'],
  Hyper: ['dart', 'dart', 'dart', 'dart', 'dart', 'spin', 'spin', 'wiggle'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'wiggle', 'wiggle', 'reverse'],
  Shy: ['reverse', 'reverse', 'reverse', 'reverse', 'reverse', 'bubbles', 'wiggle', 'wiggle'],
  Greedy: ['dart', 'dart', 'dart', 'dart', 'wiggle', 'bubbles', 'dart', 'spin'],
  Lucky: ['spin', 'spin', 'spin', 'spin', 'bubbles', 'wiggle', 'spin', 'dart'],
  Bold: ['spin', 'spin', 'spin', 'dart', 'dart', 'spin', 'dart', 'reverse'],
  Diligent: ['wiggle', 'bubbles', 'wiggle', 'bubbles', 'reverse', 'wiggle', 'bubbles', 'dart'],
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
 * generic pool. Accessories add a conspicuous show-off beat without replacing
 * temperament, so finding a rare dressed shrimp changes how it feels to tap.
 */
export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  if (hasAccessory) {
    // Rare accessories deserve to read as rare. A dressed shrimp now shows off
    // often enough that a player is likely to discover the sparkle animation
    // naturally, while most taps still reveal its underlying temperament.
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const variation = 0.9 + (hashSeed(`${seed}-motion`) % 21) / 100;
  return {
    // Broad silhouettes make temperament readable without opening an inspector:
    // Hyper/Bold shrimp roam, while Lazy/Shy shrimp hug their lane. Per-shrimp
    // deterministic variation prevents synchronized robotic motion.
    driftDistance: Math.max(5, Math.round(baseDrift * profile.driftMultiplier * variation)),
    bobDuration: Math.max(650, Math.round((baseBobDuration / profile.bobMultiplier) / variation)),
  };
}
