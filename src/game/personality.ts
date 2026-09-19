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
  // Quiet temperaments still need to read as living animals. Earlier values
  // collapsed Lazy/Shy actors onto the 2px safety floor, which made them look
  // like static decorations on a phone. They now cruise gently while retaining
  // a very obvious contrast with Hyper/Bold shrimp.
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.38, bobMultiplier: 0.42 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.52, bobMultiplier: 0.58 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 2.4, bobMultiplier: 1.58 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.48, bobMultiplier: 1.32 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 2.8, bobMultiplier: 1.9 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.72, bobMultiplier: 0.78 },
];

const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle', 'wiggle', 'wiggle', 'wiggle', 'bubbles', 'reverse', 'dart', 'spin'],
  Hyper: ['dart', 'dart', 'dart', 'dart', 'spin', 'wiggle', 'reverse', 'bubbles'],
  Lazy: ['bubbles', 'bubbles', 'bubbles', 'bubbles', 'wiggle', 'reverse', 'spin', 'dart'],
  Shy: ['reverse', 'reverse', 'reverse', 'reverse', 'bubbles', 'wiggle', 'dart', 'spin'],
  Greedy: ['dart', 'dart', 'dart', 'dart', 'wiggle', 'bubbles', 'spin', 'reverse'],
  Lucky: ['spin', 'spin', 'spin', 'spin', 'bubbles', 'wiggle', 'dart', 'reverse'],
  Bold: ['spin', 'spin', 'spin', 'dart', 'dart', 'reverse', 'wiggle', 'bubbles'],
  Diligent: ['wiggle', 'wiggle', 'bubbles', 'bubbles', 'reverse', 'dart', 'spin', 'wiggle'],
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
    for (let i = 0; i < 32; i += 1) pool.push('accessory');
  }
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const distanceVariation = 0.5 + (hashSeed(`${seed}-distance`) % 111) / 100;
  const cadenceVariation = 0.48 + (hashSeed(`${seed}-cadence`) % 116) / 100;
  const breathingVariation = 0.82 + (hashSeed(`${seed}-breathing`) % 37) / 100;
  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.94,
    Hyper: 0.72,
    Lazy: 1.28,
    Shy: 1.18,
    Greedy: 0.82,
    Lucky: 0.98,
    Bold: 0.78,
    Diligent: 1.08,
  };
  const rawDrift = Math.round(baseDrift * profile.driftMultiplier * distanceVariation);
  // Six pixels is enough to be legible as swimming on a narrow phone while the
  // 46px ceiling keeps energetic personalities safely behind the glass.
  const driftDistance = Math.max(6, Math.min(46, rawDrift));
  return {
    driftDistance,
    bobDuration: Math.max(360, Math.min(4200, Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name]))),
  };
}
