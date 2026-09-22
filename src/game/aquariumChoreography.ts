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

export function socialMomentDelay(seed:string,cycle=0){
  const profile=personalityFor(seed);
  const social=profile.name==='Social'||profile.name==='Rainmaker'||profile.name==='Market Maker';
  const base=social?13000:21000;
  return Math.round(base+unit(`${seed}-${Math.max(0,cycle)}-social`)*(social?9000:17000));
}
