import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { missions, upgrades } from './catalog';
import { accrueProduction, applyXp, canClaimDailyReward, dailyRewardAmount, dayKey, GameState, hatch, initialState, missionProgress, nextDailyStreak, sell, upgradeCost } from './engine';

const SAVE_KEY = '@shrimp-capital/save-v1';
type GameContextValue = {
  state: GameState;
  loaded: boolean;
  offlineHatches: number;
  dismissOfflineReport: () => void;
  hatchNow: () => void;
  sellOne: (id: string) => void;
  selectSpecies: (id: string) => void;
  buyUpgrade: (id: string) => void;
  expandTank: () => void;
  claimMission: (id: string) => void;
  claimDailyReward: () => void;
};
const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);
  const [offlineHatches, setOfflineHatches] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY).then((raw) => {
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<GameState>;
      const saved = {
        ...initialState,
        ...parsed,
        shrimp: { ...initialState.shrimp, ...parsed.shrimp },
        shrimpAccessories: { ...initialState.shrimpAccessories, ...parsed.shrimpAccessories },
        upgrades: { ...initialState.upgrades, ...parsed.upgrades },
        stats: { ...initialState.stats, ...parsed.stats },
        claimedMissions: { ...initialState.claimedMissions, ...parsed.claimedMissions },
      } as GameState;
      const production = accrueProduction(saved);
      setOfflineHatches(production.hatched);
      setState({ ...production.state, lastUpdatedAt: Date.now() });
    }).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setInterval(() => setState((current) => accrueProduction(current).state), 1000);
    return () => clearInterval(timer);
  }, [loaded]);

  const value = useMemo<GameContextValue>(() => ({
    state,
    loaded,
    offlineHatches,
    dismissOfflineReport: () => setOfflineHatches(0),
    hatchNow: () => { setState(hatch); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); },
    sellOne: (id) => { setState((current) => sell(current, id)); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); },
    selectSpecies: (id) => setState((current) => ({ ...current, selectedSpecies: id, lastUpdatedAt: Date.now() })),
    buyUpgrade: (id) => setState((current) => {
      const item = upgrades.find((upgrade) => upgrade.id === id);
      if (!item) return current;
      const cost = upgradeCost(item.baseCost, current.upgrades[id] ?? 0);
      if (current.cash < cost) return current;
      return { ...current, cash: current.cash - cost, upgrades: { ...current.upgrades, [id]: (current.upgrades[id] ?? 0) + 1 }, stats: { ...current.stats, upgradesBought: current.stats.upgradesBought + 1 } };
    }),
    expandTank: () => setState((current) => {
      const cost = Math.round(75 * Math.pow(1.45, Math.max(0, (current.tankCapacity - 20) / 10)));
      if (current.cash < cost) return current;
      return { ...current, cash: current.cash - cost, tankCapacity: current.tankCapacity + 10 };
    }),
    claimMission: (id) => setState((current) => {
      const mission = missions.find((entry) => entry.id === id);
      if (!mission || current.claimedMissions[id] || missionProgress(current, mission.metric) < mission.target) return current;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const progression = applyXp(current.level, current.xp, mission.rewardXp);
      return { ...current, ...progression, cash: current.cash + mission.reward, claimedMissions: { ...current.claimedMissions, [id]: true } };
    }),
    claimDailyReward: () => setState((current) => {
      if (!canClaimDailyReward(current)) return current;
      const streak = nextDailyStreak(current);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { ...current, cash: current.cash + dailyRewardAmount(streak), dailyStreak: streak, lastDailyClaim: dayKey() };
    }),
  }), [state, loaded, offlineHatches]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
};
