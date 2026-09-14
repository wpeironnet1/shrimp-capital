import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { DecorSlot } from '../game/decor';
import { colors } from '../theme/colors';
import { PixelShrimp, ShrimpAccessory } from './PixelShrimp';
import { PixelText } from './PixelText';
import { TankOfficeDecor } from './TankOfficeDecor';

const VISUAL_POPULATION_LIMIT = 24;
const raritySize: Record<ShrimpSpecies['rarity'], number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 4, Legendary: 7, Mythic: 10, Exotic: 13 };
type Counts = { chain: number; crown: number; visor: number };
type TankShrimp = { key: string; item: ShrimpSpecies; accessory?: ShrimpAccessory };

function visiblePopulation(population: Record<string, number>, accessories: Record<string, Counts>) {
  const stocked = species.map((item) => ({ item, count: population[item.id] ?? 0, used: 0 })).filter((entry) => entry.count > 0);
  const result: TankShrimp[] = [];
  while (result.length < VISUAL_POPULATION_LIMIT && stocked.some((entry) => entry.used < entry.count)) {
    for (const entry of stocked) {
      if (entry.used >= entry.count || result.length >= VISUAL_POPULATION_LIMIT) continue;
      const a = accessories[entry.item.id] ?? { chain: 0, crown: 0, visor: 0 };
      const accessory: ShrimpAccessory | undefined = entry.used < a.crown ? 'crown' : entry.used < a.crown + a.visor ? 'visor' : entry.used < a.crown + a.visor + a.chain ? 'chain' : undefined;
      result.push({ key: `${entry.item.id}-${entry.used}`, item: entry.item, accessory });
      entry.used += 1;
    }
  }
  return result;
}

