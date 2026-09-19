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
  Curious: ['wiggle','wiggle','wiggle','wiggle','wiggle','bubbles','bubbles','reverse','dart','spin'],
  Hyper: ['dart','dart','dart','dart','dart','spin','spin','wiggle','reverse','bubbles'],
  Lazy: ['bubbles','bubbles','bubbles','bubbles','bubbles','wiggle','wiggle','reverse','spin','dart'],
  Shy: ['reverse','reverse','reverse','reverse','reverse','bubbles','bubbles','wiggle','dart','spin'],
  Greedy: ['dart','dart','dart','dart','wiggle','wiggle','bubbles','spin','reverse','dart'],
  Lucky: ['spin','spin','spin','spin','spin','bubbles','wiggle','dart','reverse','bubbles'],
  Bold: ['spin','spin','spin','spin','dart','dart','dart','reverse','wiggle','bubbles'],
  Diligent: ['wiggle','wiggle','wiggle','bubbles','bubbles','reverse','reverse','dart','spin','bubbles'],
};

const accessoryShowoffWeight: Record<ShrimpPersonality, number> = {
  Curious: 12, Hyper: 10, Lazy: 8, Shy: 6, Greedy: 13, Lucky: 16, Bold: 18, Diligent: 20,
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
  pool.push(quirk, quirk, quirk);
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
  // Some animals naturally make a long patrol while others hover close to their
  // preferred patch. This extra independent channel breaks up uniform tank rows.
  const patrolVariation = 0.72 + (hashSeed(`${seed}-patrol`) % 73) / 100;
  // A slower breathing beat creates visible hover/rest moments without another
  // timer or persistent state. Lazy/Shy/Diligent animals receive longer beats.
  const restBeat = 0.88 + (hashSeed(`${seed}-rest`) % 43) / 100;
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
  const personalityPatrol: Record<ShrimpPersonality, number> = {
    Curious: 1.18,
    Hyper: 1.34,
    Lazy: 0.7,
    Shy: 0.62,
    Greedy: 1.28,
    Lucky: 1.0,
    Bold: 1.4,
    Diligent: 0.82,
  };
  const rawDrift = Math.round(baseDrift * profile.driftMultiplier * distanceVariation * patrolVariation * personalityPatrol[profile.name]);
  const driftDistance = Math.max(5, Math.min(64, rawDrift));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name] * restBeat);
  return {
    driftDistance,
    bobDuration: Math.max(270, Math.min(5400, rawBobDuration)),
  };
}
