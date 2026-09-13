import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { upgrades } from './catalog';
import { calculateOfflineHatches, GameState, hatch, initialState, sell, totalShrimp, upgradeCost } from './engine';

const SAVE_KEY = '@shrimp-capital/save-v1';
type GameContextValue = {
  state: GameState;
  loaded: boolean;
  hatchNow: () => void;
  sellOne: (id: string) => void;
  selectSpecies: (id: string) => void;
  buyUpgrade: (id: string) => void;
  expandTank: () => void;
};
const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY).then((raw) => {
      if (!raw) return;
      const saved = { ...initialState, ...JSON.parse(raw) } as GameState;
      const offline = calculateOfflineHatches(saved);
      setState({ ...saved, shrimp: { ...saved.shrimp, [saved.selectedSpecies]: (saved.shrimp[saved.selectedSpecies] ?? 0) + offline }, lastUpdatedAt: Date.now() });
    }).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const value = useMemo<GameContextValue>(() => ({
    state,
    loaded,
    hatchNow: () => { setState(hatch); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); },
    sellOne: (id) => { setState((current) => sell(current, id)); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); },
    selectSpecies: (id) => setState((current) => ({ ...current, selectedSpecies: id, lastUpdatedAt: Date.now() })),
    buyUpgrade: (id) => setState((current) => {
      const item = upgrades.find((upgrade) => upgrade.id === id);
      if (!item) return current;
      const cost = upgradeCost(item.baseCost, current.upgrades[id] ?? 0);
      if (current.cash < cost) return current;
      return { ...current, cash: current.cash - cost, upgrades: { ...current.upgrades, [id]: (current.upgrades[id] ?? 0) + 1 } };
    }),
    expandTank: () => setState((current) => {
      const cost = Math.round(75 * Math.pow(1.45, Math.max(0, (current.tankCapacity - 20) / 10)));
      if (current.cash < cost) return current;
      return { ...current, cash: current.cash - cost, tankCapacity: current.tankCapacity + 10 };
    }),
  }), [state, loaded]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
};
