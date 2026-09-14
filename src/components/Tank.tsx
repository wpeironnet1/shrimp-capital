import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { DecorSlot } from '../game/decor';
import { colors } from '../theme/colors';
import { PixelShrimp, ShrimpAccessory } from './PixelShrimp';
import { PixelText } from './PixelText';
import { TankOfficeDecor } from './TankOfficeDecor';

const VISUAL_POPULATION_LIMIT = 14;
const raritySize: Record<ShrimpSpecies['rarity'], number> = { Common:0,Uncommon:2,Rare:4,Epic:6,Legendary:9,Mythic:12,Exotic:15 };
type Counts={chain:number;crown:number;visor:number;suit:number};
type TankShrimp={key:string;item:ShrimpSpecies;accessory?:ShrimpAccessory};
const lanes=[
  {left:11,top:82},{left:27,top:116},{left:43,top:82},{left:59,top:119},{left:75,top:84},{left:18,top:168},{left:35,top:200},
  {left:51,top:164},{left:68,top:199},{left:82,top:158},{left:12,top:239},{left:31,top:260},{left:58,top:244},{left:78,top:257},
];

function visiblePopulation(population:Record<string,number>,accessories:Record<string,Counts>){
  const stocked=species.map(item=>({item,count:population[item.id]??0,used:0})).filter(x=>x.count>0);
  const result:TankShrimp[]=[];
  while(result.length<VISUAL_POPULATION_LIMIT&&stocked.some(x=>x.used<x.count)){
    for(const entry of stocked){
      if(entry.used>=entry.count||result.length>=VISUAL_POPULATION_LIMIT)continue;
      const a=accessories[entry.item.id]??{chain:0,crown:0,visor:0,suit:0};
      const accessory:ShrimpAccessory|undefined=entry.used<a.suit?'suit':entry.used<a.suit+a.crown?'crown':entry.used<a.suit+a.crown+a.visor?'visor':entry.used<a.suit+a.crown+a.visor+a.chain?'chain':undefined;
      result.push({key:`${entry.item.id}-${entry.used}`,item:entry.item,accessory});entry.used+=1;
    }
  }
  return result.sort((a,b)=>((b.item.displayScale??1)+raritySize[b.item.rarity]/10)-((a.item.displayScale??1)+raritySize[a.item.rarity]/10));
}

function AmbientBubble({left,bottom=58,delay=0}:{left:number;bottom?:number;delay?:number}){
  const a=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([Animated.delay(delay),Animated.timing(a,{toValue:1,duration:2600+delay,useNativeDriver:true}),Animated.timing(a,{toValue:0,duration:0,useNativeDriver:true})]));loop.start();return()=>loop.stop();},[a,delay]);
  return <Animated.View style={[styles.ambientBubble,{left,bottom,opacity:a.interpolate({inputRange:[0,.1,.8,1],outputRange:[0,.65,.35,0]}),transform:[{translateY:a.interpolate({inputRange:[0,1],outputRange:[0,-170]})},{translateX:a.interpolate({inputRange:[0,.5,1],outputRange:[0,8,-3]})}]}]}/>;
}

