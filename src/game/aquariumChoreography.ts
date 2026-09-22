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
function tankPopulation(seed:string){const match=/^tank-(\d+)$/.exec(seed);return match?Math.max(0,Math.min(12,Number(match[1]))):undefined;}

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
 * Group spectacle cadence scales aggressively with visible population. A three-shrimp
 * startup still gets breathing room, while a mature twelve-shrimp fund now produces a
 * coordinated moment roughly every 10–16 seconds. This makes progression visible in
 * the aquarium itself without adding UI, persistence, or save-migration risk.
 */
export function socialMomentDelay(seed:string,cycle=0){
  const population=tankPopulation(seed);
  if(population!==undefined){
    const fullness=Math.max(0,Math.min(1,(population-3)/9));
    const base=20500-fullness*10500;
    const span=9500-fullness*3500;
    return Math.round(base+unit(`${seed}-${Math.max(0,cycle)}-social`)*span);
  }
  const profile=personalityFor(seed);
  const social=profile.name==='Social'||profile.name==='Rainmaker'||profile.name==='Market Maker';
  const base=social?10500:16000;
  const span=social?7500:12000;
  return Math.round(base+unit(`${seed}-${Math.max(0,cycle)}-social`)*span);
}

/**
 * Whole-tank moments become more exuberant as the fund grows. Startup tanks cycle
 * evenly through the four signatures. Mid-size tanks earn an extra feeding rush;
 * mature tanks add extra bubble rallies and market panics. Their actual choreography
 * also scales with population: fuller funds spread farther, throw more bubbles, hold
 * the spectacle a little longer, and fire reactions faster. Progress is therefore
 * visible in the aquarium itself rather than hidden behind another meter or menu.
 */
export function socialMomentFor(seed:string,cycle=0):SocialMoment{
  const safeCycle=Math.max(0,Math.floor(cycle));
  const population=tankPopulation(seed)??0;
  const reel:SocialMomentKind[]=population>=9
    ? ['school-run','feeding-rush','bubble-rally','market-panic','bubble-rally','market-panic']
    : population>=6
      ? ['school-run','feeding-rush','bubble-rally','market-panic','feeding-rush']
      : ['school-run','feeding-rush','bubble-rally','market-panic'];
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
  const maturity=Math.max(0,Math.min(1,(population-3)/9));
  const intensity=1+maturity*.28;
  return {
    ...moment,
    kind,
    durationMs:Math.round(moment.durationMs*jitter*(1+maturity*.12)),
    spread:Math.min(1,moment.spread*(1+maturity*.18)),
    bubbleIntensity:Math.min(1.35,moment.bubbleIntensity*intensity),
    reactionCadenceMs:Math.max(62,Math.round(moment.reactionCadenceMs*(1-maturity*.24))),
  };
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
