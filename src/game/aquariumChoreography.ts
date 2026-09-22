import { ShrimpHabitatBehavior, habitatBehaviorFor, personalityFor } from './personality';

export type HabitatZone = 'open-water' | 'substrate' | 'plants' | 'equipment' | 'school';
export type HabitatPose = {
  behavior: ShrimpHabitatBehavior;
  zone: HabitatZone;
  xBias: number;
  yBias: number;
  dwellMs: number;
  bubbleChance: number;
  speedScale: number;
};
export type SocialMomentKind='school-run'|'feeding-rush'|'bubble-rally'|'market-panic';
export type SocialMoment={kind:SocialMomentKind;durationMs:number;spread:number;verticalBias:number;bubbleIntensity:number;reactionCadenceMs:number};

function hashSeed(seed:string){let hash=2166136261;for(let i=0;i<seed.length;i+=1){hash^=seed.charCodeAt(i);hash=Math.imul(hash,16777619);}return hash>>>0;}
function unit(seed:string){return (hashSeed(seed)%1000)/999;}
function signed(seed:string){return unit(seed)*2-1;}

/**
 * Stable, animation-only habitat choreography. Nothing here is persisted, so adding
 * richer aquarium life cannot invalidate saves. Actors can advance `cycle` whenever
 * a dwell period completes and receive a new personality-appropriate destination.
 */
export function habitatPoseFor(seed:string,cycle=0):HabitatPose{
  const safeCycle=Math.max(0,Math.floor(cycle));
  const behavior=habitatBehaviorFor(seed,safeCycle);
  const profile=personalityFor(seed);
  const jitterX=signed(`${seed}-${safeCycle}-x`);
  const jitterY=signed(`${seed}-${safeCycle}-y`);
  const dwellJitter=.82+unit(`${seed}-${safeCycle}-dwell`)*.38;
  const base:Record<ShrimpHabitatBehavior,Omit<HabitatPose,'behavior'>>={
    patrol:{zone:'open-water',xBias:jitterX*.95,yBias:jitterY*.48,dwellMs:4200,bubbleChance:.12,speedScale:1.18},
    graze:{zone:'substrate',xBias:jitterX*.82,yBias:.72+jitterY*.12,dwellMs:6200,bubbleChance:.22,speedScale:.62},
    hide:{zone:'plants',xBias:jitterX<0?-.82:.82,yBias:.28+jitterY*.18,dwellMs:7600,bubbleChance:.08,speedScale:.42},
    rest:{zone:'substrate',xBias:jitterX*.48,yBias:.82+jitterY*.08,dwellMs:9200,bubbleChance:.05,speedScale:.24},
    inspect:{zone:'equipment',xBias:.72+jitterX*.14,yBias:-.12+jitterY*.22,dwellMs:5600,bubbleChance:.18,speedScale:.7},
    school:{zone:'school',xBias:jitterX*.28,yBias:jitterY*.2,dwellMs:5000,bubbleChance:.32,speedScale:.9},
  };
  const pose=base[behavior];
  const fastTemperament=profile.name==='Hyper'||profile.name==='Intern'||profile.name==='Paper Hands';
  const patientTemperament=profile.name==='Lazy'||profile.name==='Diamond Hands';
  const temperament=fastTemperament ? .78 : patientTemperament ? 1.28 : 1;
  return {...pose,behavior,dwellMs:Math.round(pose.dwellMs*dwellJitter*temperament)};
}

/**
 * Keep the tank visibly alive without turning it into constant visual noise. Social
 * personalities create moments more often, while every stocked tank still gets a
 * recognizable group beat roughly every 16-28 seconds after the first event.
 */
export function socialMomentDelay(seed:string,cycle=0){
  const profile=personalityFor(seed);
  const social=profile.name==='Social'||profile.name==='Rainmaker'||profile.name==='Market Maker';
  const base=social?10500:16000;
  const span=social?7500:12000;
  return Math.round(base+unit(`${seed}-${Math.max(0,cycle)}-social`)*span);
}

/**
 * Whole-tank moments make the aquarium feel social without touching economy or save
 * state. Each four-event reel contains every signature spectacle exactly once, in a
 * deterministic tank-specific order. That prevents an unlucky random streak from
 * making the aquarium look repetitive while preserving variation between tanks.
 */
export function socialMomentFor(seed:string,cycle=0):SocialMoment{
  const safeCycle=Math.max(0,Math.floor(cycle));
  const reel:SocialMomentKind[]=['school-run','feeding-rush','bubble-rally','market-panic'];
  const reelIndex=safeCycle%reel.length;
  const reelNumber=Math.floor(safeCycle/reel.length);
  const rotation=hashSeed(`${seed}-${reelNumber}-reel`)%reel.length;
  const direction=hashSeed(`${seed}-${reelNumber}-direction`)%2===0?1:-1;
  const kind=reel[(rotation+direction*reelIndex+reel.length*2)%reel.length];
  const jitter=.88+unit(`${seed}-${safeCycle}-moment-jitter`)*.24;
  const base:Record<SocialMomentKind,Omit<SocialMoment,'kind'>>={
    'school-run':{durationMs:4100,spread:.30,verticalBias:-.08,bubbleIntensity:.42,reactionCadenceMs:170},
    'feeding-rush':{durationMs:3500,spread:.44,verticalBias:-.54,bubbleIntensity:.58,reactionCadenceMs:120},
    'bubble-rally':{durationMs:4500,spread:.60,verticalBias:.02,bubbleIntensity:1,reactionCadenceMs:205},
    'market-panic':{durationMs:3000,spread:.96,verticalBias:.14,bubbleIntensity:.78,reactionCadenceMs:85},
  };
  const moment=base[kind];
  return {...moment,kind,durationMs:Math.round(moment.durationMs*jitter)};
}

export function socialFormationOffset(index:number,total:number,moment:SocialMoment){
  const safeTotal=Math.max(1,Math.floor(total));
  const safeIndex=Math.max(0,Math.min(safeTotal-1,Math.floor(index)));
  const centered=safeTotal===1?0:(safeIndex/(safeTotal-1))*2-1;
  const alternating=safeIndex%2===0?1:-1;
  if(moment.kind==='market-panic')return {x:centered*moment.spread,y:moment.verticalBias+alternating*.34};
  if(moment.kind==='feeding-rush')return {x:centered*moment.spread*.55,y:moment.verticalBias+Math.abs(centered)*.16};
  if(moment.kind==='bubble-rally')return {x:centered*moment.spread,y:moment.verticalBias+alternating*.12};
  return {x:centered*moment.spread,y:moment.verticalBias+Math.abs(centered)*.08};
}
