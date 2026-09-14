import { MissionMetric, species } from './catalog';

export type TankConditions = { waterQuality: number; temperature: number; oxygen: number; feeding: number };
export type AccessoryCounts = { chain: number; crown: number; visor: number };
export type MarketEvent = { id: string; name: string; detail: string; multiplier: number; expiresAt: number } | null;
export type BiomeId = 'starter-office' | 'trading-floor' | 'executive-reef' | 'offshore-fund';
export type BreedResult = { speciesId: string; amount: number; mutated: boolean; lineageGained: number; xpGained: number; at: number } | null;

export type GameState = {
  cash: number;
  shrimp: Record<string, number>;
  shrimpAccessories: Record<string, AccessoryCounts>;
  mutations: Record<string, number>;
  lineage: Record<string, number>;
  discoveredSpecies: Record<string, boolean>;
  selectedSpecies: string;
  level: number;
  xp: number;
  tankCapacity: number;
  upgrades: Record<string, number>;
  conditions: TankConditions;
  conditionUpdatedAt: number;
  lifetimeRevenue: number;
  prestigeShares: number;
  ipoCount: number;
  activeMarketEvent: MarketEvent;
  lastBreedResult: BreedResult;
  stats: { hatched: number; sold: number; upgradesBought: number; bred: number; mutations: number };
  claimedMissions: Record<string, boolean>;
  lastDailyClaim: string | null;
  dailyStreak: number;
  lastUpdatedAt: number;
};

