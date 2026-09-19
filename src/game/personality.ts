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
  Curious: 7, Hyper: 5, Lazy: 4, Shy: 2, Greedy: 7, Lucky: 8, Bold: 9, Diligent: 11,
};

const individualQuirks: ShrimpReaction[] = ['wiggle', 'dart', 'bubbles', 'reverse', 'spin'];

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

export function signatureReactionFor(seed: string): ShrimpReaction {
  return individualQuirks[hashSeed(`${seed}-quirk`) % individualQuirks.length];
}

export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  const quirk = signatureReactionFor(seed);
  pool.push(quirk, quirk);
  if (hasAccessory) {
    const showoffWeight = accessoryShowoffWeight[profile.name];
    for (let i = 0; i < showoffWeight; i += 1) pool.push('accessory');
  }
  return pool;
}

/**
 * Produces a stable but visibly individual cruising rhythm. Personality sets the
 * broad temperament; three independent seed channels keep animals of the same
 * temperament from forming synchronized rows. The asymmetric slow/fast cadence
 * bands are intentional: a tank should read as a group of tiny animals rather
 * than twelve copies of one looping sprite.
 */
export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const distanceVariation = 0.48 + (hashSeed(`${seed}-distance`) % 143) / 100;
  const cadenceVariation = 0.46 + (hashSeed(`${seed}-cadence`) % 151) / 100;
  const breathingVariation = 0.72 + (hashSeed(`${seed}-breathing`) % 65) / 100;
  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.88,
    Hyper: 0.56,
    Lazy: 1.55,
    Shy: 1.38,
    Greedy: 0.7,
    Lucky: 0.94,
    Bold: 0.62,
    Diligent: 1.18,
  };
  const rawDrift = Math.round(baseDrift * profile.driftMultiplier * distanceVariation);
  const driftDistance = Math.max(6, Math.min(58, rawDrift));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name]);
  return {
    driftDistance,
    bobDuration: Math.max(290, Math.min(4900, rawBobDuration)),
  };
}
