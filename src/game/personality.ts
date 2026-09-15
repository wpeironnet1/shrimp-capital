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
  { name: 'Curious', tagline: 'INSPECTS EVERYTHING TWICE', reactionBias: 'wiggle', driftMultiplier: 0.9, bobMultiplier: 1.05 },
  { name: 'Hyper', tagline: 'NEVER OFF THE TRADING FLOOR', reactionBias: 'dart', driftMultiplier: 1.35, bobMultiplier: 1.25 },
  { name: 'Lazy', tagline: 'DELEGATES MOST SWIMMING', reactionBias: 'bubbles', driftMultiplier: 0.62, bobMultiplier: 0.72 },
  { name: 'Shy', tagline: 'PREFERS DARK POOLS OF LIQUIDITY', reactionBias: 'reverse', driftMultiplier: 0.78, bobMultiplier: 0.88 },
  { name: 'Greedy', tagline: 'ALWAYS CHASING THE NEXT PELLET', reactionBias: 'dart', driftMultiplier: 1.12, bobMultiplier: 1.05 },
  { name: 'Lucky', tagline: 'SOMEHOW ALWAYS BUYS THE DIP', reactionBias: 'spin', driftMultiplier: 1.0, bobMultiplier: 1.0 },
  { name: 'Bold', tagline: 'TREATS EVERY RIPPLE LIKE A TAKEOVER', reactionBias: 'spin', driftMultiplier: 1.18, bobMultiplier: 1.12 },
  { name: 'Diligent', tagline: 'HAS NEVER MISSED A QUARTERLY FILING', reactionBias: 'accessory', driftMultiplier: 0.94, bobMultiplier: 0.96 },
];

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

export function personalityReactionPool(seed: string, hasAccessory: boolean): ShrimpReaction[] {
  const profile = personalityFor(seed);
  const pool: ShrimpReaction[] = ['dart', 'spin', 'bubbles', 'wiggle', 'reverse', profile.reactionBias, profile.reactionBias];
  if (hasAccessory) pool.push('accessory', 'accessory');
  return pool;
}

export function personalityMotion(seed: string, baseDrift: number, baseBobDuration: number) {
  const profile = personalityFor(seed);
  return {
    driftDistance: Math.max(5, Math.round(baseDrift * profile.driftMultiplier)),
    bobDuration: Math.max(650, Math.round(baseBobDuration / profile.bobMultiplier)),
  };
}
