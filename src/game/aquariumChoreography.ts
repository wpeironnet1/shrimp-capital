import { ShrimpHabitatBehavior, habitatBehaviorFor, personalityFor } from './personality';

export type HabitatZone='open-water'|'substrate'|'plants'|'equipment'|'school';
export type HabitatPose={behavior:ShrimpHabitatBehavior;zone:HabitatZone;xBias:number;yBias:number;dwellMs:number;bubbleChance:number;speedScale:number};
export type SocialMomentKind='school-run'|'feeding-rush'|'bubble-rally'|'market-panic';
export type SocialMoment={kind:SocialMomentKind;durationMs:number;spread:number;verticalBias:number;bubbleIntensity:number;reactionCadenceMs:number};

function hashSeed(seed:string){let hash=2166136261;for(let i=0;i<seed.length;i+=1){hash^=seed.charCodeAt(i);hash=Math.imul(hash,16777619);}return hash>>>0;}
function unit(seed:string){return(hashSeed(seed)%1000)/999;}
function signed(seed:string){return unit(seed)*2-1;}
function tankPopulation(seed:string){const match=/^tank-(\d+)$/.exec(seed);return match?Math.max(0,Math.min(12,Number(match[1]))):undefined;}

export function habitatPoseFor(seed:string,cycle=0):HabitatPose{
  const safeCycle=Math.max(0,Math.floor(cycle)),behavior=habitatBehaviorFor(seed,safeCycle),profile=personalityFor(seed),jitterX=signed(`${seed}-${safeCycle}-x`),jitterY=signed(`${seed}-${safeCycle}-y`),dwellJitter=.82+unit(`${seed}-${safeCycle}-dwell`)*.38;
  const base:Record<ShrimpHabitatBehavior,Omit<HabitatPose,'behavior'>>={
    patrol:{zone:'open-water',xBias:jitterX*.95,yBias:jitterY*.48,dwellMs:4200,bubbleChance:.12,speedScale:1.18},
    graze:{zone:'substrate',xBias:jitterX*.82,yBias:.72+jitterY*.12,dwellMs:6200,bubbleChance:.22,speedScale:.62},
    hide:{zone:'plants',xBias:jitterX<0?-.82:.82,yBias:.28+jitterY*.18,dwellMs:7600,bubbleChance:.08,speedScale:.42},
    rest:{zone:'substrate',xBias:jitterX*.48,yBias:.82+jitterY*.08,dwellMs:9200,bubbleChance:.05,speedScale:.24},
    inspect:{zone:'equipment',xBias:.72+jitterX*.14,yBias:-.12+jitterY*.22,dwellMs:5600,bubbleChance:.18,speedScale:.7},
    school:{zone:'school',xBias:jitterX*.28,yBias:jitterY*.2,dwellMs:5000,bubbleChance:.32,speedScale:.9},
  };
  const pose=base[behavior],fast=profile.name==='Hyper'||profile.name==='Intern'||profile.name==='Paper Hands',patient=profile.name==='Lazy'||profile.name==='Diamond Hands',social=profile.name==='Social'||profile.name==='Rainmaker'||profile.name==='Market Maker',forager=profile.name==='Greedy'||profile.name==='Curious',temperament=fast?.78:patient?1.28:1;
  const speedTemperament=fast?1.38:patient?.62:social?1.16:forager?1.08:1;
  const bubbleTemperament=social?1.72:forager?1.38:fast?1.2:patient?.72:1;
  return{...pose,behavior,dwellMs:Math.round(pose.dwellMs*dwellJitter*temperament),speedScale:Math.max(.18,Math.min(1.7,pose.speedScale*speedTemperament)),bubbleChance:Math.max(.03,Math.min(.72,pose.bubbleChance*bubbleTemperament))};
}

export function socialMomentDelay(seed:string,cycle=0){
  const population=tankPopulation(seed);
  if(population!==undefined){
    const fullness=Math.max(0,Math.min(1,(population-3)/9));
    const base=21500-fullness*6500;
    const span=8500-fullness*4500;
    return Math.round(base+unit(`${seed}-${Math.max(0,cycle)}-social`)*span);
  }
  const profile=personalityFor(seed),social=profile.name==='Social'||profile.name==='Rainmaker'||profile.name==='Market Maker';
  return Math.round((social?10500:16000)+unit(`${seed}-${Math.max(0,cycle)}-social`)*(social?7500:12000));
}

