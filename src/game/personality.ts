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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 1.9, bobMultiplier: 1.35 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 4.4, bobMultiplier: 3.15 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.3, bobMultiplier: 0.34 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.46, bobMultiplier: 0.52 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 3.0, bobMultiplier: 1.9 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.7, bobMultiplier: 1.48 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 3.55, bobMultiplier: 2.35 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.72, bobMultiplier: 0.74 },
];

const reactionPools: Record<ShrimpPersonality, ShrimpReaction[]> = {
  Curious: ['wiggle','wiggle','wiggle','wiggle','wiggle','bubbles','bubbles','reverse','dart','spin'],
  Hyper: ['dart','dart','dart','dart','dart','spin','spin','wiggle','reverse','bubbles'],
  Lazy: ['bubbles','bubbles','bubbles','bubbles','bubbles','wiggle','wiggle','reverse','spin','dart'],
  Shy: ['reverse','reverse','reverse','reverse','reverse','bubbles','bubbles','wiggle','dart','spin'],
  Greedy: ['dart','dart','dart','dart','wiggle','wiggle','bubbles','spin','reverse','dart'],
  Lucky: ['spin','spin','spin','spin','spin','bubbles','wiggle','dart','reverse','bubbles'],
  Bold: ['spin','spin','spin','spin','dart','dart','dart','reverse','wiggle','bubbles'],
  Diligent: ['wiggle','wiggle','wiggle','bubbles','bubbles','reverse','reverse','dart','spin','bubbles'],
};

// Accessories are intentionally extremely rare, so a player who finds one should
// see its bespoke show-off animation often enough to understand that it is special.
// Personality still matters: shy shrimp show off less; bold/accountant shrimp more.
const accessoryShowoffWeight: Record<ShrimpPersonality, number> = {
  Curious: 30,
  Hyper: 28,
  Lazy: 24,
  Shy: 20,
  Greedy: 34,
  Lucky: 40,
  Bold: 46,
  Diligent: 50,
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

/**
 * A second stable quirk makes two shrimp with the same broad personality still
 * feel like different little actors. It is deliberately forced to differ from
 * the primary signature so taps do not collapse into a one-animation gimmick.
 */
export function secondaryReactionFor(seed: string): ShrimpReaction {
  const primary = signatureReactionFor(seed);
  const candidates = individualQuirks.filter(reaction => reaction !== primary);
  return candidates[hashSeed(`${seed}-secondary-quirk`) % candidates.length];
}

export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool = [...reactionPools[profile.name]];
  const signature = signatureReactionFor(seed);
  const secondary = secondaryReactionFor(seed);

  // Weight both individual quirks heavily enough that players can learn a
  // particular shrimp's habits, while its broader personality remains obvious.
  pool.push(signature, signature, signature, signature, secondary, secondary, secondary);

  if (hasAccessory) {
    const showoffWeight = accessoryShowoffWeight[profile.name];
    for (let i = 0; i < showoffWeight; i += 1) pool.push('accessory');
  }
  return pool;
}

/** Stable individual cruising rhythm used directly by the aquarium actors. */
export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const distanceVariation = 0.48 + (hashSeed(`${seed}-distance`) % 143) / 100;
  const cadenceVariation = 0.46 + (hashSeed(`${seed}-cadence`) % 151) / 100;
  const breathingVariation = 0.72 + (hashSeed(`${seed}-breathing`) % 65) / 100;
  const patrolVariation = 0.72 + (hashSeed(`${seed}-patrol`) % 73) / 100;
  const restBeat = 0.88 + (hashSeed(`${seed}-rest`) % 43) / 100;
  const temperamentPulse = 0.74 + (hashSeed(`${seed}-temperament`) % 63) / 100;
  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.82,
    Hyper: 0.48,
    Lazy: 1.82,
    Shy: 1.55,
    Greedy: 0.64,
    Lucky: 0.9,
    Bold: 0.54,
    Diligent: 1.32,
  };
  const personalityPatrol: Record<ShrimpPersonality, number> = {
    Curious: 1.26,
    Hyper: 1.52,
    Lazy: 0.48,
    Shy: 0.52,
    Greedy: 1.42,
    Lucky: 1.02,
    Bold: 1.58,
    Diligent: 0.7,
  };
  const motionBand: Record<ShrimpPersonality, { minDrift: number; maxDrift: number; minBob: number; maxBob: number }> = {
    Curious: { minDrift: 18, maxDrift: 48, minBob: 560, maxBob: 1800 },
    Hyper: { minDrift: 46, maxDrift: 76, minBob: 240, maxBob: 720 },
    Lazy: { minDrift: 4, maxDrift: 13, minBob: 2800, maxBob: 6200 },
    Shy: { minDrift: 6, maxDrift: 19, minBob: 2100, maxBob: 5200 },
    Greedy: { minDrift: 34, maxDrift: 67, minBob: 380, maxBob: 1050 },
    Lucky: { minDrift: 20, maxDrift: 48, minBob: 700, maxBob: 1900 },
    Bold: { minDrift: 42, maxDrift: 72, minBob: 300, maxBob: 880 },
    Diligent: { minDrift: 9, maxDrift: 27, minBob: 1500, maxBob: 3900 },
  };
  const rawDrift = baseDrift * profile.driftMultiplier * distanceVariation * patrolVariation * personalityPatrol[profile.name] * temperamentPulse;
  const softenedDrift = 86 * (rawDrift / (rawDrift + 40));
  const band = motionBand[profile.name];
  const driftDistance = Math.max(band.minDrift, Math.min(band.maxDrift, Math.round(softenedDrift)));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name] * restBeat / temperamentPulse);
  const bobDuration = Math.max(band.minBob, Math.min(band.maxBob, rawBobDuration));
  return { driftDistance, bobDuration };
}