export const initialState: GameState = {
  cash: 24,
  shrimp: { cherry: 3 },
  shrimpAccessories: {},
  mutations: {},
  lineage: {},
  discoveredSpecies: { cherry: true },
  selectedSpecies: 'cherry',
  level: 1,
  xp: 0,
  tankCapacity: 20,
  upgrades: {},
  conditions: { waterQuality: 96, temperature: 76, oxygen: 94, feeding: 82 },
  conditionUpdatedAt: Date.now(),
  lifetimeRevenue: 0,
  prestigeShares: 0,
  ipoCount: 0,
  activeMarketEvent: null,
  lastBreedResult: null,
  stats: { hatched: 0, sold: 0, upgradesBought: 0, bred: 0, mutations: 0 },
  claimedMissions: {},
  lastDailyClaim: null,
  dailyStreak: 0,
  lastUpdatedAt: Date.now(),
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const accessoryDefault = (): AccessoryCounts => ({ chain: 0, crown: 0, visor: 0 });
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

export function currentBiome(state: GameState): BiomeId {
  if (state.prestigeShares >= 25 || state.level >= 45) return 'offshore-fund';
  if (state.prestigeShares >= 8 || state.level >= 25) return 'executive-reef';
  if (state.level >= 10) return 'trading-floor';
  return 'starter-office';
}

export function lineageMultiplier(state: GameState, speciesId: string) {
  return 1 + Math.min(0.6, (state.lineage?.[speciesId] ?? 0) * 0.02);
}
export const lineageLabel = (points: number) => points >= 25 ? 'Institutional Bloodline' : points >= 15 ? 'Blue-Chip Lineage' : points >= 8 ? 'Proven Desk' : points >= 3 ? 'Promising Line' : 'Founder Stock';
export const ipoRevenueRequirement = (state: GameState) => Math.round(10_000 * Math.pow(1.75, state.ipoCount ?? 0));
export const ipoLevelRequirement = (state: GameState) => 10 + (state.ipoCount ?? 0) * 5;
export const permanentIPOBonus = (state: GameState) => 1 + (state.ipoCount ?? 0) * 0.05;

export function tankHealth(state: GameState) {
  const c = state.conditions ?? initialState.conditions;
  const temperatureScore = clamp(100 - Math.abs(c.temperature - 76) * 12);
  return Math.round((c.waterQuality + c.oxygen + c.feeding + temperatureScore) / 4);
}
export function conditionMultiplier(state: GameState) {
  const health = tankHealth(state);
  if (health >= 92) return 1;
  if (health >= 80) return 0.94;
  if (health >= 65) return 0.82;
  if (health >= 45) return 0.65;
  return 0.45;
}
export const prestigeMultiplier = (state: GameState) => (1 + (state.prestigeShares ?? 0) * 0.025) * permanentIPOBonus(state);
export const productionMultiplier = (state: GameState) => (1 + (state.upgrades.filter ?? 0) * 0.2 + (state.upgrades.oxygen ?? 0) * 0.1 + (state.upgrades.collector ?? 0) * 0.12) * conditionMultiplier(state) * prestigeMultiplier(state);
export const speedMultiplier = (state: GameState) => (1 + (state.upgrades.heater ?? 0) * 0.15 + (state.upgrades['breeding-lab'] ?? 0) * 0.025) * Math.max(0.55, conditionMultiplier(state)) * Math.sqrt(prestigeMultiplier(state)) * Math.sqrt(lineageMultiplier(state, state.selectedSpecies));
export function marketMultiplier(state: GameState, now = Date.now()) {
  const raw = state.activeMarketEvent && state.activeMarketEvent.expiresAt > now ? state.activeMarketEvent.multiplier : 1;
  if (raw >= 1) return raw;
  const compliance = Math.min(0.8, (state.upgrades.compliance ?? 0) * 0.18);
  return 1 - (1 - raw) * (1 - compliance);
}
export const valueMultiplier = (state: GameState, speciesId = state.selectedSpecies) => {
  const eventBonus = marketMultiplier(state) !== 1 ? 1 + (state.upgrades.terminal ?? 0) * 0.08 : 1;
  const displayBonus = 1 + (state.upgrades.lighting ?? 0) * 0.05 + (state.upgrades.showcase ?? 0) * 0.1;
  return (1 + (state.upgrades.algae ?? 0) * 0.25) * (0.8 + tankHealth(state) / 500) * prestigeMultiplier(state) * marketMultiplier(state) * eventBonus * displayBonus * lineageMultiplier(state, speciesId);
};
export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);
export const dailyRewardAmount = (streak: number) => Math.min(60, 20 + Math.max(0, streak - 1) * 5);
export const ACCESSORY_ODDS = 500;
export const MUTATION_ODDS = 18;
export const BREED_COST = 25;
export const canIPO = (state: GameState) => state.level >= ipoLevelRequirement(state) && state.lifetimeRevenue >= ipoRevenueRequirement(state);
export const projectedIPOShares = (state: GameState) => Math.max(1, Math.floor(Math.sqrt(state.lifetimeRevenue / 2500) + state.level / 8 + (state.stats.mutations ?? 0) * 0.5));

export function refreshMarketEvent(state: GameState, now = Date.now()): GameState {
  if (state.activeMarketEvent && state.activeMarketEvent.expiresAt > now) return state;
  const bucket = Math.floor(now / 900_000);
  if (bucket % 4 !== 0) return state.activeMarketEvent ? { ...state, activeMarketEvent: null } : state;
  const events = [
    { id: 'chef-rush', name: 'Luxury Restaurant Rush', detail: 'Collectors are bidding up premium stock.', multiplier: 1.25 },
    { id: 'shrimp-short', name: 'Shell Street Short Squeeze', detail: 'A bizarre shortage sends prices vertical.', multiplier: 1.4 },
    { id: 'inspection-rumor', name: 'Regulatory Inspection Rumor', detail: 'Buyers demand a discount until the rumor clears.', multiplier: 0.82 },
    { id: 'influencer', name: 'Aquarium Influencer Pump', detail: 'Tiny shrimp are suddenly the asset class of the week.', multiplier: 1.18 },
  ];
  const event = events[bucket % events.length];
  return { ...state, activeMarketEvent: { ...event, expiresAt: now + 8 * 60_000 } };
}

