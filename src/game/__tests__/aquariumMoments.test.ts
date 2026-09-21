import { allAquariumMoments, aquariumMomentCue, aquariumMomentFor } from '../aquariumMoments';

describe('aquarium spectacle choreography', () => {
  it('keeps the ambient spectacle set varied and finance-themed', () => {
    const moments = allAquariumMoments();
    expect(moments.length).toBeGreaterThanOrEqual(5);
    expect(new Set(moments.map(moment => moment.reaction)).size).toBeGreaterThanOrEqual(5);
    expect(moments.map(moment => moment.kind)).toEqual(expect.arrayContaining([
      'opening-bell',
      'feeding-frenzy',
      'flash-crash',
      'bonus-bubble',
      'closing-bell',
    ]));
  });

  it('selects ambient moments deterministically so animation state is stable across renders', () => {
    for (let index = 0; index < 40; index += 1) {
      const seed = `tank-session-${index}`;
      expect(aquariumMomentFor(seed)).toEqual(aquariumMomentFor(seed));
    }
  });

  it('stages a school as a readable wave rather than firing every shrimp simultaneously', () => {
    const moment = allAquariumMoments()[0];
    const cues = Array.from({ length: 10 }, (_, index) => aquariumMomentCue(moment, `school-${index}`, index));
    expect(new Set(cues.map(cue => cue.delayMs)).size).toBeGreaterThanOrEqual(8);
    expect(Math.max(...cues.map(cue => cue.delayMs))).toBeGreaterThan(Math.min(...cues.map(cue => cue.delayMs)) + 300);
  });

  it('lets rare-accessory shrimp become strong spotlight actors without erasing school variety', () => {
    for (const moment of allAquariumMoments()) {
      const normal = Array.from({ length: 12 }, (_, index) => aquariumMomentCue(moment, `normal-${index}`, index, false));
      const equipped = Array.from({ length: 12 }, (_, index) => aquariumMomentCue(moment, `equipped-${index}`, index, true));
      expect(equipped.every(cue => cue.intensity === 'strong')).toBe(true);
      expect(equipped.some(cue => cue.reaction === 'accessory')).toBe(true);
      expect(new Set([...normal, ...equipped].map(cue => cue.reaction)).size).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps flash-crash choreography urgent and visually strong', () => {
    const crash = allAquariumMoments().find(moment => moment.kind === 'flash-crash');
    expect(crash).toBeDefined();
    const cues = Array.from({ length: 8 }, (_, index) => aquariumMomentCue(crash!, `crash-${index}`, index));
    expect(cues.every(cue => cue.intensity === 'strong')).toBe(true);
    expect(cues.some(cue => cue.reaction === 'reverse')).toBe(true);
    expect(cues.some(cue => cue.reaction === 'dart')).toBe(true);
  });
});
