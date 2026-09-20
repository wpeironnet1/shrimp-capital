export type ShrimpPersonality = 'Curious' | 'Hyper' | 'Lazy' | 'Shy' | 'Greedy' | 'Lucky' | 'Bold' | 'Diligent' | 'Contrarian' | 'Quant' | 'Closer' | 'Social' | 'Rainmaker' | 'Auditor' | 'Intern' | 'Whale';

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
  { name: 'Contrarian', tagline: 'SWIMS AGAINST CONSENSUS', reactionBias: 'reverse', driftMultiplier: 2.7, bobMultiplier: 1.7 },
  { name: 'Quant', tagline: 'MODELS EVERY BUBBLE', reactionBias: 'wiggle', driftMultiplier: 1.35, bobMultiplier: 1.15 },
  { name: 'Closer', tagline: 'ALWAYS HITS THE CLOSING BELL', reactionBias: 'dart', driftMultiplier: 3.7, bobMultiplier: 2.35 },
  { name: 'Social', tagline: 'WORKS THE WHOLE ROOM', reactionBias: 'bubbles', driftMultiplier: 2.35, bobMultiplier: 1.85 },
  { name: 'Rainmaker', tagline: 'TURNS EVERY SPLASH INTO A DEAL', reactionBias: 'spin', driftMultiplier: 3.35, bobMultiplier: 2.15 },
  { name: 'Auditor', tagline: 'COUNTS EVERY PELLET TWICE', reactionBias: 'reverse', driftMultiplier: 0.52, bobMultiplier: 0.58 },
  { name: 'Intern', tagline: 'VOLUNTEERS FOR EVERY BUBBLE', reactionBias: 'wiggle', driftMultiplier: 3.05, bobMultiplier: 2.7 },
  { name: 'Whale', tagline: 'MOVES THE WHOLE TANK', reactionBias: 'bubbles', driftMultiplier: 1.05, bobMultiplier: 0.82 },
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
  Contrarian: ['reverse','reverse','reverse','reverse','reverse','spin','spin','wiggle','dart','bubbles','reverse','spin'],
  Quant: ['wiggle','wiggle','wiggle','wiggle','bubbles','bubbles','reverse','reverse','spin','dart','wiggle','bubbles'],
  Closer: ['dart','dart','dart','dart','dart','spin','spin','spin','wiggle','reverse','dart','bubbles'],
  Social: ['bubbles','bubbles','bubbles','bubbles','wiggle','wiggle','spin','spin','dart','reverse','bubbles','wiggle'],
  Rainmaker: ['spin','spin','spin','dart','dart','dart','bubbles','bubbles','wiggle','reverse','spin','dart'],
  Auditor: ['reverse','reverse','wiggle','wiggle','wiggle','bubbles','bubbles','reverse','wiggle','spin','dart','reverse'],
  Intern: ['wiggle','wiggle','wiggle','dart','dart','dart','bubbles','bubbles','spin','reverse','wiggle','dart'],
  Whale: ['bubbles','bubbles','bubbles','bubbles','spin','spin','wiggle','reverse','bubbles','spin','dart','bubbles'],
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
  if (hasAccessory) {
    pool.push(
      'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory',
      'accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory',
      'accessory', 'accessory', 'accessory', 'accessory'
    );
  }
  pool.push(signature, signature, signature, signature, signature, signature);
  pool.push(secondary, secondary, secondary);
  if (profile.reactionBias !== 'accessory') {
    pool.push(profile.reactionBias, profile.reactionBias, profile.reactionBias, profile.reactionBias);
  } else if (hasAccessory) {
    pool.push('accessory', 'accessory', 'accessory', 'accessory', 'accessory', 'accessory');
  }
  return pool;
}

/** Stable individual cruising rhythm used directly by aquarium actors. */
export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  const distanceVariation = 0.72 + (hashSeed(`${seed}-distance`) % 57) / 100;
  const cadenceVariation = 0.76 + (hashSeed(`${seed}-cadence`) % 51) / 100;
  const breathingVariation = 0.82 + (hashSeed(`${seed}-breathing`) % 37) / 100;
  const temperamentPulse = 0.86 + (hashSeed(`${seed}-temperament`) % 29) / 100;

  const personalityCadence: Record<ShrimpPersonality, number> = {
    Curious: 0.82, Hyper: 0.34, Lazy: 2.65, Shy: 2.05,
    Greedy: 0.54, Lucky: 0.96, Bold: 0.43, Diligent: 1.58,
    Contrarian: 0.72, Quant: 1.12, Closer: 0.48, Social: 0.67,
    Rainmaker: 0.5, Auditor: 1.9, Intern: 0.42, Whale: 1.35,
  };
  const personalityPatrol: Record<ShrimpPersonality, number> = {
    Curious: 1.28, Hyper: 1.9, Lazy: 0.24, Shy: 0.32,
    Greedy: 1.58, Lucky: 1.0, Bold: 1.72, Diligent: 0.54,
    Contrarian: 1.42, Quant: 0.82, Closer: 1.65, Social: 1.3,
    Rainmaker: 1.55, Auditor: 0.42, Intern: 1.68, Whale: 0.72,
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
    Contrarian: { minDrift: 34, maxDrift: 58, minBob: 520, maxBob: 1200 },
    Quant: { minDrift: 14, maxDrift: 30, minBob: 1150, maxBob: 2400 },
    Closer: { minDrift: 48, maxDrift: 72, minBob: 320, maxBob: 720 },
    Social: { minDrift: 30, maxDrift: 54, minBob: 500, maxBob: 1050 },
    Rainmaker: { minDrift: 44, maxDrift: 70, minBob: 330, maxBob: 780 },
    Auditor: { minDrift: 7, maxDrift: 17, minBob: 2600, maxBob: 5200 },
    Intern: { minDrift: 46, maxDrift: 74, minBob: 250, maxBob: 610 },
    Whale: { minDrift: 13, maxDrift: 29, minBob: 1500, maxBob: 3100 },
  };

  const rawDrift = baseDrift * profile.driftMultiplier * distanceVariation * personalityPatrol[profile.name] * temperamentPulse;
  const softenedDrift = 94 * (rawDrift / (rawDrift + 38));
  const band = motionBand[profile.name];
  const driftDistance = Math.max(band.minDrift, Math.min(band.maxDrift, Math.round(softenedDrift)));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name] / temperamentPulse);
  const bobDuration = Math.max(band.minBob, Math.min(band.maxBob, rawBobDuration));
  return { driftDistance, bobDuration };
}