export function advanceTankConditions(input: GameState, now = Date.now()): GameState {
  const state = refreshMarketEvent(input, now);
  const elapsedMinutes = Math.max(0, (now - (state.conditionUpdatedAt || now)) / 60_000);
  if (elapsedMinutes < 0.1) return state;
  const population = totalShrimp(state);
  const crowding = state.tankCapacity <= 0 ? 0 : population / state.tankCapacity;
  const filterLevel = state.upgrades.filter ?? 0;
  const heaterLevel = state.upgrades.heater ?? 0;
  const algaeLevel = state.upgrades.algae ?? 0;
  const oxygenLevel = state.upgrades.oxygen ?? 0;
  const c = state.conditions ?? initialState.conditions;
  const waterDrain = Math.max(0.025, 0.17 + crowding * 0.24 - filterLevel * 0.045);
  const oxygenDrain = Math.max(0.01, 0.11 + crowding * 0.2 - filterLevel * 0.035 - oxygenLevel * 0.055);
  const feedDrain = Math.max(0.055, 0.5 + crowding * 0.38 - algaeLevel * 0.06);
  const targetTemperature = heaterLevel > 0 ? Math.min(78, 75 + heaterLevel * 0.45) : 72;
  const temperatureStep = Math.min(1, elapsedMinutes * (heaterLevel > 0 ? 0.08 + heaterLevel * 0.015 : 0.035));
  const temperature = c.temperature + (targetTemperature - c.temperature) * temperatureStep;
  return { ...state, conditions: { waterQuality: clamp(c.waterQuality - waterDrain * elapsedMinutes), temperature: Math.round(temperature * 10) / 10, oxygen: clamp(c.oxygen - oxygenDrain * elapsedMinutes), feeding: clamp(c.feeding - feedDrain * elapsedMinutes) }, conditionUpdatedAt: now };
}

export function feedTank(state: GameState): GameState {
  if (state.cash < 2 || state.conditions.feeding >= 98) return state;
  return { ...state, cash: state.cash - 2, conditions: { ...state.conditions, feeding: clamp(state.conditions.feeding + 42) }, conditionUpdatedAt: Date.now() };
}
export function serviceTank(state: GameState): GameState {
  if (state.cash < 4 || (state.conditions.waterQuality >= 98 && state.conditions.oxygen >= 98)) return state;
  return { ...state, cash: state.cash - 4, conditions: { ...state.conditions, waterQuality: clamp(state.conditions.waterQuality + 48), oxygen: clamp(state.conditions.oxygen + 35) }, conditionUpdatedAt: Date.now() };
}
export function missionProgress(state: GameState, metric: MissionMetric) {
  if (metric === 'lifetimeRevenue') return state.lifetimeRevenue;
  if (metric === 'tankCapacity') return state.tankCapacity;
  if (metric === 'level') return state.level;
  if (metric === 'accessories') return Object.values(state.shrimpAccessories).reduce((total, entry) => total + entry.chain + entry.crown + (entry.visor ?? 0), 0);
  return state.stats[metric as keyof GameState['stats']] ?? 0;
}

function rollAccessoryDrops(seed: number, amount: number, odds: number) {
  let random = seed >>> 0, chain = 0, crown = 0, visor = 0;
  for (let i = 0; i < amount; i += 1) {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    if (random / 0x100000000 >= 1 / odds) continue;
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    const type = random % 3;
    if (type === 0) chain += 1;
    else if (type === 1) crown += 1;
    else visor += 1;
  }
  return { chain, crown, visor };
}
function addAccessoryDrops(state: GameState, speciesId: string, amount: number, seed: number) {
  const showcase = state.upgrades.showcase ?? 0;
  const odds = Math.max(140, Math.round(ACCESSORY_ODDS / (1 + showcase * 0.18)));
  const drops = rollAccessoryDrops(seed, amount, odds);
  const owned = state.shrimpAccessories[speciesId] ?? accessoryDefault();
  return { ...state.shrimpAccessories, [speciesId]: { chain: owned.chain + drops.chain, crown: owned.crown + drops.crown, visor: (owned.visor ?? 0) + drops.visor } };
}

