import { MissionMetric, species } from './catalog';

export type GameState = {
  cash: number;
  shrimp: Record<string, number>;
  shrimpAccessories: Record<string, { chain: number; crown: number }>;
  selectedSpecies: string;
  level: number;
  xp: number;
  tankCapacity: number;
  upgrades: Record<string, number>;
  lifetimeRevenue: number;
  stats: { hatched: number; sold: number; upgradesBought: number };
  claimedMissions: Record<string, boolean>;
  lastDailyClaim: string | null;
  dailyStreak: number;
  lastUpdatedAt: number;
};

export const initialState: GameState = {
  cash: 24,
  shrimp: { cherry: 3 },
  shrimpAccessories: {},
  selectedSpecies: 'cherry',
  level: 1,
  xp: 0,
  tankCapacity: 20,
  upgrades: {},
  lifetimeRevenue: 0,
  stats: { hatched: 0, sold: 0, upgradesBought: 0 },
  claimedMissions: {},
  lastDailyClaim: null,
  dailyStreak: 0,
  lastUpdatedAt: Date.now(),
};

export const totalShrimp = (state: GameState) => Object.values(state.shrimp).reduce((a, b) => a + b, 0);
export const xpForNextLevel = (level: number) => 30 + level * 25;
export function applyXp(level: number, xp: number, gained: number) {
  let nextLevel = level;
  let nextXp = xp + gained;
  while (nextXp >= xpForNextLevel(nextLevel)) {
    nextXp -= xpForNextLevel(nextLevel);
    nextLevel += 1;
  }
  return { level: nextLevel, xp: nextXp };
}
export const upgradeCost = (base: number, owned: number) => Math.round(base * Math.pow(1.65, owned));
export const productionMultiplier = (state: GameState) => 1 + (state.upgrades.filter ?? 0) * 0.2;
export const speedMultiplier = (state: GameState) => 1 + (state.upgrades.heater ?? 0) * 0.15;
export const valueMultiplier = (state: GameState) => 1 + (state.upgrades.algae ?? 0) * 0.25;
export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);
export const dailyRewardAmount = (streak: number) => Math.min(60, 20 + Math.max(0, streak - 1) * 5);
export const ACCESSORY_ODDS = 500;

export function missionProgress(state: GameState, metric: MissionMetric) {
  if (metric === 'lifetimeRevenue') return state.lifetimeRevenue;
  if (metric === 'tankCapacity') return state.tankCapacity;
  if (metric === 'level') return state.level;
  if (metric === 'accessories') return Object.values(state.shrimpAccessories).reduce((total, entry) => total + entry.chain + entry.crown, 0);
  return state.stats[metric];
}

function rollAccessoryDrops(seed: number, amount: number) {
  let random = seed >>> 0;
  let chain = 0;
  let crown = 0;
  for (let index = 0; index < amount; index += 1) {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    if (random / 0x100000000 >= 1 / ACCESSORY_ODDS) continue;
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    if (random % 2 === 0) chain += 1;
    else crown += 1;
  }
  return { chain, crown };
}

function addAccessoryDrops(state: GameState, speciesId: string, amount: number, seed: number) {
  const drops = rollAccessoryDrops(seed, amount);
  const owned = state.shrimpAccessories[speciesId] ?? { chain: 0, crown: 0 };
  return {
    ...state.shrimpAccessories,
    [speciesId]: { chain: owned.chain + drops.chain, crown: owned.crown + drops.crown },
  };
}

export function nextDailyStreak(state: GameState, today = new Date()) {
  if (!state.lastDailyClaim) return 1;
  const previous = new Date(`${state.lastDailyClaim}T00:00:00.000Z`);
  const current = new Date(`${dayKey(today)}T00:00:00.000Z`);
  const elapsedDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
  return elapsedDays === 1 ? state.dailyStreak + 1 : 1;
}

export const canClaimDailyReward = (state: GameState, today = new Date()) => state.lastDailyClaim !== dayKey(today);

