export type ShrimpSpecies = {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  emoji: string;
  basePrice: number;
  hatchSeconds: number;
  unlockLevel: number;
  color: string;
};

export const species: ShrimpSpecies[] = [
  { id: 'cherry', name: 'Cherry Shrimp', rarity: 'Common', emoji: '🦐', basePrice: 3, hatchSeconds: 8, unlockLevel: 1, color: '#FF6B5E' },
  { id: 'blue-dream', name: 'Blue Dream', rarity: 'Uncommon', emoji: '🦐', basePrice: 9, hatchSeconds: 20, unlockLevel: 2, color: '#52B6FF' },
  { id: 'crystal-red', name: 'Crystal Red', rarity: 'Rare', emoji: '🦐', basePrice: 28, hatchSeconds: 50, unlockLevel: 4, color: '#FFF4D6' },
  { id: 'galaxy-tiger', name: 'Galaxy Tiger', rarity: 'Legendary', emoji: '🦐', basePrice: 120, hatchSeconds: 150, unlockLevel: 7, color: '#B58CFF' },
];

export const upgrades = [
  { id: 'filter', name: 'Suspiciously Good Filter', detail: '+20% production', icon: 'water', baseCost: 50 },
  { id: 'heater', name: 'Wall Street Heater', detail: '+15% hatch speed', icon: 'thermometer', baseCost: 90 },
  { id: 'algae', name: 'Artisanal Algae', detail: '+25% sale value', icon: 'leaf', baseCost: 160 },
] as const;

export type MissionMetric = 'hatched' | 'sold' | 'upgradesBought';
export const missions = [
  { id: 'first-brood', title: 'Seed the portfolio', detail: 'Hatch 10 shrimp', metric: 'hatched', target: 10, reward: 30 },
  { id: 'liquidity-event', title: 'Create a liquidity event', detail: 'Sell 8 shrimp', metric: 'sold', target: 8, reward: 45 },
  { id: 'capex-cycle', title: 'Invest in infrastructure', detail: 'Buy 2 upgrades', metric: 'upgradesBought', target: 2, reward: 80 },
] satisfies Array<{ id: string; title: string; detail: string; metric: MissionMetric; target: number; reward: number }>;
