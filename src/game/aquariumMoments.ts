import { ShrimpReaction } from './personality';

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

/**
 * Stable choreography selection for ambient aquarium spectacle. Keeping this
 * deterministic makes rare moments testable and prevents save/reload from
 * changing the event presentation mid-session.
 */
export function aquariumMomentFor(seed: string): AquariumMoment {
  return moments[hashSeed(seed) % moments.length];
}

/** Staggers a school so the tank reads as a wave instead of twelve identical sprites. */
export function aquariumMomentDelay(moment: AquariumMoment, actorIndex: number) {
  return Math.max(0, actorIndex) * moment.staggerMs;
}

export function allAquariumMoments(): readonly AquariumMoment[] {
  return moments;
}