export function socialMomentFor(seed:string,cycle=0):SocialMoment{
  const safeCycle=Math.max(0,Math.floor(cycle)),population=tankPopulation(seed)??0;
  const reel:SocialMomentKind[]=population>=12
    ?['school-run','market-panic','school-run','bubble-rally','feeding-rush','school-run','market-panic','bubble-rally','school-run','feeding-rush','market-panic','school-run']
    :population>=11
      ?['school-run','bubble-rally','market-panic','feeding-rush','school-run','bubble-rally','market-panic','feeding-rush','bubble-rally','market-panic']
      :population>=9
        ?['school-run','feeding-rush','bubble-rally','market-panic','school-run','bubble-rally','feeding-rush','market-panic']
        :population>=6
          ?['school-run','feeding-rush','bubble-rally','market-panic','school-run','bubble-rally']
          :['school-run','feeding-rush','bubble-rally','market-panic'];
  const reelIndex=safeCycle%reel.length,reelNumber=Math.floor(safeCycle/reel.length),rotation=hashSeed(`${seed}-${reelNumber}-reel`)%reel.length,direction=hashSeed(`${seed}-${reelNumber}-direction`)%2===0?1:-1,kind=reel[(rotation+direction*reelIndex+reel.length*2)%reel.length],jitter=.88+unit(`${seed}-${safeCycle}-moment-jitter`)*.24;
  const base:Record<SocialMomentKind,Omit<SocialMoment,'kind'>>={
    'school-run':{durationMs:4600,spread:.34,verticalBias:-.10,bubbleIntensity:.38,reactionCadenceMs:180},
    'feeding-rush':{durationMs:3600,spread:.58,verticalBias:-.64,bubbleIntensity:.82,reactionCadenceMs:98},
    'bubble-rally':{durationMs:5000,spread:.76,verticalBias:.00,bubbleIntensity:1.34,reactionCadenceMs:164},
    'market-panic':{durationMs:2900,spread:1,verticalBias:.14,bubbleIntensity:1.02,reactionCadenceMs:64},
  };
  const moment=base[kind],maturity=Math.max(0,Math.min(1,(population-3)/9));
  const fullTank=population>=12?1.42:population>=10?1.18:1;
  const kindPunch=kind==='market-panic'?1.18:kind==='bubble-rally'?1.12:kind==='feeding-rush'?1.06:.9;
  const spectacle=(1+maturity*.68)*fullTank*kindPunch;
  return{
    ...moment,
    kind,
    durationMs:Math.round(moment.durationMs*jitter*(kind==='school-run'?1+maturity*.12:1+maturity*.05)),
    spread:Math.min(1,moment.spread*(1+maturity*.38)*(kind==='school-run'?1:fullTank)),
    bubbleIntensity:Math.min(2.25,moment.bubbleIntensity*spectacle),
    reactionCadenceMs:Math.max(36,Math.round(moment.reactionCadenceMs*(1-maturity*.44)/(kind==='school-run'?1:fullTank))),
  };
}

export function socialFormationOffset(index:number,total:number,moment:SocialMoment){
  const safeTotal=Math.max(1,Math.floor(total)),safeIndex=Math.max(0,Math.min(safeTotal-1,Math.floor(index))),centered=safeTotal===1?0:(safeIndex/(safeTotal-1))*2-1,alternating=safeIndex%2===0?1:-1;
  // Each desk-wide beat gets its own readable silhouette. At a glance the player should
  // be able to tell a feeding scrum from a bubble celebration or a market panic.
  if(moment.kind==='market-panic'){
    // Split the desk into two opposing diagonal selloff waves instead of generic jitter.
    const side=centered<0?-1:1,withinSide=(safeIndex%(Math.ceil(safeTotal/2)))/Math.max(1,Math.ceil(safeTotal/2)-1);
    const x=side*(.28+withinSide*.72)*moment.spread;
    const y=moment.verticalBias+alternating*.46-centered*.24;
    return{x,y};
  }
  if(moment.kind==='feeding-rush'){
    // Funnel everyone tightly toward the surface/feeding point, with outer shrimp trailing.
    const funnel=Math.pow(Math.abs(centered),1.35)*.38;
    return{x:centered*moment.spread*.46,y:moment.verticalBias+funnel+alternating*.028};
  }
  if(moment.kind==='bubble-rally'){
    // A broad celebratory sine wave reads like a miniature ticker ribbon across the tank.
    const wave=Math.sin((centered+.08)*Math.PI*1.55)*.34;
    const edgeLift=-Math.pow(Math.abs(centered),1.7)*.10;
    return{x:centered*moment.spread,y:moment.verticalBias+wave+edgeLift+alternating*.045};
  }
  // School runs form a clean Wall-Street-chevron: leader forward, wings tucked behind.
  const chevron=Math.pow(Math.abs(centered),1.15)*.24;
  const leader=safeIndex===Math.floor((safeTotal-1)/2)?-.10:0;
  const ripple=safeTotal>=5?alternating*.035:0;
  return{x:centered*moment.spread,y:moment.verticalBias+chevron+leader+ripple};
}
