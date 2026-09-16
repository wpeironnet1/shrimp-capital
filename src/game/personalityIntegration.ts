import { personalityFor, personalityMotion, personalityReactionPool, ShrimpReaction } from './personality';

export type TankPersonalityBehavior = {
  label: string;
  tagline: string;
  driftDistance: number;
  bobDuration: number;
  reactions: ShrimpReaction[];
};

export type ReactionPresentation = {
  duration: number;
  haptic: 'selection' | 'medium';
  flipsDirection: boolean;
};

const reactionPresentation: Record<ShrimpReaction, ReactionPresentation> = {
  dart: { duration: 680, haptic: 'selection', flipsDirection: true },
  spin: { duration: 840, haptic: 'medium', flipsDirection: true },
  bubbles: { duration: 720, haptic: 'selection', flipsDirection: false },
  wiggle: { duration: 760, haptic: 'selection', flipsDirection: false },
  reverse: { duration: 680, haptic: 'selection', flipsDirection: true },
  accessory: { duration: 900, haptic: 'medium', flipsDirection: false },
};

/**
 * Single adapter used by the aquarium UI so personality affects both ambient
 * motion and tap reactions without duplicating balancing rules in components.
 */
export function tankPersonalityBehavior(
  shrimpKey: string,
  hasAccessory: boolean,
  baseDrift: number,
  baseBobDuration: number,
): TankPersonalityBehavior {
  const profile = personalityFor(shrimpKey);
  const motion = personalityMotion(shrimpKey, baseDrift, baseBobDuration);
  return {
    label: profile.name,
    tagline: profile.tagline,
    driftDistance: motion.driftDistance,
    bobDuration: motion.bobDuration,
    reactions: personalityReactionPool(shrimpKey, hasAccessory),
  };
}

export function choosePersonalityReaction(behavior: TankPersonalityBehavior, random = Math.random): ShrimpReaction {
  const index = Math.min(behavior.reactions.length - 1, Math.floor(random() * behavior.reactions.length));
  return behavior.reactions[Math.max(0, index)];
}

export function presentationForReaction(reaction: ShrimpReaction): ReactionPresentation {
  return reactionPresentation[reaction];
}
