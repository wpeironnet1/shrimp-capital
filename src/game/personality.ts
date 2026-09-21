export type ShrimpPersonality = 'Curious' | 'Hyper' | 'Lazy' | 'Shy' | 'Greedy' | 'Lucky' | 'Bold' | 'Diligent' | 'Contrarian' | 'Quant' | 'Closer' | 'Social' | 'Rainmaker' | 'Auditor' | 'Intern' | 'Whale' | 'Market Maker' | 'Diamond Hands' | 'Paper Hands' | 'Shark';

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
  { name: 'Market Maker', tagline: 'ALWAYS WORKING BOTH SIDES', reactionBias: 'wiggle', driftMultiplier: 2.55, bobMultiplier: 1.7 },
  { name: 'Diamond Hands', tagline: 'REFUSES TO LEAVE THE POSITION', reactionBias: 'bubbles', driftMultiplier: 0.3, bobMultiplier: 0.38 },
  { name: 'Paper Hands', tagline: 'EXITS AT THE FIRST RIPPLE', reactionBias: 'reverse', driftMultiplier: 4.35, bobMultiplier: 3.0 },
  { name: 'Shark', tagline: 'CIRCLES EVERY NEW OPPORTUNITY', reactionBias: 'dart', driftMultiplier: 4.55, bobMultiplier: 2.45 },
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
  'Market Maker': ['wiggle','wiggle','wiggle','reverse','dart','reverse','dart','bubbles','spin','wiggle','reverse','dart'],
  'Diamond Hands': ['bubbles','bubbles','bubbles','bubbles','wiggle','wiggle','reverse','bubbles','spin','wiggle','bubbles','reverse'],
  'Paper Hands': ['reverse','reverse','reverse','reverse','dart','dart','dart','wiggle','bubbles','reverse','dart','spin'],
  Shark: ['dart','dart','dart','dart','spin','spin','wiggle','reverse','dart','bubbles','spin','dart'],
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
    Curious: 0.82, Hyper: 0.3, Lazy: 2.9, Shy: 2.2,
    Greedy: 0.5, Lucky: 0.96, Bold: 0.39, Diligent: 1.68,
    Contrarian: 0.68, Quant: 1.12, Closer: 0.44, Social: 0.62,
    Rainmaker: 0.46, Auditor: 2.0, Intern: 0.38, Whale: 1.42,
    'Market Maker': 0.67, 'Diamond Hands': 2.6, 'Paper Hands': 0.34, Shark: 0.39,
  };
  const personalityPatrol: Record<ShrimpPersonality, number> = {
    Curious: 1.34, Hyper: 2.15, Lazy: 0.18, Shy: 0.25,
    Greedy: 1.68, Lucky: 1.0, Bold: 1.86, Diligent: 0.48,
    Contrarian: 1.5, Quant: 0.82, Closer: 1.78, Social: 1.4,
    Rainmaker: 1.68, Auditor: 0.36, Intern: 1.84, Whale: 0.68,
    'Market Maker': 1.48, 'Diamond Hands': 0.2, 'Paper Hands': 2.08, Shark: 2.12,
  };
  const motionBand: Record<ShrimpPersonality, { minDrift: number; maxDrift: number; minBob: number; maxBob: number }> = {
    Curious: { minDrift: 28, maxDrift: 52, minBob: 600, maxBob: 1400 },
    Hyper: { minDrift: 72, maxDrift: 92, minBob: 160, maxBob: 400 },
    Lazy: { minDrift: 1, maxDrift: 5, minBob: 5000, maxBob: 8200 },
    Shy: { minDrift: 4, maxDrift: 10, minBob: 3600, maxBob: 6800 },
    Greedy: { minDrift: 48, maxDrift: 70, minBob: 320, maxBob: 700 },
    Lucky: { minDrift: 18, maxDrift: 38, minBob: 900, maxBob: 1900 },
    Bold: { minDrift: 58, maxDrift: 82, minBob: 240, maxBob: 580 },
    Diligent: { minDrift: 7, maxDrift: 17, minBob: 2300, maxBob: 4700 },
    Contrarian: { minDrift: 38, maxDrift: 62, minBob: 470, maxBob: 1100 },
    Quant: { minDrift: 14, maxDrift: 30, minBob: 1150, maxBob: 2400 },
    Closer: { minDrift: 54, maxDrift: 78, minBob: 270, maxBob: 650 },
    Social: { minDrift: 34, maxDrift: 58, minBob: 440, maxBob: 960 },
    Rainmaker: { minDrift: 50, maxDrift: 76, minBob: 280, maxBob: 700 },
    Auditor: { minDrift: 5, maxDrift: 14, minBob: 2900, maxBob: 5600 },
    Intern: { minDrift: 52, maxDrift: 80, minBob: 210, maxBob: 540 },
    Whale: { minDrift: 11, maxDrift: 25, minBob: 1650, maxBob: 3300 },
    'Market Maker': { minDrift: 36, maxDrift: 62, minBob: 500, maxBob: 1100 },
    'Diamond Hands': { minDrift: 1, maxDrift: 6, minBob: 4400, maxBob: 7600 },
    'Paper Hands': { minDrift: 65, maxDrift: 90, minBob: 180, maxBob: 470 },
    Shark: { minDrift: 68, maxDrift: 92, minBob: 210, maxBob: 540 },
  };

  const rawDrift = baseDrift * profile.driftMultiplier * distanceVariation * personalityPatrol[profile.name] * temperamentPulse;
  const softenedDrift = 98 * (rawDrift / (rawDrift + 36));
  const band = motionBand[profile.name];
  const driftDistance = Math.max(band.minDrift, Math.min(band.maxDrift, Math.round(softenedDrift)));
  const rawBobDuration = Math.round(((baseBobDuration / profile.bobMultiplier) / cadenceVariation) * breathingVariation * personalityCadence[profile.name] / temperamentPulse);
  const bobDuration = Math.max(band.minBob, Math.min(band.maxBob, rawBobDuration));
  return { driftDistance, bobDuration };
}