export function hatch(state: GameState): GameState {
  if (totalShrimp(state) >= state.tankCapacity) return state;
  const amount = Math.max(1, Math.floor(productionMultiplier(state)));
  const room = state.tankCapacity - totalShrimp(state);
  const hatched = Math.min(amount, room);
  const progression = applyXp(state.level, state.xp, hatched);
  return {
    ...state,
    shrimp: { ...state.shrimp, [state.selectedSpecies]: (state.shrimp[state.selectedSpecies] ?? 0) + hatched },
    shrimpAccessories: addAccessoryDrops(state, state.selectedSpecies, hatched, state.lastUpdatedAt + state.stats.hatched * 7919),
    ...progression,
    stats: { ...state.stats, hatched: state.stats.hatched + hatched },
  };
}

export function sell(state: GameState, speciesId: string, amount = 1): GameState {
  const item = species.find((entry) => entry.id === speciesId);
  const owned = state.shrimp[speciesId] ?? 0;
  if (!item || owned < amount) return state;
  const proceeds = Math.round(item.basePrice * amount * valueMultiplier(state));
  const accessories = state.shrimpAccessories[speciesId] ?? { chain: 0, crown: 0 };
  let accessoriesToSell = Math.max(0, amount - Math.max(0, owned - accessories.chain - accessories.crown));
  const chainSold = Math.min(accessories.chain, accessoriesToSell);
  accessoriesToSell -= chainSold;
  const crownSold = Math.min(accessories.crown, accessoriesToSell);
  const progression = applyXp(state.level, state.xp, amount * 2);
  return {
    ...state,
    cash: state.cash + proceeds,
    shrimp: { ...state.shrimp, [speciesId]: owned - amount },
    shrimpAccessories: { ...state.shrimpAccessories, [speciesId]: { chain: accessories.chain - chainSold, crown: accessories.crown - crownSold } },
    ...progression,
    lifetimeRevenue: state.lifetimeRevenue + proceeds,
    stats: { ...state.stats, sold: state.stats.sold + amount },
    lastUpdatedAt: Date.now(),
  };
}

export function calculateOfflineHatches(state: GameState, now = Date.now()) {
  const item = species.find((entry) => entry.id === state.selectedSpecies) ?? species[0];
  const elapsedSeconds = Math.max(0, (now - state.lastUpdatedAt) / 1000);
  const cycle = item.hatchSeconds / speedMultiplier(state);
  return Math.min(state.tankCapacity - totalShrimp(state), Math.floor(elapsedSeconds / cycle));
}

export function accrueProduction(state: GameState, now = Date.now()): { state: GameState; hatched: number } {
  const item = species.find((entry) => entry.id === state.selectedSpecies) ?? species[0];
  const cycleMilliseconds = item.hatchSeconds / speedMultiplier(state) * 1000;
  const cycles = Math.floor(Math.max(0, now - state.lastUpdatedAt) / cycleMilliseconds);
  const room = Math.max(0, state.tankCapacity - totalShrimp(state));
  const hatched = Math.min(room, cycles * Math.max(1, Math.floor(productionMultiplier(state))));
  const progression = applyXp(state.level, state.xp, hatched);

  if (cycles < 1) return { state, hatched: 0 };
  return {
    hatched,
    state: {
      ...state,
      shrimp: { ...state.shrimp, [state.selectedSpecies]: (state.shrimp[state.selectedSpecies] ?? 0) + hatched },
      shrimpAccessories: addAccessoryDrops(state, state.selectedSpecies, hatched, state.lastUpdatedAt + cycles * 104729 + state.stats.hatched),
      ...progression,
      stats: { ...state.stats, hatched: state.stats.hatched + hatched },
      lastUpdatedAt: state.lastUpdatedAt + cycles * cycleMilliseconds,
    },
  };
}

export function secondsUntilNextHatch(state: GameState, now = Date.now()) {
  if (totalShrimp(state) >= state.tankCapacity) return 0;
  const item = species.find((entry) => entry.id === state.selectedSpecies) ?? species[0];
  const cycleMilliseconds = item.hatchSeconds / speedMultiplier(state) * 1000;
  const elapsed = Math.max(0, now - state.lastUpdatedAt) % cycleMilliseconds;
  return Math.max(0, Math.ceil((cycleMilliseconds - elapsed) / 1000));
}
