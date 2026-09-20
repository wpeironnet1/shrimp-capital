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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 2.15, bobMultiplier: 1.45 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 5.15, bobMultiplier: 3.55 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.22, bobMultiplier: 0.27 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.38, bobMultiplier: 0.44 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 3.45, bobMultiplier: 2.05 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.85, bobMultiplier: 1.55 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 4.05, bobMultiplier: 2.55 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.64, bobMultiplier: 0.68 },
];

const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle','wiggle','wiggle','wiggle','wiggle','wiggle','wiggle','bubbles','bubbles','reverse','dart','spin'],
  Hyper: ['dart','dart','dart','dart','dart','dart','dart','spin','spin','wiggle','reverse','bubbles'],
  Lazy: ['bubbles','bubbles','bubbles','bubbles','bubbles','bubbles','bubbles','wiggle','wiggle','reverse','spin','dart'],
  Shy: ['reverse','reverse','reverse','reverse','reverse','reverse','reverse','bubbles','bubbles','wiggle','dart','spin'],
  Greedy: ['dart','dart','dart','dart','dart','dart','dart','wiggle','wiggle','bubbles','spin','reverse'],
  Lucky: ['spin','spin','spin','spin','spin','spin','spin','bubbles','wiggle','dart','reverse','bubbles'],
  Bold: ['spin','spin','spin','spin','spin','spin','dart','dart','dart','dart','reverse','wiggle'],
  Diligent: ['wiggle','wiggle','wiggle','wiggle','bubbles','bubbles','bubbles','reverse','reverse','dart','spin','wiggle'],
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

export function secondaryReactionFor(seed: string): ShrimpReaction {
  const primary = signatureReactionFor(seed);
  const candidates = individualQuirks.filter(reaction => reaction !== primary);
  return candidates[hashSeed(`${seed}-secondary-quirk`) % candidates.length];
}

export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const signature = signatureReactionFor(seed);
  const secondary = secondaryReactionFor(seed);
  const pool = [...reactionPools[profile.name]];

  // Rare accessories are a 1-in-hundreds discovery, so taps should reliably
  // showcase their bespoke sparkle/pose instead of making the item feel cosmetic.
  // Personality gestures remain in the pool so accessorized shrimp still feel alive.
  if (hasAccessory) {
    pool.push(
      'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory',
      'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory',
      'accessory', 'accessory', 'accessory', 'accessory'
    );
  }

  // Stable signature gestures let players learn individual shrimp by tapping them.
  pool.push(signature, signature, signature, signature, signature, signature);
  pool.push(secondary, secondary, secondary);
  if (profile.reactionBias !== 'accessory') {
    pool.push(profile.reactionBias, profile.reactionBias, profile.reactionBias, profile.reactionBias);
  } else if (hasAccessory) {
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

/**
 * Stable individual cruising rhythm used directly by aquarium actors.
 * Bands intentionally do not overlap much: even without tapping, a player should
 * be able to spot the hyper trader, the shy wall-hugger and the lazy drifter.
 */
export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const distanceVariation = 0.72 + (hashSeed(`${seed}-distance`) % 57) / 100;
  const cadenceVariation = 0.76 + (hashSeed(`${seed}-cadence`) % 51) / 100;
  const breathingVariation = 0.82 + (hashSeed(`${seed}-breathing`) % 37) / 100;
  const temperamentPulse = 0.86 + (hashSeed(`${seed}-temperament`) % 29) / 100;

  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.82, Hyper: 0.34, Lazy: 2.65, Shy: 2.05,
    Greedy: 0.54, Lucky: 0.96, Bold: 0.43, Diligent: 1.58,
  };
  const personalityPatrol: Record<ShrimpPersonality, number> = {
    Curious: 1.28, Hyper: 1.9, Lazy: 0.24, Shy: 0.32,
    Greedy: 1.58, Lucky: 1.0, Bold: 1.72, Diligent: 0.54,
  };
  const motionBand: Record<ShrimpPersonality, { minDrift: number; maxDrift: number; minBob: number; maxBob: number }> = {
    Curious: { minDrift: 24, maxDrift: 48, minBob: 650, maxBob: 1500 },
    Hyper: { minDrift: 62, maxDrift: 88, minBob: 190, maxBob: 480 },
    Lazy: { minDrift: 2, maxDrift: 7, minBob: 4400, maxBob: 7600 },
    Shy: { minDrift: 5, maxDrift: 13, minBob: 3200, maxBob: 6200 },
    Greedy: { minDrift: 42, maxDrift: 66, minBob: 360, maxBob: 760 },
    Lucky: { minDrift: 18, maxDrift: 38, minBob: 900, maxBob: 1900 },
    Bold: { minDrift: 52, maxDrift: 76, minBob: 280, maxBob: 650 },
    Diligent: { minDrift: 9, maxDrift: 20, minBob: 2100, maxBob: 4400 },
  };

  const rawDrift = baseDrift * profile.driftMultiplier * distanceVariation * personalityPatrol[profile.name] * temperamentPulse;
  const softenedDrift = 94 * (rawDrift / (rawDrift + 38));
  const band = motionBand[profile.name];
  const driftDistance = Math.max(band.minDrift, Math.min(band.maxDrift, Math.round(softenedDrift)));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name] / temperamentPulse);
  const bobDuration = Math.max(band.minBob, Math.min(band.maxBob, rawBobDuration));
  return { driftDistance, bobDuration };
}