function JumpEffects({ animation, direction, label }: { animation: Animated.Value; direction: number; label?: string }) {
  const takeoffOpacity = animation.interpolate({ inputRange: [0,.08,.18,.28,1], outputRange: [0,0,1,0,0] });
  const landingOpacity = animation.interpolate({ inputRange: [0,.72,.83,.94,1], outputRange: [0,0,1,.65,0] });
  const rippleScale = animation.interpolate({ inputRange: [0,.78,.9,1], outputRange: [.3,.3,1.15,1.8] });
  return <View pointerEvents="none" style={styles.jumpFx}>
    <Animated.View style={[styles.surfaceShadow,{opacity:animation.interpolate({inputRange:[0,.18,.42,.68,.86,1],outputRange:[0,.55,.25,.2,.5,0]}),transform:[{scaleX:animation.interpolate({inputRange:[0,.5,1],outputRange:[.7,1.25,.7]})}]}]} />
    <Animated.View style={[styles.takeoffSplash,{opacity:takeoffOpacity,transform:[{scale:animation.interpolate({inputRange:[0,.16,.3,1],outputRange:[.5,1.25,.7,.7]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.landingSplash,{opacity:landingOpacity,transform:[{scale:animation.interpolate({inputRange:[0,.78,.88,1],outputRange:[.6,.6,1.4,.85]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.ripple,{opacity:landingOpacity,transform:[{scaleX:rippleScale},{scaleY:animation.interpolate({inputRange:[0,.78,1],outputRange:[.25,.25,.65]})}]}]} />
    {label && <Animated.View style={[styles.jumpLabel,{opacity:animation.interpolate({inputRange:[0,.18,.32,.66,.82,1],outputRange:[0,0,1,1,0,0]}),transform:[{translateY:animation.interpolate({inputRange:[0,.2,.65,1],outputRange:[4,0,-12,-18]})},{translateX:animation.interpolate({inputRange:[0,1],outputRange:[0,18*direction]})}]}]}><PixelText style={styles.jumpLabelText}>{label}</PixelText></Animated.View>}
  </View>;
}

function ShrimpActor({ shrimp, index, jumpToken }: { shrimp: TankShrimp; index: number; jumpToken: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const reaction = useRef(new Animated.Value(0)).current;
  const jump = useRef(new Animated.Value(0)).current;
  const [flip, setFlip] = useState(index % 2 === 1);
  const [jumpLabel, setJumpLabel] = useState<string | undefined>();
  const row = Math.floor(index / 6); const column = index % 6;
  const left = 6 + column * 15 + (row % 2) * 4;
  const top = 54 + row * 42 + ((index * 11) % 15);
  const size = (index === 0 ? 45 : 28 + ((index * 7) % 8)) + raritySize[shrimp.item.rarity];
  const reactionType = index % 3;

  useEffect(() => { const loop=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-4,duration:820+(index%5)*110,useNativeDriver:true}),Animated.timing(bob,{toValue:4,duration:820+(index%5)*110,useNativeDriver:true})])); loop.start(); return()=>loop.stop(); },[bob,index]);
  useEffect(() => { let active=true; const distance=10+(index%4)*4; const wander=(target:number)=>{if(!active)return;setFlip(target<0);Animated.timing(drift,{toValue:target,duration:2600+(index%6)*330,useNativeDriver:true}).start(({finished})=>finished&&active&&wander(-target));};wander(index%2===0?distance:-distance);return()=>{active=false;drift.stopAnimation();};},[drift,index]);
  useEffect(() => {
    if (!jumpToken) return;
    jump.stopAnimation(); jump.setValue(0);
    const labels=['AIRBORNE BONUS','RISK-ON MOVE','VOLATILITY EVENT'];
    setJumpLabel(Math.random()<.28?labels[Math.floor(Math.random()*labels.length)]:undefined);
    Animated.sequence([
      Animated.timing(jump,{toValue:.11,duration:170,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),
      Animated.timing(jump,{toValue:1,duration:1180,easing:Easing.linear,useNativeDriver:true}),
    ]).start();
  },[jump,jumpToken]);

  const makeSwim=(event:GestureResponderEvent)=>{event.stopPropagation();reaction.stopAnimation();reaction.setValue(0);Animated.timing(reaction,{toValue:1,duration:reactionType===2?760:reactionType===0?620:480,useNativeDriver:true}).start(()=>reactionType===0&&setFlip(v=>!v));};
  const direction=flip?-1:1; const jumpDirection=index%2===0?1:-1;
  const reactionX=reactionType===0?reaction.interpolate({inputRange:[0,.68,1],outputRange:[0,72*direction,0]}):reactionType===1?reaction.interpolate({inputRange:[0,.3,.65,1],outputRange:[0,13*direction,-9*direction,0]}):reaction.interpolate({inputRange:[0,.45,1],outputRange:[0,5*direction,0]});
  const reactionY=reaction.interpolate({inputRange:[0,.5,1],outputRange:[0,reactionType===1?-9:-3,0]});
  const jumpX=jump.interpolate({inputRange:[0,.11,.42,.72,1],outputRange:[0,-4*jumpDirection,28*jumpDirection,45*jumpDirection,52*jumpDirection]});
  const jumpY=jump.interpolate({inputRange:[0,.06,.11,.28,.48,.67,.82,1],outputRange:[0,2,-3,-top-70,-top-100,-top-72,-14,0]});
  const jumpRotate=jump.interpolate({inputRange:[0,.08,.11,.4,.68,1],outputRange:['0deg','-7deg','7deg',`${shrimp.accessory==='crown'||shrimp.accessory==='visor'?120:205*jumpDirection}deg`,`${shrimp.accessory==='crown'||shrimp.accessory==='visor'?210:355*jumpDirection}deg`,'0deg']});
  const wiggle=jump.interpolate({inputRange:[0,.025,.05,.075,.1,.11,1],outputRange:['0deg','-7deg','7deg','-7deg','7deg','0deg','0deg']});
  return <View style={[styles.actor,{left:`${left}%` as `${number}%`,top}]}>
    <JumpEffects animation={jump} direction={jumpDirection} label={jumpLabel}/>
    <Animated.View style={{transform:[{translateY:bob},{translateX:drift},{translateX:reactionX},{translateY:reactionY},{translateX:jumpX},{translateY:jumpY},{rotate:wiggle},{rotate:jumpRotate}]}}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${shrimp.item.name}${shrimp.accessory?` wearing ${shrimp.accessory}`:''}`} hitSlop={8} onPress={makeSwim}>
        <PixelShrimp color={shrimp.item.color} accentColor={shrimp.item.accentColor} pattern={shrimp.item.pattern} trait={shrimp.item.trait} accessory={shrimp.accessory} size={size} flip={flip}/>
        {reactionType===2&&<Animated.View pointerEvents="none" style={[styles.bubbleBurst,{opacity:reaction.interpolate({inputRange:[0,.18,.72,1],outputRange:[0,1,.8,0]}),transform:[{translateY:reaction.interpolate({inputRange:[0,1],outputRange:[5,-25]})}]}]}><PixelText style={styles.bubbleBurstText}>○ · ○</PixelText></Animated.View>}
      </Pressable>
    </Animated.View>
  </View>;
}

function BubbleColumn({ left=0 }: { left?: number }) { const a=useRef(new Animated.Value(0)).current; useEffect(()=>{const l=Animated.loop(Animated.timing(a,{toValue:1,duration:1700,useNativeDriver:true}));l.start();return()=>l.stop();},[a]);return <View style={[styles.bubbleColumn,{left}]}>{[0,1,2,3].map(i=><Animated.View key={i} style={[styles.microBubble,{left:(i%2)*7,opacity:a.interpolate({inputRange:[0,.1,.8,1],outputRange:[0,.8,.6,0]}),transform:[{translateY:a.interpolate({inputRange:[0,1],outputRange:[i*8, -72-i*5]})}]}]}/>)}</View>; }

function TankUpgrades({ upgrades }: { upgrades: Record<string, number> }) {
  const filter=upgrades.filter??0, heater=upgrades.heater??0, algae=upgrades.algae??0;
  return <>
    {filter>0&&<View style={styles.filterRig}><View style={styles.filterPipe}/><View style={[styles.canister,filter>=2&&styles.canisterGold]}><View style={styles.gaugeWindow}/><View style={styles.slats}/></View>{filter>=2&&<View style={[styles.canister,styles.canisterTwo]}/>} {filter>=3&&<View style={styles.pipeNetwork}/>} {filter>=4&&<View style={styles.pressureGauge}><View style={styles.gaugeNeedle}/></View>} {filter>=5&&<View style={styles.equipmentDesk}><PixelText style={styles.equipmentDeskText}>FILTRATION DESK</PixelText><View style={styles.blinkLight}/></View>}<BubbleColumn left={-7}/></View>}
    {heater>0&&<View style={styles.heaterRig}><View style={styles.heaterCable}/><View style={styles.heaterRod}><View style={styles.heaterFill}/></View>{heater>=2&&<View style={styles.heaterControl}><View style={styles.blinkLight}/></View>}{heater>=3&&<View style={styles.copperPipe}/>} {heater>=4&&<View style={styles.radiator}>{[0,1,2].map(i=><View key={i} style={styles.radiatorBar}/>)}</View>} {heater>=5&&<View style={styles.climateConsole}><PixelText style={styles.consoleText}>76°F AUTO</PixelText></View>}</View>}
    {algae>0&&<View style={styles.algaeRig}><View style={styles.algaeTray}/><View style={styles.algaePatch}/><View style={[styles.algaePatch,{left:22,width:31,height:14}]}/>{algae>=2&&<View style={styles.algaeShelf}/>} {algae>=3&&<View style={styles.feederHopper}/>} {algae>=4&&<View style={styles.feedBrand}><PixelText style={styles.feedBrandText}>FUND FEED</PixelText></View>} {algae>=5&&<View style={styles.nutritionLab}><PixelText style={styles.nutritionText}>NUTRITION R&D</PixelText></View>}</View>}
    {(upgrades.oxygen??0)>0&&<View style={styles.oxygenRig}><View style={styles.oxygenPump}><View style={styles.blinkLight}/></View><View style={styles.airTube}/><BubbleColumn left={5}/><PixelText style={styles.moduleTag}>O₂</PixelText></View>}
    {(upgrades['breeding-lab']??0)>0&&<View style={styles.labRig}><View style={styles.incubator}><View style={styles.incubatorGlass}><View style={styles.labEgg}/></View></View><View style={styles.labLamp}/><PixelText style={styles.moduleTag}>M&A LAB</PixelText></View>}
    {(upgrades.compliance??0)>0&&<View style={styles.complianceRig}><View style={styles.complianceDesk}/><View style={styles.clipboard}/><View style={styles.complianceLamp}/><PixelText style={styles.moduleTag}>COMPLIANCE</PixelText></View>}
    {(upgrades.terminal??0)>0&&<View style={styles.marketRig}><View style={styles.marketScreen}><PixelText style={styles.marketScreenText}>SHRP ▲</PixelText></View><View style={styles.marketKeyboard}/></View>}
    {(upgrades.lighting??0)>0&&<View style={styles.lightRig}><View style={styles.lightRail}/><View style={styles.lightCone}/></View>}
    {(upgrades.generator??0)>0&&<View style={styles.generator}><View style={styles.generatorCell}/><View style={styles.generatorLight}/><PixelText style={styles.moduleTag}>BACKUP</PixelText></View>}
    {(upgrades.showcase??0)>0&&<View style={styles.showcase}><View style={styles.showcaseGlass}/><View style={styles.showcasePedestal}/><View style={styles.showcaseGlow}/></View>}
    {(upgrades.collector??0)>0&&<View style={styles.collector}><View style={styles.collectorArm}/><View style={styles.collectorJoint}/><View style={styles.collectorNet}/></View>}
  </>;
}

export function Tank({ population, accessoryPopulation, capacity, upgrades, placedDecor={}, onPress }: { population: Record<string, number>; accessoryPopulation: Record<string, Counts>; capacity: number; upgrades: Record<string, number>; placedDecor?: Partial<Record<DecorSlot,string>>; onPress: () => void }) {
  const shrimp=useMemo(()=>visiblePopulation(population,accessoryPopulation),[accessoryPopulation,population]);
  const [jumpEvent,setJumpEvent]=useState({index:-1,token:0}); const count=Object.values(population).reduce((sum,n)=>sum+n,0);
  useEffect(()=>{if(!shrimp.length)return;let timer:ReturnType<typeof setTimeout>;const schedule=(first=false)=>{timer=setTimeout(()=>{setJumpEvent({index:Math.floor(Math.random()*shrimp.length),token:Date.now()});schedule();},first?7000+Math.random()*9000:15000+Math.random()*22000);};schedule(true);return()=>clearTimeout(timer);},[shrimp.length]);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Aquarium with ${count} shrimp`} onPress={onPress} style={({pressed})=>[styles.shell,pressed&&styles.shellPressed]}>
    <View style={styles.topRim}><View style={styles.rimHighlight}/><View style={styles.rimBoltL}/><View style={styles.rimBoltR}/></View>
    <LinearGradient colors={['#26788A','#155E73','#0A3D50','#082B3C']} style={styles.water}>
      <View style={styles.backPanel}/><View style={styles.backPanelTwo}/><View style={styles.cityBackdrop}>{[20,34,25,41,29,36].map((h,i)=><View key={i} style={[styles.cityTower,{height:h}]}/>)}</View>
      <View style={styles.waterline}><View style={styles.waterlineBright}/></View>
      <View style={styles.glassReflectionOne}/><View style={styles.glassReflectionTwo}/>
      <View style={styles.ambientParticles}>{[0,1,2,3,4,5,6,7].map(i=><View key={i} style={[styles.particle,{left:`${8+i*12}%` as `${number}%`,top:38+(i%4)*37}]}/>)}</View>
      <View style={styles.cableA}/><View style={styles.cableB}/>
      <TankUpgrades upgrades={upgrades}/>
      <TankOfficeDecor placed={placedDecor}/>
      {shrimp.map((entry,index)=><ShrimpActor key={entry.key} shrimp={entry} index={index} jumpToken={jumpEvent.index===index?jumpEvent.token:0}/>)}
      {count===0&&<PixelText style={styles.empty}>TAP THE WATER TO FUND YOUR FIRST SHRIMP</PixelText>}
      <View style={styles.gravel}>{Array.from({length:22},(_,i)=><View key={i} style={[styles.gravelRock,{left:`${i*4.7}%` as `${number}%`,width:6+(i%3)*3,height:4+(i%4)*2,opacity:.55+(i%3)*.12}]}/>)}</View>
      <View style={styles.floorLip}/>
      <View style={styles.caption}><PixelText style={styles.count}>{count} / {capacity}</PixelText><PixelText style={styles.hint}>{count>VISUAL_POPULATION_LIMIT?`${VISUAL_POPULATION_LIMIT} ON SCREEN · `:''}TAP WATER TO HATCH</PixelText></View>
    </LinearGradient>
    <View style={styles.leftGlassEdge}/><View style={styles.rightGlassEdge}/><View style={styles.bottomFrame}/>
  </Pressable>;
}

const styles=StyleSheet.create({
  shell:{height:318,borderWidth:5,borderColor:'#275A67',borderRadius:22,overflow:'visible',backgroundColor:'#061A22',shadowColor:'#000',shadowOpacity:.48,shadowRadius:14,shadowOffset:{width:0,height:10}},shellPressed:{transform:[{scale:.992}]},topRim:{position:'absolute',zIndex:30,top:-9,left:-5,right:-5,height:18,borderRadius:9,backgroundColor:'#233D46',borderWidth:3,borderColor:'#A97D3E'},rimHighlight:{height:3,marginHorizontal:14,marginTop:3,backgroundColor:'#D1A057',opacity:.75},rimBoltL:{position:'absolute',left:17,top:5,width:5,height:5,borderRadius:3,backgroundColor:'#E1BD73'},rimBoltR:{position:'absolute',right:17,top:5,width:5,height:5,borderRadius:3,backgroundColor:'#E1BD73'},
  water:{flex:1,borderRadius:16,position:'relative'},backPanel:{position:'absolute',left:'4%',top:42,width:'28%',height:114,backgroundColor:'#124557',borderWidth:3,borderColor:'#1F5B6B'},backPanelTwo:{position:'absolute',right:'5%',top:47,width:'24%',height:103,backgroundColor:'#103E50',borderWidth:3,borderColor:'#1A5868'},cityBackdrop:{position:'absolute',left:'36%',top:62,width:118,height:48,flexDirection:'row',alignItems:'flex-end',gap:5,opacity:.32},cityTower:{width:13,backgroundColor:'#7CA4AF'},waterline:{position:'absolute',left:0,right:0,top:14,height:5,backgroundColor:'#4CB0BC',opacity:.8,zIndex:9},waterlineBright:{height:2,backgroundColor:'#9BE6E7',opacity:.7},glassReflectionOne:{position:'absolute',left:18,top:26,width:12,height:180,backgroundColor:'#B8F7F4',opacity:.06,transform:[{rotate:'7deg'}]},glassReflectionTwo:{position:'absolute',right:36,top:35,width:7,height:138,backgroundColor:'#B8F7F4',opacity:.05,transform:[{rotate:'-8deg'}]},particle:{position:'absolute',width:3,height:3,borderRadius:2,backgroundColor:'#9CE0DF',opacity:.25},ambientParticles:{...StyleSheet.absoluteFillObject},cableA:{position:'absolute',left:92,bottom:39,width:95,height:3,backgroundColor:'#172D33',transform:[{rotate:'5deg'}]},cableB:{position:'absolute',right:86,bottom:44,width:79,height:3,backgroundColor:'#1E3438',transform:[{rotate:'-8deg'}]},
  actor:{position:'absolute',zIndex:12},bubbleBurst:{position:'absolute',top:-7,right:-10,zIndex:5},bubbleBurstText:{color:'#B8FFFA',fontSize:10,textShadowColor:'#0B5366',textShadowRadius:2},jumpFx:{position:'absolute',left:0,top:-38,width:80,height:70,zIndex:4},surfaceShadow:{position:'absolute',left:5,top:42,width:39,height:7,borderRadius:10,backgroundColor:'#062A38'},takeoffSplash:{position:'absolute',left:3,top:29,width:42,height:25},landingSplash:{position:'absolute',left:34,top:29,width:42,height:25},dropA:{position:'absolute',left:5,top:8,width:4,height:11,backgroundColor:'#A8F0EE',transform:[{rotate:'-28deg'}]},dropB:{position:'absolute',left:18,top:0,width:4,height:14,backgroundColor:'#D5FFFF'},dropC:{position:'absolute',right:5,top:7,width:4,height:11,backgroundColor:'#87DEE2',transform:[{rotate:'29deg'}]},ripple:{position:'absolute',left:9,top:43,width:39,height:10,borderRadius:18,borderWidth:2,borderColor:'#B4F0EF'},jumpLabel:{position:'absolute',left:-22,top:-7,width:105,alignItems:'center'},jumpLabelText:{fontSize:6,color:'#FFD36B',backgroundColor:'#071A22CC',paddingHorizontal:5,paddingVertical:3,borderRadius:4},
  filterRig:{position:'absolute',right:7,bottom:37,width:74,height:118,zIndex:7},filterPipe:{position:'absolute',right:11,top:-27,width:11,height:47,backgroundColor:'#55787C',borderWidth:2,borderColor:'#173139'},canister:{position:'absolute',right:2,bottom:0,width:34,height:67,backgroundColor:'#3C626A',borderWidth:3,borderColor:'#172F36'},canisterGold:{borderColor:'#C39A4A'},canisterTwo:{right:38,width:29,height:56,backgroundColor:'#315963'},gaugeWindow:{width:19,height:15,backgroundColor:'#C69648',borderWidth:2,borderColor:'#273B3E',margin:5},slats:{height:24,borderTopWidth:3,borderBottomWidth:3,borderColor:'#83ADB0',margin:5},pipeNetwork:{position:'absolute',right:24,top:-12,width:42,height:30,borderTopWidth:5,borderLeftWidth:5,borderColor:'#A86F40'},pressureGauge:{position:'absolute',right:37,top:-26,width:22,height:22,borderRadius:11,backgroundColor:'#E8DDB7',borderWidth:3,borderColor:'#8A663A'},gaugeNeedle:{position:'absolute',left:9,top:4,width:2,height:10,backgroundColor:'#A23A31',transform:[{rotate:'35deg'}]},equipmentDesk:{position:'absolute',right:0,bottom:-26,width:74,height:25,backgroundColor:'#233A40',borderWidth:2,borderColor:'#B08A46',alignItems:'center',justifyContent:'center'},equipmentDeskText:{fontSize:4,color:'#F4D58C'},blinkLight:{width:5,height:5,borderRadius:3,backgroundColor:'#69F38D',margin:4},bubbleColumn:{position:'absolute',bottom:8,width:22,height:90},microBubble:{position:'absolute',bottom:0,width:6,height:6,borderRadius:3,borderWidth:2,borderColor:'#A6F2ED'},
  heaterRig:{position:'absolute',left:8,top:72,width:76,height:123,zIndex:7},heaterCable:{position:'absolute',left:12,top:-73,width:4,height:79,backgroundColor:'#172B30'},heaterRod:{position:'absolute',left:5,top:0,width:15,height:92,backgroundColor:'#3D3030',borderWidth:3,borderColor:'#1B292D',justifyContent:'flex-end'},heaterFill:{height:'72%',backgroundColor:'#FF944C'},heaterControl:{position:'absolute',left:24,top:1,width:27,height:21,backgroundColor:'#304F55',borderWidth:2,borderColor:'#142D32'},copperPipe:{position:'absolute',left:24,top:31,width:42,height:7,backgroundColor:'#A96F43'},radiator:{position:'absolute',left:27,top:48,width:41,height:43,flexDirection:'row',gap:4},radiatorBar:{width:8,height:41,backgroundColor:'#7A4C3A',borderWidth:2,borderColor:'#3F302C'},climateConsole:{position:'absolute',left:25,top:96,width:47,height:22,backgroundColor:'#152F37',borderWidth:2,borderColor:'#C29446',alignItems:'center',justifyContent:'center'},consoleText:{fontSize:5,color:'#FFD47A'},
  algaeRig:{position:'absolute',right:91,bottom:36,width:104,height:57,zIndex:5},algaeTray:{position:'absolute',left:0,bottom:0,width:87,height:14,backgroundColor:'#74523B',borderWidth:3,borderColor:'#392A23'},algaePatch:{position:'absolute',left:7,bottom:11,width:39,height:17,borderRadius:12,backgroundColor:'#4A9A50'},algaeShelf:{position:'absolute',left:5,bottom:28,width:67,height:7,backgroundColor:'#6B5A3D'},feederHopper:{position:'absolute',right:5,bottom:13,width:20,height:32,backgroundColor:'#59676A',borderWidth:2,borderColor:'#293A3E'},feedBrand:{position:'absolute',left:16,bottom:32,width:51,height:15,backgroundColor:'#2C583A',borderWidth:2,borderColor:'#B99143',alignItems:'center',justifyContent:'center'},feedBrandText:{fontSize:4,color:'#EED595'},nutritionLab:{position:'absolute',left:7,bottom:46,width:72,height:16,backgroundColor:'#173B3A',borderWidth:2,borderColor:'#59A96C',alignItems:'center',justifyContent:'center'},nutritionText:{fontSize:4,color:'#A9E5B2'},
  oxygenRig:{position:'absolute',left:92,bottom:39,width:55,height:76,zIndex:6},oxygenPump:{position:'absolute',bottom:0,width:29,height:25,backgroundColor:'#365D67',borderWidth:3,borderColor:'#17333A'},airTube:{position:'absolute',left:13,bottom:21,width:5,height:46,backgroundColor:'#7DB2B6'},labRig:{position:'absolute',left:'36%',bottom:39,width:69,height:78,zIndex:6},incubator:{position:'absolute',bottom:0,width:42,height:51,backgroundColor:'#304D55',borderWidth:3,borderColor:'#142E34',padding:5},incubatorGlass:{height:29,backgroundColor:'#6DB6BE66',borderWidth:2,borderColor:'#8FDDE0'},labEgg:{width:8,height:11,borderRadius:5,backgroundColor:'#F2E5C0',alignSelf:'center',marginTop:7},labLamp:{position:'absolute',right:3,bottom:18,width:18,height:5,backgroundColor:'#E2C565'},complianceRig:{position:'absolute',left:'48%',bottom:39,width:68,height:50,zIndex:6},complianceDesk:{position:'absolute',bottom:0,width:56,height:18,backgroundColor:'#6C4B37',borderWidth:2,borderColor:'#35271F'},clipboard:{position:'absolute',left:7,bottom:16,width:18,height:24,backgroundColor:'#E7DDBB',borderWidth:2,borderColor:'#7B6C51'},complianceLamp:{position:'absolute',right:6,bottom:17,width:13,height:19,borderTopWidth:6,borderRightWidth:3,borderColor:'#D4B65D'},marketRig:{position:'absolute',right:'31%',top:67,width:48,height:43,zIndex:5},marketScreen:{width:44,height:28,backgroundColor:'#091C23',borderWidth:3,borderColor:'#49666D',alignItems:'center',justifyContent:'center'},marketScreenText:{fontSize:6,color:'#76E89B'},marketKeyboard:{width:48,height:7,backgroundColor:'#536267'},lightRig:{position:'absolute',left:'34%',top:19,width:133,height:56,zIndex:4},lightRail:{width:133,height:8,backgroundColor:'#273C44',borderWidth:2,borderColor:'#B28E4D'},lightCone:{alignSelf:'center',width:79,height:47,backgroundColor:'#FFF4A91A'},generator:{position:'absolute',right:17,bottom:38,width:53,height:44,backgroundColor:'#4B5151',borderWidth:3,borderColor:'#252F31',zIndex:7},generatorCell:{position:'absolute',left:6,top:8,width:28,height:15,backgroundColor:'#2E3839'},generatorLight:{position:'absolute',right:5,top:7,width:6,height:6,backgroundColor:'#78EE87'},showcase:{position:'absolute',right:'18%',bottom:37,width:49,height:68,zIndex:6},showcaseGlass:{width:49,height:48,backgroundColor:'#A9F0EF22',borderWidth:3,borderColor:'#D1AC57'},showcasePedestal:{alignSelf:'center',width:31,height:17,backgroundColor:'#5D4931',borderWidth:2,borderColor:'#B28C4A'},showcaseGlow:{position:'absolute',left:10,top:6,width:29,height:29,borderRadius:16,backgroundColor:'#FFE99022'},collector:{position:'absolute',right:'7%',top:62,width:68,height:74,zIndex:8},collectorArm:{position:'absolute',right:9,top:4,width:7,height:48,backgroundColor:'#6F8589',transform:[{rotate:'24deg'}]},collectorJoint:{position:'absolute',right:20,top:39,width:13,height:13,borderRadius:7,backgroundColor:'#C59A49'},collectorNet:{position:'absolute',right:23,bottom:1,width:31,height:22,borderWidth:3,borderColor:'#9AB9B9',transform:[{rotate:'-13deg'}]},moduleTag:{position:'absolute',bottom:-12,left:0,fontSize:4,color:'#F1DA9C',backgroundColor:'#102B33',paddingHorizontal:3,paddingVertical:2},
  gravel:{position:'absolute',left:0,right:0,bottom:12,height:39,backgroundColor:'#9D7A57',borderTopWidth:5,borderTopColor:'#C89D69',zIndex:2},gravelRock:{position:'absolute',bottom:5,borderRadius:4,backgroundColor:'#4A5A57'},floorLip:{position:'absolute',left:0,right:0,bottom:0,height:14,backgroundColor:'#493D34',borderTopWidth:3,borderTopColor:'#C29B61',zIndex:15},caption:{position:'absolute',top:27,right:14,alignItems:'flex-end',zIndex:20,backgroundColor:'#071A2288',borderRadius:8,padding:7},count:{fontSize:16},hint:{fontSize:6,color:colors.aqua,marginTop:3},empty:{color:'#A8E5E1',opacity:.8,fontSize:9,alignSelf:'center',marginTop:130},leftGlassEdge:{position:'absolute',left:2,top:14,bottom:13,width:7,backgroundColor:'#7DD7D922',borderRightWidth:2,borderRightColor:'#7DDEE044'},rightGlassEdge:{position:'absolute',right:2,top:14,bottom:13,width:7,backgroundColor:'#7DD7D916',borderLeftWidth:2,borderLeftColor:'#7DDEE033'},bottomFrame:{position:'absolute',left:-4,right:-4,bottom:-9,height:18,borderRadius:9,backgroundColor:'#243D45',borderWidth:3,borderColor:'#A87E42'},
});
