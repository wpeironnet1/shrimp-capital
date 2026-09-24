import { habitatPoseFor } from '../aquariumChoreography';
import { personalityFor } from '../personality';

const SHRIMP = Array.from({ length: 80 }, (_, index) => `habitat-shrimp-${index}`);

describe('personality-driven habitat life', () => {
  it('gives the visible population a broad mix of aquarium destinations', () => {
    const zones = new Set(SHRIMP.map(seed => habitatPoseFor(seed, 0).zone));
    expect(zones.size).toBeGreaterThanOrEqual(4);
  });

  it('lets individual shrimp change activities over time instead of looping one lane forever', () => {
    for (const seed of SHRIMP.slice(0, 32)) {
      const behaviors = new Set(Array.from({ length: 8 }, (_, cycle) => habitatPoseFor(seed, cycle).behavior));
      expect(behaviors.size).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps temperament visible in habitat speed and dwell time', () => {
    const samples = SHRIMP.map(seed => ({ profile: personalityFor(seed), pose: habitatPoseFor(seed, 2) }));
    const fast = samples.filter(({ profile }) => ['Hyper', 'Intern', 'Paper Hands'].includes(profile.name));
    const patient = samples.filter(({ profile }) => ['Lazy', 'Diamond Hands'].includes(profile.name));

    expect(fast.length).toBeGreaterThan(0);
    expect(patient.length).toBeGreaterThan(0);
    expect(Math.max(...fast.map(({ pose }) => pose.speedScale))).toBeGreaterThan(
      Math.min(...patient.map(({ pose }) => pose.speedScale)),
    );
    expect(Math.max(...patient.map(({ pose }) => pose.dwellMs))).toBeGreaterThan(
      Math.min(...fast.map(({ pose }) => pose.dwellMs)),
    );
  });

  it('keeps every generated habitat pose inside safe animation bounds', () => {
    for (const seed of SHRIMP) {
      for (let cycle = 0; cycle < 12; cycle += 1) {
        const pose = habitatPoseFor(seed, cycle);
        expect(pose.xBias).toBeGreaterThanOrEqual(-1);
        expect(pose.xBias).toBeLessThanOrEqual(1);
        expect(pose.yBias).toBeGreaterThanOrEqual(-1);
        expect(pose.yBias).toBeLessThanOrEqual(1);
        expect(pose.dwellMs).toBeGreaterThanOrEqual(1000);
        expect(pose.speedScale).toBeGreaterThanOrEqual(.18);
        expect(pose.speedScale).toBeLessThanOrEqual(1.7);
        expect(pose.bubbleChance).toBeGreaterThanOrEqual(.03);
        expect(pose.bubbleChance).toBeLessThanOrEqual(.72);
      }
    }
  });
});
