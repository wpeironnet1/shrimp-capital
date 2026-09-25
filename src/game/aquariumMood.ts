export type AquariumMood = 'calm' | 'busy' | 'celebration';

export function aquariumMood(population: number, eventActive: boolean): AquariumMood {
  if (eventActive) return 'celebration';
  if (population >= 6) return 'busy';
  return 'calm';
}

export function ambientParticleCount(mood: AquariumMood): number {
  if (mood === 'celebration') return 18;
  if (mood === 'busy') return 12;
  return 8;
}
