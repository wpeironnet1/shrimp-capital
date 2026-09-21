import { ShrimpReaction, personalityFor, signatureReactionFor } from './personality';

export type AquariumMomentKind = 'opening-bell' | 'feeding-frenzy' | 'flash-crash' | 'bonus-bubble' | 'closing-bell';

export type AquariumMoment = {
  kind: AquariumMomentKind;
  label: string;
  reaction: ShrimpReaction;
  staggerMs: number;
  durationMs: number;
  haptic: 'light' | 'success' | 'warning';
  particle: 'ticker' | 'pellets' | 'bubbles' | 'splash';
};

export type AquariumMomentCue = {
  delayMs: number;
  reaction: ShrimpReaction;
  intensity: 'soft' | 'strong';
};

const moments: AquariumMoment[] = [
  { kind: 'opening-bell', label: 'OPENING BELL', reaction: 'dart', staggerMs: 55, durationMs: 1450, haptic: 'success', particle: 'ticker' },
  { kind: 'feeding-frenzy', label: 'FEEDING FRENZY', reaction: 'wiggle', staggerMs: 42, durationMs: 1750, haptic: 'light', particle: 'pellets' },
  { kind: 'flash-crash', label: 'FLASH CRASH', reaction: 'reverse', staggerMs: 34, durationMs: 1250, haptic: 'warning', particle: 'splash' },
  { kind: 'bonus-bubble', label: 'BONUS BUBBLE', reaction: 'bubbles', staggerMs: 70, durationMs: 1900, haptic: 'success', particle: 'bubbles' },
  { kind: 'closing-bell', label: 'CLOSING BELL', reaction: 'spin', staggerMs: 62, durationMs: 1550, haptic: 'success', particle: 'ticker' },
];

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Stable choreography selection for ambient aquarium spectacle. */
export function aquariumMomentFor(seed: string): AquariumMoment {
  return moments[hashSeed(seed) % moments.length];
}

/**
 * Gives every shrimp a readable role inside a tank-wide spectacle instead of
 * making the school fire the exact same animation at once. Temperament changes
 * timing, while rare wardrobe gets a strong spotlight reaction.
 */
export function aquariumMomentCue(moment: AquariumMoment, shrimpSeed: string, actorIndex: number, hasAccessory = false): AquariumMomentCue {
  const profile = personalityFor(shrimpSeed);
  const jitter = hashSeed(`${moment.kind}-${shrimpSeed}`) % 85;
  const temperamentDelay = profile.name === 'Lazy' || profile.name === 'Diamond Hands'
    ? 250
    : profile.name === 'Hyper' || profile.name === 'Intern'
      ? 0
      : 80;

  let reaction = moment.reaction;
  if (moment.kind === 'opening-bell' && actorIndex % 3 === 0) reaction = signatureReactionFor(shrimpSeed);
  if (moment.kind === 'feeding-frenzy' && actorIndex % 4 !== 0) reaction = 'dart';
  if (moment.kind === 'flash-crash' && actorIndex % 2 !== 0) reaction = 'dart';
  if (moment.kind === 'bonus-bubble' && actorIndex % 3 === 0) reaction = 'spin';
  if (moment.kind === 'closing-bell' && actorIndex % 2 !== 0) reaction = signatureReactionFor(shrimpSeed);

  if (hasAccessory && hashSeed(`${shrimpSeed}-${moment.kind}-spotlight`) % 2 === 0) reaction = 'accessory';

  return {
    delayMs: Math.max(0, actorIndex) * moment.staggerMs + temperamentDelay + jitter,
    reaction,
    intensity: hasAccessory || moment.kind === 'flash-crash' ? 'strong' : 'soft',
  };
}

/** Staggers a school so the tank reads as a wave instead of twelve identical sprites. */
export function aquariumMomentDelay(moment: AquariumMoment, actorIndex: number) {
  return Math.max(0, actorIndex) * moment.staggerMs;
}

export function allAquariumMoments(): readonly AquariumMoment[] {
  return moments;
}
