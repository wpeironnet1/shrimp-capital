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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 1.02, bobMultiplier: 1.12 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 2.2, bobMultiplier: 1.82 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.24, bobMultiplier: 0.4 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.42, bobMultiplier: 0.62 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 1.62, bobMultiplier: 1.28 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.12, bobMultiplier: 1.12 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 1.86, bobMultiplier: 1.48 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.72, bobMultiplier: 0.82 },
];

// Tap silhouettes are intentionally exaggerated at aquarium scale. Each
// temperament has a signature move, a secondary tell, and a small chance of a
// surprise. That keeps repeated tapping playful without making personalities
// feel interchangeable.
const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'wiggle', 'wiggle', 'bubbles', 'reverse', 'dart'],
  Hyper: ['dart', 'dart', 'dart', 'dart', 'dart', 'spin', 'wiggle', 'reverse'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'wiggle', 'reverse', 'spin'],
  Shy: ['reverse', 'reverse', 'reverse', 'reverse', 'reverse', 'bubbles', 'wiggle', 'dart'],
  Greedy: ['dart', 'dart', 'dart', 'dart', 'wiggle', 'bubbles', 'spin', 'reverse'],
  Lucky: ['spin', 'spin', 'spin', 'spin', 'bubbles', 'wiggle', 'dart', 'reverse'],
  Bold: ['spin', 'spin', 'spin', 'dart', 'dart', 'dart', 'wiggle', 'reverse'],
  Diligent: ['wiggle', 'wiggle', 'bubbles', 'bubbles', 'reverse', 'wiggle', 'dart', 'spin'],
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
    // Rare dressed shrimp now show off on roughly half of taps. The remaining
    // taps still expose their underlying temperament, so the accessory feels
    // like a special layer rather than erasing the shrimp's identity.
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  // Independent deterministic variations prevent neighboring shrimp from
  // marching in lockstep while preserving a stable identity across reloads.
  const distanceVariation = 0.72 + (hashSeed(`${seed}-distance`) % 57) / 100;
  const cadenceVariation = 0.7 + (hashSeed(`${seed}-cadence`) % 63) / 100;
  return {
    // Exaggerated silhouettes are intentional at aquarium scale: Hyper/Bold
    // patrol the glass while Lazy/Shy hover locally. A wider per-shrimp range
    // breaks up synchronized motion and makes a full tank feel organic.
    driftDistance: Math.max(3, Math.round(baseDrift * profile.driftMultiplier * distanceVariation)),
    bobDuration: Math.max(460, Math.round((baseBobDuration / profile.bobMultiplier) / cadenceVariation)),
  };
}
