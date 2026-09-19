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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 1.55, bobMultiplier: 1.2 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 3.45, bobMultiplier: 2.55 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.1, bobMultiplier: 0.24 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.22, bobMultiplier: 0.4 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 2.4, bobMultiplier: 1.58 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.48, bobMultiplier: 1.32 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 2.8, bobMultiplier: 1.9 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.5, bobMultiplier: 0.62 },
];

// Every temperament now has a dominant, readable silhouette in motion. The
// aquarium should communicate personality before the player ever opens an
// inspector: curious shrimp fidget, hyper/greedy shrimp bolt, shy shrimp back
// away, lazy shrimp exhale bubbles, and lucky/bold shrimp show off with spins.
const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'wiggle', 'wiggle', 'wiggle', 'bubbles', 'reverse'],
  Hyper: ['dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'spin', 'wiggle'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'bubbles', 'wiggle'],
  Shy: ['reverse', 'reverse', 'reverse', 'reverse', 'reverse', 'reverse', 'bubbles', 'wiggle'],
  Greedy: ['dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'wiggle', 'bubbles'],
  Lucky: ['spin', 'spin', 'spin', 'spin', 'spin', 'bubbles', 'wiggle', 'dart'],
  Bold: ['spin', 'spin', 'spin', 'spin', 'dart', 'dart', 'dart', 'wiggle'],
  Diligent: ['wiggle', 'wiggle', 'bubbles', 'bubbles', 'reverse', 'wiggle', 'bubbles', 'reverse'],
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
 * generic pool. Dressed shrimp overwhelmingly show off their rare accessory,
 * while a smaller share of taps still exposes the underlying temperament.
 */
export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  if (hasAccessory) {
    // 32 accessory beats against 8 temperament beats = an 80% show-off chance.
    // Rare crowns/chains/visors/suits should read as special immediately rather
    // than requiring several taps before their bespoke sparkle reaction appears.
    for (let i = 0; i < 32; i += 1) pool.push('accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  // Stable per-shrimp variance prevents synchronized metronome motion. The
  // ranges are deliberately broad enough to make two shrimp of one temperament
  // feel related without tracing exactly the same path.
  const distanceVariation = 0.5 + (hashSeed(`${seed}-distance`) % 111) / 100;
  const cadenceVariation = 0.48 + (hashSeed(`${seed}-cadence`) % 116) / 100;
  const breathingVariation = 0.82 + (hashSeed(`${seed}-breathing`) % 37) / 100;
  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.94,
    Hyper: 0.72,
    Lazy: 1.38,
    Shy: 1.24,
    Greedy: 0.82,
    Lucky: 0.98,
    Bold: 0.78,
    Diligent: 1.14,
  };
  return {
    // Hyper/Bold patrol aggressively, Greedy shrimp chase activity, Curious
    // shrimp investigate a wider patch, while Lazy/Shy barely leave a perch.
    driftDistance: Math.max(2, Math.round(baseDrift * profile.driftMultiplier * distanceVariation)),
    // Cadence carries a temperament-specific beat as well as per-shrimp
    // variance. Quiet shrimp visibly hover while active traders move through
    // quicker vertical beats, even before the player taps them.
    bobDuration: Math.max(360, Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name])),
  };
}
