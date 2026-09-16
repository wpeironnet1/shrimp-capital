import { personalityFor, personalityMotion, personalityReactionPool, ShrimpReaction } from './personality';

export type TankPersonalityBehavior = {
  label: string;
  tagline: string;
  driftDistance: number;
  bobDuration: number;
  reactions: ShrimpReaction[];
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
