import { AquariumLifeBeat, AquariumSocialPlan } from './aquariumLife';

export type SocialActorCue = {
  beat: AquariumLifeBeat;
  delayMs: number;
  emphasis: number;
  bubbleBurst: boolean;
  spotlight: boolean;
};

/**
 * Turns a tank-wide social plan into per-shrimp cues without persisted state.
 * Alternating lead/echo beats keeps a school from looking like duplicated sprites,
 * while a deterministic spotlight gives every spectacle one visual focal point.
 */
export function socialActorCue(
  plan: Pick<AquariumSocialPlan, 'leadBeat' | 'echoBeat' | 'staggerMs' | 'intensity' | 'fx'>,
  actorIndex: number,
  population: number,
): SocialActorCue {
  const safeIndex = Math.max(0, Math.floor(actorIndex));
  const safePopulation = Math.max(1, Math.floor(population));
  const spotlightIndex = safePopulation <= 2 ? 0 : Math.floor(safePopulation / 2);
  const spotlight = safeIndex === spotlightIndex;
  const beat = safeIndex % 3 === 1 ? plan.echoBeat : plan.leadBeat;
  const wave = safeIndex % 2 === 0 ? safeIndex / 2 : (safePopulation - safeIndex) / 2;

  return {
    beat,
    delayMs: Math.max(0, Math.round(wave * plan.staggerMs)),
    emphasis: Math.min(1.35, Math.max(0.7, plan.intensity * (spotlight ? 1.22 : 1))),
    bubbleBurst: plan.fx === 'bubbles' || (plan.fx === 'crumbs' && safeIndex % 3 === 0),
    spotlight,
  };
}

/**
 * Keeps social spectacles readable on a crowded phone tank. Only a bounded
 * number of visual shrimp participate even if the economic population is huge.
 */
export function socialParticipantCount(population: number, visualPopulation: number): number {
  const economic = Math.max(0, Math.floor(population));
  const visible = Math.max(0, Math.floor(visualPopulation));
  if (!economic || !visible) return 0;
  return Math.min(visible, economic, 12);
}
