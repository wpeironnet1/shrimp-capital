import { ShrimpPersonality, personalityFor } from './personality';

export type AquariumLifeBeat = 'cruise' | 'forage' | 'rest' | 'inspect' | 'hide' | 'chase' | 'surface' | 'school';

export type AquariumLifePlan = {
  primary: AquariumLifeBeat;
  secondary: AquariumLifeBeat;
  pauseMs: number;
  verticalBias: number;
  speedMultiplier: number;
};

const lifePools: Record<ShrimpPersonality, AquariumLifeBeat[]> = {
  Curious: ['inspect', 'inspect', 'forage', 'surface', 'cruise', 'school'],
  Hyper: ['chase', 'chase', 'surface', 'cruise', 'school', 'forage'],
  Lazy: ['rest', 'rest', 'rest', 'forage', 'hide', 'cruise'],
  Shy: ['hide', 'hide', 'rest', 'school', 'forage', 'cruise'],
  Greedy: ['forage', 'forage', 'forage', 'chase', 'surface', 'cruise'],
  Lucky: ['school', 'surface', 'inspect', 'cruise', 'forage', 'rest'],
  Bold: ['chase', 'surface', 'inspect', 'school', 'cruise', 'forage'],
  Diligent: ['forage', 'inspect', 'school', 'cruise', 'rest', 'forage'],
};

function hash(seed: string) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

const speedByBeat: Record<AquariumLifeBeat, number> = {
  cruise: 1,
  forage: .72,
  rest: .22,
  inspect: .58,
  hide: .48,
  chase: 1.55,
  surface: 1.2,
  school: .92,
};

const verticalByBeat: Record<AquariumLifeBeat, number> = {
  cruise: 0,
  forage: .72,
  rest: .88,
  inspect: .18,
  hide: .55,
  chase: -.08,
  surface: -.9,
  school: -.2,
};

/**
 * Deterministic idle-life planning keeps the tank lively without saving
 * ephemeral animation state. Each shrimp gets recognizable habits from its
 * personality while the cycle seed changes the beat over time.
 */
export function aquariumLifePlan(seed: string, cycle = 0): AquariumLifePlan {
  const personality = personalityFor(seed).name;
  const pool = lifePools[personality];
  const a = hash(`${seed}:life:${cycle}`);
  const b = hash(`${seed}:life:${cycle}:next`);
  const primary = pool[a % pool.length];
  let secondary = pool[b % pool.length];
  if (secondary === primary) secondary = pool[(b + 1) % pool.length];
  const pauseBase = primary === 'rest' ? 2600 : primary === 'hide' ? 1800 : 650;
  return {
    primary,
    secondary,
    pauseMs: pauseBase + (hash(`${seed}:pause:${cycle}`) % 1500),
    verticalBias: verticalByBeat[primary],
    speedMultiplier: speedByBeat[primary],
  };
}

export function aquariumLifePoolFor(seed: string): readonly AquariumLifeBeat[] {
  return lifePools[personalityFor(seed).name];
}
