import { aquariumSocialPlan } from './aquariumLife';
import { socialActorCue, socialParticipantCount } from './socialChoreography';

describe('social aquarium choreography', () => {
  it('keeps crowded spectacles bounded to the visual population', () => {
    expect(socialParticipantCount(80, 12)).toBe(12);
    expect(socialParticipantCount(5, 12)).toBe(5);
    expect(socialParticipantCount(0, 12)).toBe(0);
  });

  it('staggers actors and gives a single middle actor the spotlight', () => {
    const plan = aquariumSocialPlan('launch-tank', 2, 9);
    const cues = Array.from({ length: 9 }, (_, index) => socialActorCue(plan, index, 9));

    expect(cues.filter(cue => cue.spotlight)).toHaveLength(1);
    expect(cues[4].spotlight).toBe(true);
    expect(new Set(cues.map(cue => cue.delayMs)).size).toBeGreaterThan(2);
    expect(cues.every(cue => cue.emphasis >= .7 && cue.emphasis <= 1.35)).toBe(true);
  });

  it('alternates lead and echo behavior so a school does not look cloned', () => {
    const plan = aquariumSocialPlan('trading-floor', 4, 8);
    const cues = Array.from({ length: 8 }, (_, index) => socialActorCue(plan, index, 8));

    expect(cues.some(cue => cue.beat === plan.leadBeat)).toBe(true);
    expect(cues.some(cue => cue.beat === plan.echoBeat)).toBe(true);
  });

  it('turns bubble and feeding moments into visible per-shrimp effects', () => {
    const bubblePlan = { ...aquariumSocialPlan('fx', 0, 6), fx: 'bubbles' as const };
    const feedingPlan = { ...bubblePlan, fx: 'crumbs' as const };

    expect(Array.from({ length: 6 }, (_, i) => socialActorCue(bubblePlan, i, 6)).every(cue => cue.bubbleBurst)).toBe(true);
    expect(Array.from({ length: 6 }, (_, i) => socialActorCue(feedingPlan, i, 6)).filter(cue => cue.bubbleBurst)).toHaveLength(2);
  });
});
