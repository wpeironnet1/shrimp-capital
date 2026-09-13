import { species } from './catalog';

export type GameState = {
  cash: number;
  shrimp: Record<string, number>;
  selectedSpecies: string;
  level: number;
  xp: number;
  tankCapacity: number;
  upgrades: Record<string, number>;
  lifetimeRevenue: number;
  lastUpdatedAt: number;
};

export const initialState: GameState = {
  cash: 24,
  shrimp: { cherry: 3 },
  selectedSpecies: 'cherry',
  level: 1,
  xp: 0,
  tankCapacity: 20,
  upgrades: {},
  lifetimeRevenue: 0,
  lastUpdatedAt: Date.now(),
};

export const totalShrimp = (state: GameState) => Object.values(state.shrimp).reduce((a, b) => a + b, 0);
export const xpForNextLevel = (level: number) => 30 + level * 25;
export const upgradeCost = (base: number, owned: number) => Math.round(base * Math.pow(1.65, owned));
export const productionMultiplier = (state: GameState) => 1 + (state.upgrades.filter ?? 0) * 0.2;
export const speedMultiplier = (state: GameState) => 1 + (state.upgrades.heater ?? 0) * 0.15;
export const valueMultiplier = (state: GameState) => 1 + (state.upgrades.algae ?? 0) * 0.25;

export function hatch(state: GameState): GameState {
  if (totalShrimp(state) >= state.tankCapacity) return state;
  const amount = Math.max(1, Math.floor(productionMultiplier(state)));
  const room = state.tankCapacity - totalShrimp(state);
  return {
    ...state,
    shrimp: { ...state.shrimp, [state.selectedSpecies]: (state.shrimp[state.selectedSpecies] ?? 0) + Math.min(amount, room) },
    xp: state.xp + Math.min(amount, room),
  };
}

export function sell(state: GameState, speciesId: string, amount = 1): GameState {
  const item = species.find((entry) => entry.id === speciesId);
  const owned = state.shrimp[speciesId] ?? 0;
  if (!item || owned < amount) return state;
  const proceeds = Math.round(item.basePrice * amount * valueMultiplier(state));
  let xp = state.xp + amount * 2;
  let level = state.level;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
  }
  return {
    ...state,
    cash: state.cash + proceeds,
    shrimp: { ...state.shrimp, [speciesId]: owned - amount },
    xp,
    level,
    lifetimeRevenue: state.lifetimeRevenue + proceeds,
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

  if (cycles < 1) return { state, hatched: 0 };
  return {
    hatched,
    state: {
      ...state,
      shrimp: { ...state.shrimp, [state.selectedSpecies]: (state.shrimp[state.selectedSpecies] ?? 0) + hatched },
      xp: state.xp + hatched,
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