function JumpEffects({animation,direction}:{animation:Animated.Value;direction:number}){
  const splash=animation.interpolate({inputRange:[0,.08,.18,.28,1],outputRange:[0,0,1,0,0]});
  const landing=animation.interpolate({inputRange:[0,.72,.84,.96,1],outputRange:[0,0,1,.45,0]});
  return <View pointerEvents="none" style={styles.jumpFx}>
    <Animated.View style={[styles.surfaceShadow,{opacity:animation.interpolate({inputRange:[0,.18,.45,.72,.9,1],outputRange:[0,.5,.16,.12,.55,0]}),transform:[{scaleX:animation.interpolate({inputRange:[0,.5,1],outputRange:[.65,1.45,.72]})}]}]}/>
    <Animated.View style={[styles.splash,{opacity:splash,transform:[{scale:animation.interpolate({inputRange:[0,.16,.3,1],outputRange:[.4,1.35,.7,.7]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.landingSplash,{opacity:landing,transform:[{translateX:Animated.multiply(animation,35*direction)},{scale:animation.interpolate({inputRange:[0,.78,.88,1],outputRange:[.6,.6,1.5,.85]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.ripple,{opacity:landing,transform:[{translateX:Animated.multiply(animation,35*direction)},{scaleX:animation.interpolate({inputRange:[0,.78,.92,1],outputRange:[.3,.3,1.25,1.85]})}]}]}/>
  </View>;
}

function ShrimpActor({shrimp,index,jumpToken}:{shrimp:TankShrimp;index:number;jumpToken:number}){
  const bob=useRef(new Animated.Value(0)).current,drift=useRef(new Animated.Value(0)).current,reaction=useRef(new Animated.Value(0)).current,jump=useRef(new Animated.Value(0)).current;
  const [flip,setFlip]=useState(index%2===1);const lane=lanes[index%lanes.length];
  const rarityBoost=raritySize[shrimp.item.rarity];const size=Math.min(82,(index===0?47:34+(index*5)%10)+rarityBoost)*Math.min(1.3,shrimp.item.displayScale??1);
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-5,duration:980+(index%4)*150,useNativeDriver:true}),Animated.timing(bob,{toValue:5,duration:980+(index%4)*150,useNativeDriver:true})]));loop.start();return()=>loop.stop();},[bob,index]);
  useEffect(()=>{let active=true;const distance=8+(index%3)*5;const wander=(target:number)=>{if(!active)return;setFlip(target<0);Animated.timing(drift,{toValue:target,duration:3300+(index%5)*390,easing:Easing.inOut(Easing.sin),useNativeDriver:true}).start(({finished})=>finished&&active&&wander(-target));};wander(index%2? -distance:distance);return()=>{active=false;drift.stopAnimation();};},[drift,index]);
  useEffect(()=>{if(!jumpToken)return;jump.stopAnimation();jump.setValue(0);Animated.sequence([Animated.timing(jump,{toValue:.12,duration:190,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),Animated.timing(jump,{toValue:1,duration:1250,easing:Easing.linear,useNativeDriver:true})]).start();},[jump,jumpToken]);
  const makeSwim=(event:GestureResponderEvent)=>{event.stopPropagation();reaction.stopAnimation();reaction.setValue(0);Animated.timing(reaction,{toValue:1,duration:650,useNativeDriver:true}).start(()=>setFlip(v=>!v));};
  const dir=flip?-1:1,jumpDir=index%2===0?1:-1;const formal=shrimp.accessory==='crown'||shrimp.accessory==='visor'||shrimp.accessory==='suit';
  const jumpY=jump.interpolate({inputRange:[0,.12,.3,.49,.68,.84,1],outputRange:[0,-4,-lane.top-58,-lane.top-118,-lane.top-77,-16,0]});
  const jumpX=jump.interpolate({inputRange:[0,.12,.52,1],outputRange:[0,-4*jumpDir,34*jumpDir,55*jumpDir]});
  const jumpRotate=jump.interpolate({inputRange:[0,.12,.42,.72,1],outputRange:['0deg','7deg',`${formal?95:190*jumpDir}deg`,`${formal?185:335*jumpDir}deg`,'0deg']});
  return <View style={[styles.actor,{left:`${lane.left}%` as `${number}%`,top:lane.top,zIndex:20-index}]}> 
    <JumpEffects animation={jump} direction={jumpDir}/>
    <Animated.View style={{transform:[{translateY:bob},{translateX:drift},{translateX:reaction.interpolate({inputRange:[0,.65,1],outputRange:[0,55*dir,0]})},{translateY:reaction.interpolate({inputRange:[0,.5,1],outputRange:[0,-7,0]})},{translateX:jumpX},{translateY:jumpY},{rotate:jumpRotate}]}}>
      <Pressable hitSlop={10} onPress={makeSwim}><PixelShrimp color={shrimp.item.color} accentColor={shrimp.item.accentColor} pattern={shrimp.item.pattern} trait={shrimp.item.trait} accessory={shrimp.accessory} size={size} flip={flip}/></Pressable>
    </Animated.View>
  </View>;
}

function TankEquipment({upgrades}:{upgrades:Record<string,number>}){
  const filter=upgrades.filter??0,heater=upgrades.heater??0,oxygen=upgrades.oxygen??0,lab=upgrades['breeding-lab']??0,algae=upgrades.algae??0;
  return <>
    <View pointerEvents="none" style={styles.utilityBay}><PixelText style={styles.zoneLabel}>UTILITIES</PixelText>
      {heater>0&&<View style={styles.heater}><View style={styles.heaterGlow}/><View style={styles.heaterControl}><View style={styles.statusGreen}/></View></View>}
      {filter>0&&<View style={styles.filter}><View style={styles.filterPipe}/><View style={styles.filterCan}><View style={styles.filterGauge}/></View>{filter>2&&<View style={[styles.filterCan,{left:34,height:48}]}/>}</View>}
      {oxygen>0&&<View style={styles.oxygen}><View style={styles.oxygenBox}><View style={styles.statusGreen}/></View><View style={styles.oxygenTube}/></View>}
    </View>
    <View pointerEvents="none" style={styles.heroBay}><PixelText style={styles.zoneLabel}>RESEARCH</PixelText>
      {lab>0&&<View style={styles.lab}><View style={styles.labGlass}><View style={styles.labEgg}/></View><View style={styles.labBase}/><View style={styles.labLamp}/></View>}
      {algae>0&&<View style={styles.nutrition}><View style={styles.nutritionTray}/><View style={styles.nutritionPatch}/><PixelText style={styles.microLabel}>NUTRITION</PixelText></View>}
      {(upgrades.terminal??0)>0&&<View style={styles.terminal}><View style={styles.terminalScreen}><PixelText style={styles.terminalText}>SHRP ▲ 4.2</PixelText><View style={styles.terminalGraph}/></View><View style={styles.terminalBase}/></View>}
    </View>
    <View pointerEvents="none" style={styles.opsBay}><PixelText style={styles.zoneLabel}>OPERATIONS</PixelText>
      {(upgrades.generator??0)>0&&<View style={styles.generator}><View style={styles.generatorFace}/><View style={styles.statusGreen}/><View style={styles.generatorVent}/></View>}
      {(upgrades.showcase??0)>0&&<View style={styles.showcase}><View style={styles.showcaseGlass}/><View style={styles.showcasePedestal}/></View>}
      {(upgrades.collector??0)>0&&<View style={styles.collector}><View style={styles.collectorArm}/><View style={styles.collectorJoint}/><View style={styles.collectorNet}/></View>}
    </View>
    {(upgrades.lighting??0)>0&&<View pointerEvents="none" style={styles.lightRig}><View style={styles.lightRail}/><View style={styles.lightOne}/><View style={styles.lightTwo}/><View style={styles.lightCone}/></View>}
    {(upgrades.compliance??0)>0&&<View pointerEvents="none" style={styles.compliance}><View style={styles.complianceDesk}/><View style={styles.compliancePaper}/><PixelText style={styles.microLabel}>COMPLIANCE</PixelText></View>}
  </>;
}

export function Tank({population,accessoryPopulation,capacity,upgrades,placedDecor={},onPress}:{population:Record<string,number>;accessoryPopulation:Record<string,Counts>;capacity:number;upgrades:Record<string,number>;placedDecor?:Partial<Record<DecorSlot,string>>;onPress:()=>void}){
  const shrimp=useMemo(()=>visiblePopulation(population,accessoryPopulation),[population,accessoryPopulation]);
  const [jumpEvent,setJumpEvent]=useState({index:-1,token:0});const count=Object.values(population).reduce((s,n)=>s+n,0);
  useEffect(()=>{if(!shrimp.length)return;let timer:ReturnType<typeof setTimeout>;const schedule=(first=false)=>{timer=setTimeout(()=>{setJumpEvent({index:Math.floor(Math.random()*shrimp.length),token:Date.now()});schedule();},first?9000+Math.random()*8000:18000+Math.random()*26000);};schedule(true);return()=>clearTimeout(timer);},[shrimp.length]);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Aquarium with ${count} shrimp`} onPress={onPress} style={({pressed})=>[styles.shell,pressed&&styles.shellPressed]}>
    <View style={styles.topFrame}><View style={styles.brassInset}/><View style={styles.frameBoltL}/><View style={styles.frameBoltR}/></View>
    <LinearGradient colors={['#2A8293','#17687C','#0B4358','#082D40']} locations={[0,.28,.65,1]} style={styles.water}>
      <View style={styles.backGlow}/><View style={styles.backWall}><View style={styles.wallPanelL}/><View style={styles.wallPanelR}/><View style={styles.city}>{[26,43,31,55,37,48,29].map((h,i)=><View key={i} style={[styles.tower,{height:h}]}/>)}</View></View>
      <View style={styles.waterline}><View style={styles.waterlineHot}/></View>
      <View style={styles.causticA}/><View style={styles.causticB}/><View style={styles.causticC}/>
      <View style={styles.glassGlareA}/><View style={styles.glassGlareB}/>
      {[8,21,39,62,79,91].map((left,i)=><AmbientBubble key={left} left={left} delay={i*220}/>) }
      <TankEquipment upgrades={upgrades}/><TankOfficeDecor placed={placedDecor}/>
      {shrimp.map((entry,index)=><ShrimpActor key={entry.key} shrimp={entry} index={index} jumpToken={jumpEvent.index===index?jumpEvent.token:0}/>)}
      {count===0&&<PixelText style={styles.empty}>TAP THE WATER TO FUND YOUR FIRST SHRIMP</PixelText>}
      <View style={styles.substrateBack}/><LinearGradient colors={['#AA8B68','#82674F','#5B4A3E']} style={styles.substrate}>{Array.from({length:30},(_,i)=><View key={i} style={[styles.rock,{left:`${2+i*3.3}%` as `${number}%`,width:4+(i%4)*2,height:3+(i%3)*2,backgroundColor:i%4===0?'#C5A16B':i%4===1?'#596263':i%4===2?'#7B6754':'#A38765'}]}/>)}</LinearGradient>
      <View style={styles.droppedPaper}><View style={styles.paperLine}/><View style={[styles.paperLine,{top:6,width:14}]}/></View><View style={styles.coin}/><View style={styles.paperClip}/>
      <View style={styles.caption}><PixelText style={styles.count}>{count} / {capacity}</PixelText><PixelText style={styles.hint}>{shrimp.length} CURATED ON SCREEN · TAP WATER TO HATCH</PixelText></View>
    </LinearGradient>
    <View style={styles.leftGlassEdge}/><View style={styles.rightGlassEdge}/><View style={styles.bottomFrame}><View style={styles.bottomBrass}/></View>
  </Pressable>;
}

const styles=StyleSheet.create({
  shell:{height:408,borderWidth:5,borderColor:'#294C55',borderRadius:24,overflow:'visible',backgroundColor:'#06171E',shadowColor:'#000',shadowOpacity:.5,shadowRadius:18,shadowOffset:{width:0,height:12}},shellPressed:{transform:[{scale:.994}]},topFrame:{position:'absolute',zIndex:40,top:-11,left:-5,right:-5,height:23,borderRadius:11,backgroundColor:'#263C42',borderWidth:3,borderColor:'#B68A43'},brassInset:{height:5,marginHorizontal:18,marginTop:5,borderRadius:3,backgroundColor:'#D4AE66'},frameBoltL:{position:'absolute',left:22,top:7,width:6,height:6,borderRadius:3,backgroundColor:'#F0CA78'},frameBoltR:{position:'absolute',right:22,top:7,width:6,height:6,borderRadius:3,backgroundColor:'#F0CA78'},water:{flex:1,borderRadius:17,position:'relative',overflow:'hidden'},backGlow:{position:'absolute',left:'26%',right:'26%',top:28,height:180,backgroundColor:'#73D5DD12',borderRadius:100},backWall:{position:'absolute',left:22,right:22,top:42,height:165,borderTopWidth:2,borderColor:'#2E7683'},wallPanelL:{position:'absolute',left:0,top:12,width:'27%',height:128,backgroundColor:'#103D50AA',borderWidth:3,borderColor:'#1C5867'},wallPanelR:{position:'absolute',right:0,top:12,width:'25%',height:128,backgroundColor:'#103D50AA',borderWidth:3,borderColor:'#1C5867'},city:{position:'absolute',left:'38%',top:38,width:170,height:78,flexDirection:'row',alignItems:'flex-end',gap:7,opacity:.24},tower:{width:16,backgroundColor:'#8FB4BA'},waterline:{position:'absolute',left:0,right:0,top:18,height:7,backgroundColor:'#4DB7C2CC',zIndex:7},waterlineHot:{height:2,backgroundColor:'#D0FFFFBB'},causticA:{position:'absolute',left:'18%',top:52,width:180,height:18,borderRadius:20,backgroundColor:'#BFFAFF0B',transform:[{rotate:'-8deg'}]},causticB:{position:'absolute',right:'15%',top:112,width:210,height:14,borderRadius:20,backgroundColor:'#BFFAFF0A',transform:[{rotate:'7deg'}]},causticC:{position:'absolute',left:'36%',top:184,width:150,height:11,borderRadius:20,backgroundColor:'#BFFAFF08'},glassGlareA:{position:'absolute',left:19,top:34,width:16,height:270,backgroundColor:'#C5FFFF0B',transform:[{rotate:'6deg'}]},glassGlareB:{position:'absolute',right:30,top:44,width:10,height:230,backgroundColor:'#C5FFFF08',transform:[{rotate:'-5deg'}]},ambientBubble:{position:'absolute',width:7,height:7,borderRadius:4,borderWidth:2,borderColor:'#B7FFFF88',zIndex:9},actor:{position:'absolute'},jumpFx:{position:'absolute',left:0,top:-48,width:92,height:82,zIndex:5},surfaceShadow:{position:'absolute',left:7,top:54,width:43,height:7,borderRadius:8,backgroundColor:'#042430'},splash:{position:'absolute',left:4,top:35,width:45,height:28},landingSplash:{position:'absolute',left:4,top:35,width:45,height:28},dropA:{position:'absolute',left:6,top:9,width:4,height:12,backgroundColor:'#BFFCF6',transform:[{rotate:'-28deg'}]},dropB:{position:'absolute',left:20,top:0,width:4,height:15,backgroundColor:'#E4FFFF'},dropC:{position:'absolute',right:5,top:8,width:4,height:12,backgroundColor:'#8FE5E5',transform:[{rotate:'29deg'}]},ripple:{position:'absolute',left:10,top:55,width:42,height:10,borderRadius:18,borderWidth:2,borderColor:'#C4FFFF'},
  utilityBay:{position:'absolute',left:24,bottom:66,width:128,height:86,zIndex:8},heroBay:{position:'absolute',left:'38%',bottom:65,width:250,height:90,zIndex:8},opsBay:{position:'absolute',right:23,bottom:65,width:155,height:92,zIndex:8},zoneLabel:{position:'absolute',left:2,bottom:-13,fontSize:4,color:'#8BB9BA',letterSpacing:1,backgroundColor:'#08242BDD',paddingHorizontal:4,paddingVertical:2},heater:{position:'absolute',left:0,bottom:0,width:22,height:73,backgroundColor:'#26373C',borderWidth:2,borderColor:'#101F24'},heaterGlow:{position:'absolute',left:5,top:5,width:7,height:58,backgroundColor:'#F07B4E'},heaterControl:{position:'absolute',right:-27,top:8,width:27,height:22,backgroundColor:'#37545A',borderWidth:2,borderColor:'#172C31'},statusGreen:{width:6,height:6,borderRadius:3,backgroundColor:'#6AF093',margin:5},filter:{position:'absolute',left:55,bottom:0,width:70,height:72},filterPipe:{position:'absolute',right:8,top:-18,width:9,height:38,backgroundColor:'#6D8788',borderWidth:2,borderColor:'#273C40'},filterCan:{position:'absolute',left:7,bottom:0,width:30,height:53,backgroundColor:'#42636A',borderWidth:3,borderColor:'#162F35'},filterGauge:{width:16,height:13,backgroundColor:'#D7B461',borderWidth:2,borderColor:'#2D4245',margin:5},oxygen:{position:'absolute',left:26,bottom:1,width:33,height:46},oxygenBox:{position:'absolute',bottom:0,width:31,height:23,backgroundColor:'#3B5D64',borderWidth:2,borderColor:'#163038'},oxygenTube:{position:'absolute',left:13,bottom:20,width:5,height:26,backgroundColor:'#78B6BA'},lab:{position:'absolute',left:0,bottom:0,width:61,height:76},labGlass:{position:'absolute',left:5,top:0,width:39,height:49,backgroundColor:'#7ED5DD35',borderWidth:3,borderColor:'#76C4CB'},labEgg:{width:11,height:16,borderRadius:7,backgroundColor:'#F1E4BC',alignSelf:'center',marginTop:16},labBase:{position:'absolute',left:0,bottom:0,width:50,height:24,backgroundColor:'#334B52',borderWidth:2,borderColor:'#182C31'},labLamp:{position:'absolute',right:0,bottom:22,width:20,height:5,backgroundColor:'#E3C55E'},nutrition:{position:'absolute',left:80,bottom:0,width:74,height:45},nutritionTray:{position:'absolute',bottom:0,width:70,height:15,backgroundColor:'#6B4B37',borderWidth:2,borderColor:'#34271F'},nutritionPatch:{position:'absolute',left:11,bottom:13,width:45,height:18,borderRadius:12,backgroundColor:'#4E9C56'},terminal:{position:'absolute',left:175,bottom:0,width:65,height:58},terminalScreen:{width:58,height:41,backgroundColor:'#071A22',borderWidth:3,borderColor:'#536A6E',padding:6},terminalText:{fontSize:5,color:'#83F0AE'},terminalGraph:{marginTop:7,width:32,height:2,backgroundColor:'#83F0AE',transform:[{rotate:'-12deg'}]},terminalBase:{width:64,height:8,backgroundColor:'#58686C'},microLabel:{position:'absolute',left:0,bottom:-12,fontSize:4,color:'#EED89B',backgroundColor:'#09242C',paddingHorizontal:3,paddingVertical:2},generator:{position:'absolute',right:0,bottom:0,width:58,height:55,backgroundColor:'#4E5859',borderWidth:3,borderColor:'#253134'},generatorFace:{position:'absolute',left:7,top:9,width:32,height:22,backgroundColor:'#2E393B'},generatorVent:{position:'absolute',left:8,bottom:6,width:35,height:3,borderTopWidth:2,borderBottomWidth:2,borderColor:'#768386'},showcase:{position:'absolute',left:0,bottom:0,width:48,height:69},showcaseGlass:{width:48,height:48,backgroundColor:'#BBFFFF18',borderWidth:3,borderColor:'#D5AF58'},showcasePedestal:{alignSelf:'center',width:31,height:18,backgroundColor:'#66503A',borderWidth:2,borderColor:'#AA8243'},collector:{position:'absolute',right:65,bottom:5,width:55,height:74},collectorArm:{position:'absolute',right:4,top:2,width:7,height:50,backgroundColor:'#778D91',transform:[{rotate:'23deg'}]},collectorJoint:{position:'absolute',right:17,top:42,width:14,height:14,borderRadius:7,backgroundColor:'#C49B4B'},collectorNet:{position:'absolute',right:20,bottom:0,width:31,height:23,borderWidth:3,borderColor:'#AFC8C8',transform:[{rotate:'-10deg'}]},lightRig:{position:'absolute',left:'35%',top:27,width:220,height:72,zIndex:5},lightRail:{width:220,height:8,backgroundColor:'#2E4045',borderWidth:2,borderColor:'#B28B43'},lightOne:{position:'absolute',left:38,top:8,width:14,height:10,backgroundColor:'#F5D77C'},lightTwo:{position:'absolute',right:38,top:8,width:14,height:10,backgroundColor:'#F5D77C'},lightCone:{position:'absolute',left:43,top:18,width:135,height:54,backgroundColor:'#FFF6B40C'},compliance:{position:'absolute',left:'52%',bottom:65,width:70,height:43,zIndex:8},complianceDesk:{position:'absolute',bottom:0,width:63,height:18,backgroundColor:'#704D36',borderWidth:2,borderColor:'#35251C'},compliancePaper:{position:'absolute',left:10,bottom:16,width:19,height:23,backgroundColor:'#EDE2BF',borderWidth:2,borderColor:'#82745B'},substrateBack:{position:'absolute',left:0,right:0,bottom:55,height:12,backgroundColor:'#70594A',borderTopWidth:3,borderTopColor:'#C5A16C',zIndex:2},substrate:{position:'absolute',left:0,right:0,bottom:0,height:58,zIndex:3,borderTopWidth:2,borderTopColor:'#C7A176'},rock:{position:'absolute',bottom:9,borderRadius:3},droppedPaper:{position:'absolute',left:'67%',bottom:17,width:25,height:15,backgroundColor:'#E3D6B9',transform:[{rotate:'8deg'}],zIndex:5,padding:4},paperLine:{height:2,width:17,backgroundColor:'#8E826C'},coin:{position:'absolute',left:'25%',bottom:20,width:9,height:9,borderRadius:5,backgroundColor:'#D2A54A',borderWidth:1,borderColor:'#835F24',zIndex:5},paperClip:{position:'absolute',left:'32%',bottom:20,width:14,height:7,borderRadius:5,borderWidth:2,borderColor:'#9AAEB0',transform:[{rotate:'-13deg'}],zIndex:5},caption:{position:'absolute',top:36,right:18,alignItems:'flex-end',zIndex:30,backgroundColor:'#061922C9',borderRadius:12,paddingVertical:9,paddingHorizontal:11,borderWidth:1,borderColor:'#29545D'},count:{fontSize:18},hint:{fontSize:5,color:colors.aqua,marginTop:4},empty:{color:'#A8E5E1',opacity:.82,fontSize:9,alignSelf:'center',marginTop:175},leftGlassEdge:{position:'absolute',left:2,top:15,bottom:14,width:8,backgroundColor:'#8DE6E817',borderRightWidth:2,borderRightColor:'#A4FFFF32'},rightGlassEdge:{position:'absolute',right:2,top:15,bottom:14,width:8,backgroundColor:'#8DE6E812',borderLeftWidth:2,borderLeftColor:'#A4FFFF26'},bottomFrame:{position:'absolute',left:-5,right:-5,bottom:-11,height:24,borderRadius:10,backgroundColor:'#243C43',borderWidth:3,borderColor:'#B68A43'},bottomBrass:{height:5,marginHorizontal:18,marginTop:5,borderRadius:3,backgroundColor:'#D2AB62'},
});
