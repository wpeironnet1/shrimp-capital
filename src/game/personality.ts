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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 1.35, bobMultiplier: 1.18 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 3.15, bobMultiplier: 2.35 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.12, bobMultiplier: 0.28 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.26, bobMultiplier: 0.46 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 2.15, bobMultiplier: 1.48 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.42, bobMultiplier: 1.26 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 2.55, bobMultiplier: 1.78 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.58, bobMultiplier: 0.68 },
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
    // Dressed shrimp should read as rare immediately when touched: about half
    // of taps become a sparkle/show-off beat while the other half still expose
    // the underlying temperament.
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  // Stable per-shrimp variance prevents the tank from looking synchronized.
  // The broad personality multipliers are intentional: at aquarium scale the
  // player should be able to identify a hyper trader versus a lazy one without
  // opening an inspector.
  const distanceVariation = 0.58 + (hashSeed(`${seed}-distance`) % 91) / 100;
  const cadenceVariation = 0.54 + (hashSeed(`${seed}-cadence`) % 101) / 100;
  const microPauseVariation = 0.86 + (hashSeed(`${seed}-pause`) % 29) / 100;
  return {
    // Hyper/Bold patrol aggressively, Greedy shrimp chase activity, Curious
    // shrimp investigate a wider patch, while Lazy/Shy barely leave a perch.
    // A two-pixel floor keeps quiet shrimp visibly breathing rather than frozen.
    driftDistance: Math.max(2, Math.round(baseDrift * profile.driftMultiplier * distanceVariation)),
    bobDuration: Math.max(390, Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * microPauseVariation)),
  };
}
