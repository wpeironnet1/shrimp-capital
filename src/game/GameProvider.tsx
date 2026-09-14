import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { missions, upgrades } from './catalog';
import { decorItems, DecorSlot } from './decor';
import { accrueProduction, applyXp, breedSelected, canClaimDailyReward, dailyRewardAmount, dayKey, feedTank, GameState, hatch, initialState, launchIPO, missionProgress, nextDailyStreak, sell, serviceTank, upgradeCost } from './engine';

const SAVE_KEY = '@shrimp-capital/save-v1';
const DECOR_KEY = '@shrimp-capital/decor-v1';
const SAVE_VERSION = 2;

type GameSaveEnvelope = { version: number; state: Partial<GameState> };
type DecorSave = { owned: Record<string, boolean>; placed: Partial<Record<DecorSlot, string>> };
type DecorSaveEnvelope = { version: number; decor: DecorSave };

type GameContextValue = {
  state: GameState;
  loaded: boolean;
  offlineHatches: number;
  ownedDecor: Record<string, boolean>;
  placedDecor: Partial<Record<DecorSlot, string>>;
  dismissOfflineReport: () => void;
  hatchNow: () => void;
  sellOne: (id: string) => void;
  selectSpecies: (id: string) => void;
  buyUpgrade: (id: string) => void;
  expandTank: () => void;
  feed: () => void;
  service: () => void;
  breed: () => void;
  ipo: () => void;
  buyDecor: (id: string) => void;
  placeDecor: (id: string) => void;
  removeDecor: (slot: DecorSlot) => void;
  claimMission: (id: string) => void;
  claimDailyReward: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

function readGameSave(raw: string | null): Partial<GameState> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GameState> | GameSaveEnvelope;
    if (parsed && typeof parsed === 'object' && 'state' in parsed && parsed.state && typeof parsed.state === 'object') return parsed.state;
    return parsed as Partial<GameState>;
  } catch (error) {
    console.warn('Shrimp Capital could not read the local game save. Starting from a safe state.', error);
    return null;
  }
}

function readDecorSave(raw: string | null): DecorSave {
  if (!raw) return { owned: {}, placed: {} };
  try {
    const parsed = JSON.parse(raw) as DecorSave | DecorSaveEnvelope;
    const decor = parsed && typeof parsed === 'object' && 'decor' in parsed ? parsed.decor : parsed as DecorSave;
    return {
      owned: decor?.owned && typeof decor.owned === 'object' ? decor.owned : {},
      placed: decor?.placed && typeof decor.placed === 'object' ? decor.placed : {},
    };
  } catch (error) {
    console.warn('Shrimp Capital could not read aquarium decor. Keeping the game save intact.', error);
    return { owned: {}, placed: {} };
  }
}

function normalizeGameSave(parsed: Partial<GameState>): GameState {
  const normalizedAccessories = Object.fromEntries(
    Object.entries(parsed.shrimpAccessories ?? {}).map(([id, value]) => [id, {
      chain: value?.chain ?? 0,
      crown: value?.crown ?? 0,
      visor: value?.visor ?? 0,
      suit: value?.suit ?? 0,
    }]),
  );
  const discoveredFromStock = Object.fromEntries(
    Object.entries(parsed.shrimp ?? {}).filter(([, amount]) => (amount ?? 0) > 0).map(([id]) => [id, true]),
  );

  return {
    ...initialState,
    ...parsed,
    shrimp: { ...initialState.shrimp, ...parsed.shrimp },
    shrimpAccessories: normalizedAccessories,
    mutations: { ...initialState.mutations, ...parsed.mutations },
    lineage: { ...initialState.lineage, ...parsed.lineage },
    discoveredSpecies: { ...initialState.discoveredSpecies, ...discoveredFromStock, ...parsed.discoveredSpecies },
    upgrades: { ...initialState.upgrades, ...parsed.upgrades },
    conditions: { ...initialState.conditions, ...parsed.conditions },
    conditionUpdatedAt: parsed.conditionUpdatedAt ?? parsed.lastUpdatedAt ?? Date.now(),
    stats: { ...initialState.stats, ...parsed.stats },
    claimedMissions: { ...initialState.claimedMissions, ...parsed.claimedMissions },
  } as GameState;
}