export function nextDailyStreak(state: GameState, today = new Date()) {
  if (!state.lastDailyClaim) return 1;
  const previous = new Date(`${state.lastDailyClaim}T00:00:00.000Z`);
  const current = new Date(`${dayKey(today)}T00:00:00.000Z`);
  const elapsedDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
  return elapsedDays === 1 ? state.dailyStreak + 1 : 1;
}
export const canClaimDailyReward = (state: GameState, today = new Date()) => state.lastDailyClaim !== dayKey(today);

export function hatch(input: GameState): GameState {
  const state = advanceTankConditions(input);
  if (totalShrimp(state) >= state.tankCapacity) return state;
  const amount = Math.max(1, Math.floor(productionMultiplier(state)));
  const room = state.tankCapacity - totalShrimp(state);
  const hatched = Math.min(amount, room);
  const progression = applyXp(state.level, state.xp, hatched);
  return {
    ...state,
    shrimp: { ...state.shrimp, [state.selectedSpecies]: (state.shrimp[state.selectedSpecies] ?? 0) + hatched },
    shrimpAccessories: addAccessoryDrops(state, state.selectedSpecies, hatched, state.lastUpdatedAt + state.stats.hatched * 7919),
    discoveredSpecies: { ...state.discoveredSpecies, [state.selectedSpecies]: true },
    ...progression,
    stats: { ...state.stats, hatched: state.stats.hatched + hatched },
  };
}

export function breedSelected(input: GameState, now = Date.now()): GameState {
  const state = advanceTankConditions(input, now);
  const id = state.selectedSpecies;
  const owned = state.shrimp[id] ?? 0;
  const lab = state.upgrades['breeding-lab'] ?? 0;
  const cost = Math.max(8, BREED_COST - lab * 3);
  if (owned < 2 || state.cash < cost || totalShrimp(state) >= state.tankCapacity) return state;

  const lineage = state.lineage?.[id] ?? 0;
  const mutationDenominator = Math.max(5, MUTATION_ODDS - lab * 2 - Math.floor(lineage / 8));
  const mutationRoll = Math.abs(Math.imul((now >>> 0) ^ state.stats.bred, 2654435761)) % mutationDenominator;
  const mutated = mutationRoll === 0;
  const twinChance = Math.min(0.3, 0.08 + lab * 0.035 + lineage * 0.004);
  const twinRoll = ((Math.imul((now >>> 0) + 91, 1103515245) + 12345) >>> 0) / 0x100000000;
  const amount = Math.min(state.tankCapacity - totalShrimp(state), twinRoll < twinChance ? 2 : 1);
  const lineageGained = mutated ? 3 : 1;
  const xpGained = 8 + lineageGained * 3 + (amount > 1 ? 7 : 0);
  const progression = applyXp(state.level, state.xp, xpGained);

  return {
    ...state,
    cash: state.cash - cost,
    shrimp: { ...state.shrimp, [id]: owned + amount },
    shrimpAccessories: addAccessoryDrops(state, id, amount, now + state.stats.bred * 8191),
    mutations: mutated ? { ...state.mutations, [id]: (state.mutations[id] ?? 0) + 1 } : state.mutations,
    lineage: { ...state.lineage, [id]: lineage + lineageGained },
    discoveredSpecies: { ...state.discoveredSpecies, [id]: true },
    lastBreedResult: { speciesId: id, amount, mutated, lineageGained, xpGained, at: now },
    ...progression,
    stats: { ...state.stats, bred: state.stats.bred + 1, mutations: state.stats.mutations + (mutated ? 1 : 0) },
    lastUpdatedAt: now,
  };
}

