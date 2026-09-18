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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 0.96, bobMultiplier: 1.1 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 1.82, bobMultiplier: 1.62 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.38, bobMultiplier: 0.5 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.54, bobMultiplier: 0.7 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 1.38, bobMultiplier: 1.2 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.08, bobMultiplier: 1.08 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 1.55, bobMultiplier: 1.34 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.82, bobMultiplier: 0.88 },
];

// Reactions are deliberately strongly weighted. A player should be able to
// recognize temperament after only a few taps rather than seeing every shrimp
// behave like the same actor with a different label.
const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'wiggle', 'reverse', 'bubbles', 'wiggle', 'dart'],
  Hyper: ['dart', 'dart', 'dart', 'dart', 'spin', 'dart', 'spin', 'wiggle'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'wiggle', 'bubbles', 'wiggle', 'reverse'],
  Shy: ['reverse', 'reverse', 'reverse', 'reverse', 'bubbles', 'reverse', 'wiggle', 'bubbles'],
  Greedy: ['dart', 'dart', 'dart', 'wiggle', 'dart', 'bubbles', 'dart', 'spin'],
  Lucky: ['spin', 'spin', 'spin', 'bubbles', 'spin', 'wiggle', 'spin', 'dart'],
  Bold: ['spin', 'spin', 'dart', 'spin', 'dart', 'spin', 'dart', 'reverse'],
  Diligent: ['wiggle', 'bubbles', 'wiggle', 'reverse', 'bubbles', 'wiggle', 'bubbles', 'dart'],
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
    // Rare accessories should announce themselves. Roughly half of the expanded
    // pool is a sparkle/show-off beat, while the rest still exposes personality.
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  // Two independent deterministic variations keep neighboring shrimp from
  // moving in lockstep. Distance and cadence no longer rise/fall together,
  // which produces visibly less robotic aquarium motion without timers/state.
  const distanceVariation = 0.84 + (hashSeed(`${seed}-distance`) % 33) / 100;
  const cadenceVariation = 0.82 + (hashSeed(`${seed}-cadence`) % 39) / 100;
  return {
    // Strong silhouettes make temperament readable at aquarium scale: Hyper
    // and Bold shrimp patrol broadly, while Lazy/Shy shrimp linger locally.
    driftDistance: Math.max(4, Math.round(baseDrift * profile.driftMultiplier * distanceVariation)),
    bobDuration: Math.max(560, Math.round((baseBobDuration / profile.bobMultiplier) / cadenceVariation)),
  };
}
