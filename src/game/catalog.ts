export type ShrimpSpecies = {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Exotic';
  emoji: string;
  basePrice: number;
  hatchSeconds: number;
  unlockLevel: number;
  color: string;
  accentColor: string;
  pattern: 'solid' | 'banded' | 'striped' | 'spotted';
  trait?: 'long-whiskers' | 'fan-tail' | 'claws' | 'crown';
};

export const species: ShrimpSpecies[] = [
  { id: 'cherry', name: 'Cherry Shrimp', rarity: 'Common', emoji: '🦐', basePrice: 3, hatchSeconds: 8, unlockLevel: 1, color: '#FF6B5E', accentColor: '#FFB29F', pattern: 'solid' },
  { id: 'snowball', name: 'Snowball Pearl', rarity: 'Common', emoji: '🦐', basePrice: 5, hatchSeconds: 11, unlockLevel: 2, color: '#E9F8F4', accentColor: '#A7D8DD', pattern: 'solid' },
  { id: 'goldenback', name: 'Yellow Goldenback', rarity: 'Common', emoji: '🦐', basePrice: 8, hatchSeconds: 15, unlockLevel: 3, color: '#FFD447', accentColor: '#FFF2A8', pattern: 'striped' },
  { id: 'orange-sakura', name: 'Orange Sakura', rarity: 'Uncommon', emoji: '🦐', basePrice: 13, hatchSeconds: 21, unlockLevel: 4, color: '#FF8A3D', accentColor: '#FFD09A', pattern: 'solid' },
  { id: 'blue-dream', name: 'Blue Dream', rarity: 'Uncommon', emoji: '🦐', basePrice: 21, hatchSeconds: 30, unlockLevel: 5, color: '#52B6FF', accentColor: '#BDE9FF', pattern: 'solid' },
  { id: 'green-jade', name: 'Green Jade', rarity: 'Uncommon', emoji: '🦐', basePrice: 34, hatchSeconds: 42, unlockLevel: 7, color: '#46C98B', accentColor: '#B6F4C7', pattern: 'spotted' },
  { id: 'amano', name: 'Amano Grazer', rarity: 'Rare', emoji: '🦐', basePrice: 55, hatchSeconds: 55, unlockLevel: 9, color: '#B7A98B', accentColor: '#503F31', pattern: 'spotted', trait: 'long-whiskers' },
  { id: 'crystal-red', name: 'Crystal Red', rarity: 'Rare', emoji: '🦐', basePrice: 90, hatchSeconds: 72, unlockLevel: 11, color: '#F15B5A', accentColor: '#FFF4D6', pattern: 'banded', trait: 'fan-tail' },
  { id: 'crystal-black', name: 'Crystal Black', rarity: 'Rare', emoji: '🦐', basePrice: 145, hatchSeconds: 95, unlockLevel: 13, color: '#242D35', accentColor: '#F4F0DA', pattern: 'banded' },
  { id: 'blue-bolt', name: 'Blue Bolt', rarity: 'Rare', emoji: '🦐', basePrice: 235, hatchSeconds: 125, unlockLevel: 15, color: '#DDF8FF', accentColor: '#3A91E8', pattern: 'spotted' },
  { id: 'black-king-kong', name: 'Black King Kong', rarity: 'Epic', emoji: '🦐', basePrice: 380, hatchSeconds: 165, unlockLevel: 18, color: '#16191E', accentColor: '#F2E8D3', pattern: 'banded', trait: 'claws' },
  { id: 'fancy-tiger', name: 'Red Fancy Tiger', rarity: 'Epic', emoji: '🦐', basePrice: 610, hatchSeconds: 215, unlockLevel: 21, color: '#EF4D4D', accentColor: '#2B1619', pattern: 'striped' },
  { id: 'shadow-panda', name: 'Shadow Panda', rarity: 'Epic', emoji: '🦐', basePrice: 980, hatchSeconds: 280, unlockLevel: 24, color: '#27334A', accentColor: '#D6EDFF', pattern: 'banded' },
  { id: 'galaxy-fishbone', name: 'Galaxy Fishbone', rarity: 'Epic', emoji: '🦐', basePrice: 1550, hatchSeconds: 360, unlockLevel: 27, color: '#5A2A82', accentColor: '#E4C5FF', pattern: 'striped', trait: 'long-whiskers' },
  { id: 'metallic-purple', name: 'Metallic Purple', rarity: 'Legendary', emoji: '🦐', basePrice: 2500, hatchSeconds: 460, unlockLevel: 31, color: '#9A63D7', accentColor: '#F0D4FF', pattern: 'solid', trait: 'fan-tail' },
  { id: 'red-galaxy-boa', name: 'Red Galaxy Boa', rarity: 'Legendary', emoji: '🦐', basePrice: 4000, hatchSeconds: 580, unlockLevel: 35, color: '#C7274C', accentColor: '#FFE29C', pattern: 'spotted', trait: 'claws' },
  { id: 'blue-steel-boa', name: 'Blue Steel Boa', rarity: 'Legendary', emoji: '🦐', basePrice: 6500, hatchSeconds: 720, unlockLevel: 39, color: '#3D7699', accentColor: '#D9F7FF', pattern: 'spotted', trait: 'claws' },
  { id: 'calceo-dragon', name: 'Calceo Dragon', rarity: 'Legendary', emoji: '🦐', basePrice: 10500, hatchSeconds: 880, unlockLevel: 43, color: '#E9E2C2', accentColor: '#8B2F3D', pattern: 'striped', trait: 'long-whiskers' },
  { id: 'golden-galaxy', name: 'Golden Galaxy', rarity: 'Mythic', emoji: '🦐', basePrice: 17000, hatchSeconds: 1050, unlockLevel: 48, color: '#E7B83D', accentColor: '#FFF7B5', pattern: 'spotted', trait: 'crown' },
  { id: 'aurora-bolt', name: 'Aurora Bolt', rarity: 'Mythic', emoji: '🦐', basePrice: 27500, hatchSeconds: 1250, unlockLevel: 53, color: '#54D6C7', accentColor: '#D599FF', pattern: 'banded', trait: 'fan-tail' },
  { id: 'void-tiger', name: 'Void Tiger', rarity: 'Mythic', emoji: '🦐', basePrice: 44000, hatchSeconds: 1500, unlockLevel: 58, color: '#21133A', accentColor: '#F36CFF', pattern: 'striped', trait: 'claws' },
  { id: 'stardust-boa', name: 'Stardust Boa', rarity: 'Exotic', emoji: '🦐', basePrice: 71000, hatchSeconds: 1800, unlockLevel: 64, color: '#6A78E8', accentColor: '#FFF2D1', pattern: 'spotted', trait: 'long-whiskers' },
  { id: 'solar-flare', name: 'Solar Flare', rarity: 'Exotic', emoji: '🦐', basePrice: 115000, hatchSeconds: 2200, unlockLevel: 70, color: '#FF5B31', accentColor: '#FFE566', pattern: 'striped', trait: 'claws' },
  { id: 'crown-jewel', name: 'Crown Jewel', rarity: 'Exotic', emoji: '🦐', basePrice: 185000, hatchSeconds: 2700, unlockLevel: 77, color: '#B46BFF', accentColor: '#7DFFF1', pattern: 'banded', trait: 'crown' },
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
