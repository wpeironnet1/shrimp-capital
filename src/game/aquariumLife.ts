import { ShrimpPersonality, personalityFor } from './personality';

export type AquariumLifeBeat = 'cruise' | 'forage' | 'rest' | 'inspect' | 'hide' | 'chase' | 'surface' | 'school' | 'bubble-trail';

export type AquariumLifePlan = {
  primary: AquariumLifeBeat;
  secondary: AquariumLifeBeat;
  pauseMs: number;
  verticalBias: number;
  speedMultiplier: number;
  travelScale: number;
};

const lifePools: Record<ShrimpPersonality, AquariumLifeBeat[]> = {
  Curious: ['inspect', 'inspect', 'forage', 'surface', 'cruise', 'school', 'bubble-trail'],
  Hyper: ['chase', 'chase', 'surface', 'cruise', 'school', 'forage', 'bubble-trail'],
  Lazy: ['rest', 'rest', 'rest', 'forage', 'hide', 'cruise', 'bubble-trail'],
  Shy: ['hide', 'hide', 'rest', 'school', 'forage', 'cruise', 'bubble-trail'],
  Greedy: ['forage', 'forage', 'forage', 'chase', 'surface', 'cruise', 'school'],
  Lucky: ['school', 'surface', 'inspect', 'cruise', 'forage', 'rest', 'bubble-trail'],
  Bold: ['chase', 'surface', 'inspect', 'school', 'cruise', 'forage', 'bubble-trail'],
  Diligent: ['forage', 'inspect', 'school', 'cruise', 'rest', 'forage', 'bubble-trail'],
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
  'bubble-trail': .78,
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
  'bubble-trail': -.38,
};

/**
 * Deterministic idle-life planning keeps the tank lively without saving
 * ephemeral animation state. Each shrimp gets recognizable habits from its
 * personality while the cycle seed changes the beat over time.
 */
export function aquariumLifePlan(seed: string, cycle = 0): AquariumLifePlan {
  const personality = personalityFor(seed).name;
  const pool = lifePools[personality];
  const safeCycle = Math.max(0, Math.floor(cycle));
  const a = hash(`${seed}:life:${safeCycle}`);
  const b = hash(`${seed}:life:${safeCycle}:next`);
  const primary = pool[a % pool.length];
  let secondary = pool[b % pool.length];
  if (secondary === primary) secondary = pool[(pool.indexOf(primary) + 1) % pool.length];
  const pauseBase = primary === 'rest' ? 2600 : primary === 'hide' ? 1800 : primary === 'inspect' ? 1100 : 650;
  return {
    primary,
    secondary,
    pauseMs: pauseBase + (hash(`${seed}:pause:${safeCycle}`) % 1500),
    verticalBias: verticalByBeat[primary],
    speedMultiplier: speedByBeat[primary],
    travelScale: .72 + ((a >>> 8) % 74) / 100,
  };
}

export function aquariumLifePoolFor(seed: string): readonly AquariumLifeBeat[] {
  return lifePools[personalityFor(seed).name];
}

export function aquariumLifeLabel(beat: AquariumLifeBeat) {
  const labels: Record<AquariumLifeBeat, string> = {
    cruise: 'CRUISING THE DESK',
    forage: 'HUNTING FOR ALPHA',
    rest: 'MARKET CLOSED',
    inspect: 'AUDITING THE TANK',
    hide: 'IN A DARK POOL',
    chase: 'CHASING MOMENTUM',
    surface: 'CHECKING THE TICKER',
    school: 'TEAM MEETING',
    'bubble-trail': 'BLOWING LIQUIDITY',
  };
  return labels[beat];
}