export function launchIPO(state: GameState): GameState {
  if (!canIPO(state)) return state;
  const gainedShares = projectedIPOShares(state);
  return {
    ...initialState,
    cash: 100 + (state.ipoCount ?? 0) * 50,
    prestigeShares: (state.prestigeShares ?? 0) + gainedShares,
    ipoCount: (state.ipoCount ?? 0) + 1,
    mutations: state.mutations,
    lineage: state.lineage,
    discoveredSpecies: state.discoveredSpecies,
    shrimpAccessories: state.shrimpAccessories,
    claimedMissions: state.claimedMissions,
    lastUpdatedAt: Date.now(),
    conditionUpdatedAt: Date.now(),
  };
}

export function saleXpFor(speciesId: string, amount = 1) {
  const item = species.find((entry) => entry.id === speciesId);
  if (!item) return amount * 2;
  const rarityBonus: Record<string, number> = { Common: 1, Uncommon: 2, Rare: 4, Epic: 7, Legendary: 11, Mythic: 17, Exotic: 25 };
  return amount * (2 + (rarityBonus[item.rarity] ?? 1));
}

export function sell(input: GameState, speciesId: string, amount = 1): GameState {
  const state = advanceTankConditions(input);
  const item = species.find((entry) => entry.id === speciesId);
  const owned = state.shrimp[speciesId] ?? 0;
  if (!item || owned < amount) return state;
  const proceeds = Math.round(item.basePrice * amount * valueMultiplier(state, speciesId));
  const accessories = state.shrimpAccessories[speciesId] ?? accessoryDefault();
  let accessoriesToSell = Math.max(0, amount - Math.max(0, owned - accessories.chain - accessories.crown - (accessories.visor ?? 0)));
  const chainSold = Math.min(accessories.chain, accessoriesToSell);
  accessoriesToSell -= chainSold;
  const crownSold = Math.min(accessories.crown, accessoriesToSell);
  accessoriesToSell -= crownSold;
  const visorSold = Math.min(accessories.visor ?? 0, accessoriesToSell);
  const progression = applyXp(state.level, state.xp, saleXpFor(speciesId, amount));
  return {
    ...state,
    cash: state.cash + proceeds,
    shrimp: { ...state.shrimp, [speciesId]: owned - amount },
    shrimpAccessories: { ...state.shrimpAccessories, [speciesId]: { chain: accessories.chain - chainSold, crown: accessories.crown - crownSold, visor: (accessories.visor ?? 0) - visorSold } },
    discoveredSpecies: { ...state.discoveredSpecies, [speciesId]: true },
    ...progression,
    lifetimeRevenue: state.lifetimeRevenue + proceeds,
    stats: { ...state.stats, sold: state.stats.sold + amount },
    lastUpdatedAt: Date.now(),
  };
}

export function calculateOfflineHatches(input: GameState, now = Date.now()) {
  const state = advanceTankConditions(input, now);
  const item = species.find((entry) => entry.id === state.selectedSpecies) ?? species[0];
  const elapsedSeconds = Math.max(0, (now - state.lastUpdatedAt) / 1000);
  const cycle = item.hatchSeconds / speedMultiplier(state);
  return Math.min(state.tankCapacity - totalShrimp(state), Math.floor(elapsedSeconds / cycle));
}
export function accrueProduction(input: GameState, now = Date.now()): { state: GameState; hatched: number } {
  const state = advanceTankConditions(input, now);
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
      discoveredSpecies: { ...state.discoveredSpecies, [state.selectedSpecies]: true },
      ...progression,
      stats: { ...state.stats, hatched: state.stats.hatched + hatched },
      lastUpdatedAt: state.lastUpdatedAt + cycles * cycleMilliseconds,
    },
  };
}
export function secondsUntilNextHatch(input: GameState, now = Date.now()) {
  const state = advanceTankConditions(input, now);
  if (totalShrimp(state) >= state.tankCapacity) return 0;
  const item = species.find((entry) => entry.id === state.selectedSpecies) ?? species[0];
  const cycleMilliseconds = item.hatchSeconds / speedMultiplier(state) * 1000;
  const elapsed = Math.max(0, now - state.lastUpdatedAt) % cycleMilliseconds;
  return Math.max(0, Math.ceil((cycleMilliseconds - elapsed) / 1000));
}