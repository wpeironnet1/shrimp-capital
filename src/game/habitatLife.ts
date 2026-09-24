import { habitatBehaviorFor, ShrimpHabitatBehavior } from './personality';

export type HabitatLifeBeat = {
  behavior: ShrimpHabitatBehavior;
  pauseMs: number;
  horizontalBias: number;
  verticalBias: number;
  bubbleBurst: boolean;
  propFocus: 'substrate' | 'plant' | 'equipment' | 'school' | null;
};

function hashSeed(seed:string){let hash=2166136261;for(let i=0;i<seed.length;i+=1){hash^=seed.charCodeAt(i);hash=Math.imul(hash,16777619);}return hash>>>0;}

/**
 * Deterministic aquarium-life choreography for a visible shrimp. This intentionally
 * contains no saved state: animation cycles can become richer without changing or
 * migrating a player's economy/save payload.
 */
export function habitatLifeBeatFor(seed:string,cycle=0):HabitatLifeBeat{
  const behavior=habitatBehaviorFor(seed,cycle);
  const jitter=hashSeed(`${seed}-life-${cycle}`);
  const direction=jitter%2===0?1:-1;
  const pauseJitter=jitter%1800;
  switch(behavior){
    case 'graze': return {behavior,pauseMs:2200+pauseJitter,horizontalBias:direction*(8+jitter%14),verticalBias:30,bubbleBurst:false,propFocus:'substrate'};
    case 'hide': return {behavior,pauseMs:3800+pauseJitter,horizontalBias:direction*(24+jitter%18),verticalBias:18,bubbleBurst:false,propFocus:'plant'};
    case 'rest': return {behavior,pauseMs:5200+pauseJitter,horizontalBias:direction*(3+jitter%7),verticalBias:22,bubbleBurst:jitter%5===0,propFocus:null};
    case 'inspect': return {behavior,pauseMs:2600+pauseJitter,horizontalBias:direction*(18+jitter%20),verticalBias:direction*(jitter%9),bubbleBurst:jitter%4===0,propFocus:'equipment'};
    case 'school': return {behavior,pauseMs:1800+pauseJitter,horizontalBias:direction*(28+jitter%26),verticalBias:direction*(5+jitter%12),bubbleBurst:jitter%3===0,propFocus:'school'};
    case 'patrol':
    default: return {behavior,pauseMs:1400+pauseJitter,horizontalBias:direction*(38+jitter%32),verticalBias:direction*(4+jitter%10),bubbleBurst:jitter%6===0,propFocus:null};
  }
}

export function habitatLifeSequence(seed:string,length=6){return Array.from({length:Math.max(1,length)},(_,cycle)=>habitatLifeBeatFor(seed,cycle));}
