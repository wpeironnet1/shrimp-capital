import { ShrimpPersonality, personalityFor } from './personality';

export type AquariumLifeBeat = 'cruise' | 'forage' | 'rest' | 'inspect' | 'hide' | 'chase' | 'surface' | 'school' | 'bubble-trail';
export type AquariumHabitatTarget = 'open-water' | 'substrate' | 'plants' | 'equipment' | 'surface' | 'school';

export type AquariumLifePlan = {
  primary: AquariumLifeBeat;
  secondary: AquariumLifeBeat;
  pauseMs: number;
  verticalBias: number;
  speedMultiplier: number;
  travelScale: number;
  habitatTarget: AquariumHabitatTarget;
  settleScale: number;
};

export type AquariumSocialMoment = 'opening-bell' | 'feeding-rush' | 'bubble-rally' | 'closing-bell' | 'quiet-market';
export type AquariumSocialFx = 'bell' | 'crumbs' | 'bubbles' | 'ticker' | 'glimmer';

export type AquariumSocialPlan = {
  moment: AquariumSocialMoment;
  leadBeat: AquariumLifeBeat;
  echoBeat: AquariumLifeBeat;
  staggerMs: number;
  durationMs: number;
  intensity: number;
  label: string;
  fx: AquariumSocialFx;
  haptic: 'light' | 'success' | 'none';
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
  Contrarian: ['cruise', 'hide', 'surface', 'inspect', 'cruise', 'rest', 'bubble-trail'],
  Quant: ['inspect', 'inspect', 'rest', 'forage', 'cruise', 'bubble-trail', 'school'],
  Closer: ['chase', 'surface', 'chase', 'school', 'cruise', 'forage', 'bubble-trail'],
  Social: ['school', 'school', 'cruise', 'inspect', 'surface', 'forage', 'bubble-trail'],
  Rainmaker: ['chase', 'school', 'surface', 'inspect', 'cruise', 'forage', 'bubble-trail'],
  Auditor: ['inspect', 'inspect', 'rest', 'forage', 'hide', 'cruise', 'bubble-trail'],
  Intern: ['chase', 'forage', 'school', 'surface', 'inspect', 'cruise', 'bubble-trail'],
  Whale: ['cruise', 'cruise', 'rest', 'surface', 'school', 'forage', 'bubble-trail'],
  'Market Maker': ['cruise', 'school', 'inspect', 'forage', 'surface', 'cruise', 'bubble-trail'],
  'Diamond Hands': ['rest', 'rest', 'cruise', 'hide', 'inspect', 'school', 'bubble-trail'],
  'Paper Hands': ['chase', 'hide', 'chase', 'surface', 'cruise', 'school', 'bubble-trail'],
  Shark: ['chase', 'chase', 'cruise', 'surface', 'inspect', 'forage', 'school'],
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
  cruise: 1, forage: .72, rest: .22, inspect: .58, hide: .48,
  chase: 1.55, surface: 1.2, school: .92, 'bubble-trail': .78,
};

const verticalByBeat: Record<AquariumLifeBeat, number> = {
  cruise: 0, forage: .72, rest: .88, inspect: .18, hide: .55,
  chase: -.08, surface: -.9, school: -.2, 'bubble-trail': -.38,
};

const habitatByBeat: Record<AquariumLifeBeat, AquariumHabitatTarget> = {
  cruise: 'open-water', forage: 'substrate', rest: 'plants', inspect: 'equipment', hide: 'plants',
  chase: 'open-water', surface: 'surface', school: 'school', 'bubble-trail': 'equipment',
};

const settleScaleByBeat: Record<AquariumLifeBeat, number> = {
  cruise: 1, forage: .94, rest: .9, inspect: .98, hide: .88,
  chase: 1.04, surface: 1.02, school: 1, 'bubble-trail': .97,
};

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
    habitatTarget: habitatByBeat[primary],
    settleScale: settleScaleByBeat[primary],
  };
}

export function aquariumLifePoolFor(seed: string): readonly AquariumLifeBeat[] {
  return lifePools[personalityFor(seed).name];
}

export function aquariumLifeLabel(beat: AquariumLifeBeat) {
  const labels: Record<AquariumLifeBeat, string> = {
    cruise: 'CRUISING THE DESK', forage: 'HUNTING FOR ALPHA', rest: 'MARKET CLOSED',
    inspect: 'AUDITING THE TANK', hide: 'IN A DARK POOL', chase: 'CHASING MOMENTUM',
    surface: 'CHECKING THE TICKER', school: 'TEAM MEETING', 'bubble-trail': 'BLOWING LIQUIDITY',
  };
  return labels[beat];
}

const socialMoments: readonly AquariumSocialMoment[] = ['opening-bell', 'feeding-rush', 'bubble-rally', 'closing-bell', 'quiet-market'];
const socialBeats: Record<AquariumSocialMoment, readonly [AquariumLifeBeat, AquariumLifeBeat]> = {
  'opening-bell': ['surface', 'school'],
  'feeding-rush': ['forage', 'chase'],
  'bubble-rally': ['bubble-trail', 'school'],
  'closing-bell': ['school', 'rest'],
  'quiet-market': ['cruise', 'inspect'],
};
const socialPresentation: Record<AquariumSocialMoment, Pick<AquariumSocialPlan, 'label' | 'fx' | 'haptic'>> = {
  'opening-bell': { label: 'OPENING BELL!', fx: 'bell', haptic: 'success' },
  'feeding-rush': { label: 'FEEDING FRENZY', fx: 'crumbs', haptic: 'success' },
  'bubble-rally': { label: 'BUBBLE RALLY', fx: 'bubbles', haptic: 'light' },
  'closing-bell': { label: 'CLOSING BELL', fx: 'ticker', haptic: 'light' },
  'quiet-market': { label: 'QUIET MARKET', fx: 'glimmer', haptic: 'none' },
};

/**
 * A deterministic tank-wide choreography plan. Rendering can turn the returned
 * presentation metadata into one short, recognizable aquarium spectacle while
 * keeping all ephemeral animation state out of persisted saves.
 */
export function aquariumSocialPlan(seed: string, cycle = 0, population = 1): AquariumSocialPlan {
  const safeCycle = Math.max(0, Math.floor(cycle));
  const safePopulation = Math.max(1, Math.floor(population));
  const roll = hash(`${seed}:social:${safeCycle}`);
  const moment = socialMoments[roll % socialMoments.length];
  const [leadBeat, echoBeat] = socialBeats[moment];
  const populationEnergy = Math.min(1, safePopulation / 12);
  return {
    moment,
    leadBeat,
    echoBeat,
    staggerMs: 45 + ((roll >>> 5) % 86),
    durationMs: 1450 + ((roll >>> 12) % 1551),
    intensity: Math.round((.55 + populationEnergy * .45) * 100) / 100,
    ...socialPresentation[moment],
  };
}