function persistGame(state: GameState) {
  const payload: GameSaveEnvelope = { version: SAVE_VERSION, state };
  return AsyncStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

function persistDecor(owned: Record<string, boolean>, placed: Partial<Record<DecorSlot, string>>) {
  const payload: DecorSaveEnvelope = { version: SAVE_VERSION, decor: { owned, placed } };
  return AsyncStorage.setItem(DECOR_KEY, JSON.stringify(payload));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);
  const [offlineHatches, setOfflineHatches] = useState(0);
  const [ownedDecor, setOwnedDecor] = useState<Record<string, boolean>>({});
  const [placedDecor, setPlacedDecor] = useState<Partial<Record<DecorSlot, string>>>({});

  useEffect(() => {
    let active = true;
    Promise.all([AsyncStorage.getItem(SAVE_KEY), AsyncStorage.getItem(DECOR_KEY)])
      .then(([raw, decorRaw]) => {
        if (!active) return;
        const decor = readDecorSave(decorRaw);
        setOwnedDecor(decor.owned);
        setPlacedDecor(decor.placed);

        const parsed = readGameSave(raw);
        if (!parsed) return;
        const saved = normalizeGameSave(parsed);
        const production = accrueProduction(saved);
        setOfflineHatches(production.hatched);
        setState({ ...production.state, lastUpdatedAt: Date.now() });
      })
      .catch((error) => console.warn('Shrimp Capital local storage was unavailable. The current session can still continue.', error))
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void persistGame(state).catch((error) => console.warn('Shrimp Capital could not persist the latest game state.', error));
  }, [state, loaded]);

  useEffect(() => {
    if (!loaded) return;
    void persistDecor(ownedDecor, placedDecor).catch((error) => console.warn('Shrimp Capital could not persist aquarium decor.', error));
  }, [ownedDecor, placedDecor, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setInterval(() => setState((current) => accrueProduction(current).state), 1000);
    return () => clearInterval(timer);
  }, [loaded]);

  const value = useMemo<GameContextValue>(() => ({
    state,
    loaded,
    offlineHatches,
    ownedDecor,
    placedDecor,
    dismissOfflineReport: () => setOfflineHatches(0),
    hatchNow: () => { setState(hatch); void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); },
    sellOne: (id) => { setState((current) => sell(current, id)); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); },
    selectSpecies: (id) => setState((current) => ({ ...current, selectedSpecies: id, discoveredSpecies: { ...current.discoveredSpecies, [id]: current.discoveredSpecies[id] ?? false }, lastUpdatedAt: Date.now() })),
    buyUpgrade: (id) => setState((current) => {
      const item = upgrades.find((upgrade) => upgrade.id === id);
      if (!item) return current;
      const cost = upgradeCost(item.baseCost, current.upgrades[id] ?? 0);
      if (current.cash < cost) return current;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return { ...current, cash: current.cash - cost, upgrades: { ...current.upgrades, [id]: (current.upgrades[id] ?? 0) + 1 }, stats: { ...current.stats, upgradesBought: current.stats.upgradesBought + 1 } };
    }),
    expandTank: () => setState((current) => {
      const cost = Math.round(75 * Math.pow(1.45, Math.max(0, (current.tankCapacity - 20) / 10)));
      if (current.cash < cost) return current;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return { ...current, cash: current.cash - cost, tankCapacity: current.tankCapacity + 10 };
    }),
    feed: () => { setState((current) => feedTank(current)); void Haptics.selectionAsync(); },
    service: () => { setState((current) => serviceTank(current)); void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); },
    breed: () => { setState((current) => breedSelected(current)); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); },
    ipo: () => { setState((current) => launchIPO(current)); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); },
    buyDecor: (id) => {
      const item = decorItems.find((entry) => entry.id === id);
      if (!item || ownedDecor[id] || state.level < item.unlockLevel || state.cash < item.price) return;
      setState((current) => ({ ...current, cash: current.cash - item.price }));
      setOwnedDecor((current) => ({ ...current, [id]: true }));
      setPlacedDecor((current) => ({ ...current, [item.slot]: id }));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    placeDecor: (id) => {
      const item = decorItems.find((entry) => entry.id === id);
      if (!item || !ownedDecor[id]) return;
      setPlacedDecor((current) => ({ ...current, [item.slot]: id }));
      void Haptics.selectionAsync();
    },
    removeDecor: (slot) => setPlacedDecor((current) => { const next = { ...current }; delete next[slot]; return next; }),
    claimMission: (id) => setState((current) => {
      const mission = missions.find((entry) => entry.id === id);
      if (!mission || current.claimedMissions[id] || missionProgress(current, mission.metric) < mission.target) return current;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const progression = applyXp(current.level, current.xp, mission.rewardXp);
      return { ...current, ...progression, cash: current.cash + mission.reward, claimedMissions: { ...current.claimedMissions, [id]: true } };
    }),
    claimDailyReward: () => setState((current) => {
      if (!canClaimDailyReward(current)) return current;
      const streak = nextDailyStreak(current);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { ...current, cash: current.cash + dailyRewardAmount(streak), dailyStreak: streak, lastDailyClaim: dayKey() };
    }),
  }), [state, loaded, offlineHatches, ownedDecor, placedDecor]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => { const context = useContext(GameContext); if (!context) throw new Error('useGame must be used inside GameProvider'); return context; };
