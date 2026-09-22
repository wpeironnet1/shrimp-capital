import { AquariumHabitatTarget, AquariumLifePlan } from './aquariumLife';

export type HabitatMotionTarget = {
  x: number;
  y: number;
  travelScale: number;
  settleScale: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Converts a shrimp's semantic life beat into a stable tank-space destination.
 * Coordinates are normalized so the renderer can scale them to any phone or web tank.
 * The small deterministic jitter prevents a school from stacking into one sprite.
 */
export function habitatMotionTarget(
  habitat: AquariumHabitatTarget,
  seedUnit: number,
  plan: Pick<AquariumLifePlan, 'travelScale' | 'settleScale' | 'verticalBias'>,
): HabitatMotionTarget {
  const jitter = clamp(seedUnit, 0, 1) - 0.5;
  const x = 0.5 + jitter * 0.56;

  const baseY: Record<AquariumHabitatTarget, number> = {
    'open-water': 0.48,
    substrate: 0.82,
    plants: 0.69,
    equipment: 0.58,
    surface: 0.16,
    school: 0.46,
  };

  const horizontalBias: Record<AquariumHabitatTarget, number> = {
    'open-water': 0,
    substrate: 0,
    plants: jitter < 0 ? -0.18 : 0.18,
    equipment: 0.22,
    surface: 0,
    school: jitter * 0.22,
  };

  return {
    x: clamp(x + horizontalBias[habitat], 0.08, 0.92),
    y: clamp(baseY[habitat] + plan.verticalBias * 0.09 + jitter * 0.045, 0.1, 0.88),
    travelScale: clamp(plan.travelScale, 0.6, 1.55),
    settleScale: clamp(plan.settleScale, 0.82, 1.08),
  };
}

/** Deterministic 0..1 value suitable for spacing visual shrimp without persisted state. */
export function habitatSeedUnit(seed: string, cycle = 0): number {
  let hash = 2166136261;
  const value = `${seed}:${cycle}`;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}
