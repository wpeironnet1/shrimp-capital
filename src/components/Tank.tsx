import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { DecorSlot } from '../game/decor';
import { colors } from '../theme/colors';
import { PixelShrimp, ShrimpAccessory } from './PixelShrimp';
import { PixelText } from './PixelText';
import { TankOfficeDecor } from './TankOfficeDecor';

const VISUAL_POPULATION_LIMIT = 16;
const raritySize: Record<ShrimpSpecies['rarity'], number> = { Common:0,Uncommon:1,Rare:2,Epic:4,Legendary:7,Mythic:10,Exotic:13 };
type Counts={chain:number;crown:number;visor:number;suit:number};
type TankShrimp={key:string;item:ShrimpSpecies;accessory?:ShrimpAccessory};

function visiblePopulation(population:Record<string,number>,accessories:Record<string,Counts>){
  const stocked=species.map(item=>({item,count:population[item.id]??0,used:0})).filter(entry=>entry.count>0);
  const result:TankShrimp[]=[];
  while(result.length<VISUAL_POPULATION_LIMIT&&stocked.some(entry=>entry.used<entry.count)){
    for(const entry of stocked){
      if(entry.used>=entry.count||result.length>=VISUAL_POPULATION_LIMIT)continue;
      const a=accessories[entry.item.id]??{chain:0,crown:0,visor:0,suit:0};
      const accessory:ShrimpAccessory|undefined=entry.used<a.suit?'suit':entry.used<a.suit+a.crown?'crown':entry.used<a.suit+a.crown+a.visor?'visor':entry.used<a.suit+a.crown+a.visor+a.chain?'chain':undefined;
      result.push({key:`${entry.item.id}-${entry.used}`,item:entry.item,accessory});
      entry.used+=1;
    }
  }
  return result;
}

function JumpEffects({animation,direction,label}:{animation:Animated.Value;direction:number;label?:string}){
  const takeoff=animation.interpolate({inputRange:[0,.08,.18,.28,1],outputRange:[0,0,1,0,0]});
  const landing=animation.interpolate({inputRange:[0,.7,.82,.95,1],outputRange:[0,0,1,.6,0]});
  return <View pointerEvents="none" style={styles.jumpFx}>
    <Animated.View style={[styles.surfaceShadow,{opacity:animation.interpolate({inputRange:[0,.18,.5,.82,1],outputRange:[0,.45,.16,.42,0]}),transform:[{scaleX:animation.interpolate({inputRange:[0,.5,1],outputRange:[.7,1.35,.7]})}]}]}/>
    <Animated.View style={[styles.splash,{opacity:takeoff,left:1,transform:[{scale:animation.interpolate({inputRange:[0,.2,1],outputRange:[.5,1.35,.7]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.splash,{opacity:landing,left:35,transform:[{scale:animation.interpolate({inputRange:[0,.82,.9,1],outputRange:[.5,.5,1.5,.8]})}]}]}><View style={styles.dropA}/><View style={styles.dropB}/><View style={styles.dropC}/></Animated.View>
    <Animated.View style={[styles.ripple,{opacity:landing,transform:[{scaleX:animation.interpolate({inputRange:[0,.8,1],outputRange:[.3,.3,1.8]})},{scaleY:animation.interpolate({inputRange:[0,.8,1],outputRange:[.25,.25,.7]})}]}]}/>
    {label&&<Animated.View style={[styles.jumpLabel,{opacity:animation.interpolate({inputRange:[0,.2,.32,.7,.85,1],outputRange:[0,0,1,1,0,0]}),transform:[{translateY:animation.interpolate({inputRange:[0,1],outputRange:[4,-18]})},{translateX:animation.interpolate({inputRange:[0,1],outputRange:[0,18*direction]})}]}]}><PixelText style={styles.jumpLabelText}>{label}</PixelText></Animated.View>}
  </View>;
}

const lanes=[
  {left:11,top:72},{left:31,top:63},{left:52,top:76},{left:73,top:65},
  {left:18,top:119},{left:40,top:112},{left:61,top:126},{left:80,top:113},
  {left:8,top:164},{left:29,top:173},{left:51,top:161},{left:72,top:176},
  {left:16,top:211},{left:39,top:205},{left:60,top:216},{left:80,top:202},
];

function ShrimpActor({shrimp,index,jumpToken}:{shrimp:TankShrimp;index:number;jumpToken:number}){
  const bob=useRef(new Animated.Value(0)).current;
  const drift=useRef(new Animated.Value(0)).current;
  const reaction=useRef(new Animated.Value(0)).current;
  const jump=useRef(new Animated.Value(0)).current;
  const [flip,setFlip]=useState(index%2===1);
  const [jumpLabel,setJumpLabel]=useState<string|undefined>();
  const lane=lanes[index%lanes.length];
  const displayScale=shrimp.item.displayScale??1;
  const size=Math.min(72,Math.round((29+(index%4)*2+raritySize[shrimp.item.rarity])*displayScale));
  const rare=shrimp.item.rarity==='Legendary'||shrimp.item.rarity==='Mythic'||shrimp.item.rarity==='Exotic';

  useEffect(()=>{const loop=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-3,duration:1100+(index%4)*160,useNativeDriver:true}),Animated.timing(bob,{toValue:3,duration:1100+(index%4)*160,useNativeDriver:true})]));loop.start();return()=>loop.stop();},[bob,index]);
  useEffect(()=>{let active=true;const distance=rare?8:12+(index%3)*3;const wander=(target:number)=>{if(!active)return;setFlip(target<0);Animated.timing(drift,{toValue:target,duration:(rare?3600:2700)+(index%5)*280,useNativeDriver:true}).start(({finished})=>finished&&active&&wander(-target));};wander(index%2===0?distance:-distance);return()=>{active=false;drift.stopAnimation();};},[drift,index,rare]);
  useEffect(()=>{if(!jumpToken)return;jump.stopAnimation();jump.setValue(0);const labels=['AIRBORNE BONUS','RISK-ON MOVE','VOLATILITY EVENT'];setJumpLabel(Math.random()<.22?labels[Math.floor(Math.random()*labels.length)]:undefined);Animated.sequence([Animated.timing(jump,{toValue:.11,duration:170,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),Animated.timing(jump,{toValue:1,duration:1180,easing:Easing.linear,useNativeDriver:true})]).start();},[jump,jumpToken]);
  const react=(event:GestureResponderEvent)=>{event.stopPropagation();reaction.stopAnimation();reaction.setValue(0);Animated.timing(reaction,{toValue:1,duration:560,useNativeDriver:true}).start(()=>setFlip(v=>!v));};
  const direction=flip?-1:1;const jumpDirection=index%2===0?1:-1;
  const formal=shrimp.accessory==='crown'||shrimp.accessory==='visor'||shrimp.accessory==='suit';
  const jumpX=jump.interpolate({inputRange:[0,.1,.45,.78,1],outputRange:[0,-4*jumpDirection,31*jumpDirection,48*jumpDirection,54*jumpDirection]});
  const jumpY=jump.interpolate({inputRange:[0,.08,.18,.45,.7,.86,1],outputRange:[0,2,-24,-lane.top-96,-lane.top-70,-18,0]});
  const rotate=jump.interpolate({inputRange:[0,.1,.42,.7,1],outputRange:['0deg','7deg',`${formal?105:190*jumpDirection}deg`,`${formal?190:340*jumpDirection}deg`,'0deg']});
  return <View style={[styles.actor,{left:`${lane.left}%` as `${number}%`,top:lane.top}]}>
    <JumpEffects animation={jump} direction={jumpDirection} label={jumpLabel}/>
    <Animated.View style={{transform:[{translateY:bob},{translateX:drift},{translateX:reaction.interpolate({inputRange:[0,.65,1],outputRange:[0,48*direction,0]})},{translateX:jumpX},{translateY:jumpY},{rotate}]}}>
      <Pressable hitSlop={8} onPress={react}><PixelShrimp color={shrimp.item.color} accentColor={shrimp.item.accentColor} pattern={shrimp.item.pattern} trait={shrimp.item.trait} accessory={shrimp.accessory} size={size} flip={flip}/></Pressable>
    </Animated.View>
  </View>;
}

function BubbleColumn(){const a=useRef(new Animated.Value(0)).current;useEffect(()=>{const l=Animated.loop(Animated.timing(a,{toValue:1,duration:1800,useNativeDriver:true}));l.start();return()=>l.stop();},[a]);return <View style={styles.bubbleColumn}>{[0,1,2,3,4].map(i=><Animated.View key={i} style={[styles.microBubble,{left:(i%2)*8,opacity:a.interpolate({inputRange:[0,.1,.85,1],outputRange:[0,.8,.55,0]}),transform:[{translateY:a.interpolate({inputRange:[0,1],outputRange:[i*7,-72-i*7]})}]}]}/>)}</View>}

function EquipmentZones({upgrades}:{upgrades:Record<string,number>}){
  const filter=upgrades.filter??0,heater=upgrades.heater??0,oxygen=upgrades.oxygen??0,lab=upgrades['breeding-lab']??0,terminal=upgrades.terminal??0,generator=upgrades.generator??0,showcase=upgrades.showcase??0,collector=upgrades.collector??0,lighting=upgrades.lighting??0,compliance=upgrades.compliance??0,algae=upgrades.algae??0;
  return <>
    <View pointerEvents="none" style={styles.leftZone}>
      {heater>0&&<View style={styles.heaterUnit}><View style={styles.heaterGlow}/><View style={styles.heaterRod}/><View style={styles.heaterControl}><View style={styles.statusGreen}/></View>{heater>=3&&<View style={styles.copperLoop}/>}</View>}
      {filter>0&&<View style={styles.filterUnit}><View style={styles.filterPipe}/><View style={styles.filterCan}><View style={styles.filterWindow}/></View>{filter>=2&&<View style={[styles.filterCan,{left:32,height:43}]}/>}<BubbleColumn/></View>}
      {oxygen>0&&<View style={styles.oxygenUnit}><View style={styles.oxygenPump}/><View style={styles.airTube}/><BubbleColumn/><PixelText style={styles.zoneTag}>O₂ DESK</PixelText></View>}
    </View>
    <View pointerEvents="none" style={styles.centerZone}>
      {lab>0&&<View style={styles.labUnit}><View style={styles.labCabinet}><View style={styles.labGlass}><View style={styles.labEgg}/></View></View><View style={styles.labLamp}/><PixelText style={styles.zoneTag}>M&A LAB</PixelText></View>}
      {terminal>0&&<View style={styles.terminalUnit}><View style={styles.terminalScreen}><PixelText style={styles.terminalText}>SHRP ▲</PixelText><View style={styles.terminalGraph}/></View><View style={styles.terminalKeyboard}/></View>}
      {compliance>0&&<View style={styles.complianceUnit}><View style={styles.complianceDesk}/><View style={styles.compliancePaper}/><PixelText style={styles.zoneTag}>COMPLIANCE</PixelText></View>}
    </View>
    <View pointerEvents="none" style={styles.rightZone}>
      {generator>0&&<View style={styles.generator}><View style={styles.generatorPanel}/><View style={styles.statusGreen}/><PixelText style={styles.zoneTag}>BACKUP</PixelText></View>}
      {showcase>0&&<View style={styles.showcase}><View style={styles.showcaseGlass}/><View style={styles.showcasePedestal}/></View>}
      {collector>0&&<View style={styles.collector}><View style={styles.collectorArm}/><View style={styles.collectorJoint}/><View style={styles.collectorNet}/></View>}
    </View>
    {lighting>0&&<View pointerEvents="none" style={styles.ceilingRig}><View style={styles.lightRail}/><View style={styles.lightCone}/></View>}
    {algae>0&&<View pointerEvents="none" style={styles.algaeStation}><View style={styles.algaeTray}/><View style={styles.algaePatch}/>{algae>=3&&<View style={styles.algaeHopper}/>}<PixelText style={styles.zoneTag}>NUTRITION</PixelText></View>}
  </>;
}

export function Tank({population,accessoryPopulation,capacity,upgrades,placedDecor={},onPress}:{population:Record<string,number>;accessoryPopulation:Record<string,Counts>;capacity:number;upgrades:Record<string,number>;placedDecor?:Partial<Record<DecorSlot,string>>;onPress:()=>void}){
  const shrimp=useMemo(()=>visiblePopulation(population,accessoryPopulation),[population,accessoryPopulation]);
  const [jumpEvent,setJumpEvent]=useState({index:-1,token:0});
  const count=Object.values(population).reduce((sum,n)=>sum+n,0);
  useEffect(()=>{if(!shrimp.length)return;let timer:ReturnType<typeof setTimeout>;const schedule=(first=false)=>{timer=setTimeout(()=>{setJumpEvent({index:Math.floor(Math.random()*shrimp.length),token:Date.now()});schedule();},first?9000+Math.random()*9000:18000+Math.random()*22000);};schedule(true);return()=>clearTimeout(timer);},[shrimp.length]);
  return <Pressable onPress={onPress} style={({pressed})=>[styles.shell,pressed&&styles.shellPressed]}>
    <View style={styles.topFrame}><View style={styles.topHighlight}/><View style={styles.frameBoltL}/><View style={styles.frameBoltR}/></View>
    <LinearGradient colors={['#2B8090','#16647A','#0C4358','#082E40']} style={styles.water}>
      <View style={styles.backWall}><View style={styles.wallPanelA}/><View style={styles.wallPanelB}/><View style={styles.city}>{[23,35,28,45,31,39,26].map((h,i)=><View key={i} style={[styles.cityBuilding,{height:h}]}/>)}</View></View>
      <View style={styles.waterline}><View style={styles.waterlineGlow}/></View>
      <View style={styles.reflectionA}/><View style={styles.reflectionB}/>
      <EquipmentZones upgrades={upgrades}/>
      <TankOfficeDecor placed={placedDecor}/>
      {shrimp.map((entry,index)=><ShrimpActor key={entry.key} shrimp={entry} index={index} jumpToken={jumpEvent.index===index?jumpEvent.token:0}/>)}
      <View pointerEvents="none" style={styles.substrateBack}/>
      <View pointerEvents="none" style={styles.substrate}>{Array.from({length:28},(_,i)=><View key={i} style={[styles.pebble,{left:`${2+i*3.55}%` as `${number}%`,width:5+(i%4)*2,height:3+(i%3)*2,backgroundColor:i%5===0?'#C8A36B':i%3===0?'#6D7771':'#8B7861'}]}/>)}<View style={styles.goldCoin}/><View style={styles.paperClip}/><View style={styles.droppedChart}/></View>
      <View style={styles.floorLip}/>
      <View style={styles.caption}><PixelText style={styles.count}>{count} / {capacity}</PixelText><PixelText style={styles.hint}>{count>VISUAL_POPULATION_LIMIT?`${VISUAL_POPULATION_LIMIT} CURATED ON SCREEN · `:''}TAP WATER TO HATCH</PixelText></View>
      {count===0&&<PixelText style={styles.empty}>TAP THE WATER TO FUND YOUR FIRST SHRIMP</PixelText>}
    </LinearGradient>
    <View style={styles.leftSeam}/><View style={styles.rightSeam}/><View style={styles.bottomFrame}/>
  </Pressable>;
}

const styles=StyleSheet.create({
  shell:{height:340,borderWidth:5,borderColor:'#315D67',borderRadius:24,overflow:'visible',backgroundColor:'#061A22',shadowColor:'#000',shadowOpacity:.45,shadowRadius:16,shadowOffset:{width:0,height:10}},shellPressed:{transform:[{scale:.994}]},topFrame:{position:'absolute',zIndex:40,top:-11,left:-5,right:-5,height:21,borderRadius:10,backgroundColor:'#263F48',borderWidth:3,borderColor:'#B48A48'},topHighlight:{height:3,marginHorizontal:16,marginTop:3,backgroundColor:'#E0B662',opacity:.72},frameBoltL:{position:'absolute',left:22,top:6,width:5,height:5,borderRadius:3,backgroundColor:'#E3C17A'},frameBoltR:{position:'absolute',right:22,top:6,width:5,height:5,borderRadius:3,backgroundColor:'#E3C17A'},water:{flex:1,borderRadius:18,position:'relative'},backWall:{...StyleSheet.absoluteFillObject,opacity:.95},wallPanelA:{position:'absolute',left:'6%',top:44,width:'23%',height:112,backgroundColor:'#11485B',borderWidth:3,borderColor:'#215F70'},wallPanelB:{position:'absolute',right:'7%',top:51,width:'21%',height:101,backgroundColor:'#103F51',borderWidth:3,borderColor:'#1C5869'},city:{position:'absolute',left:'37%',top:66,width:150,height:48,flexDirection:'row',alignItems:'flex-end',gap:6,opacity:.24},cityBuilding:{width:14,backgroundColor:'#86ABB4'},waterline:{position:'absolute',left:0,right:0,top:17,height:6,backgroundColor:'#4DB4BF',opacity:.9,zIndex:20},waterlineGlow:{height:2,backgroundColor:'#C4FFFF',opacity:.72},reflectionA:{position:'absolute',left:18,top:30,width:11,height:205,backgroundColor:'#C8FFFF',opacity:.055,transform:[{rotate:'5deg'}]},reflectionB:{position:'absolute',right:34,top:40,width:7,height:165,backgroundColor:'#C8FFFF',opacity:.045,transform:[{rotate:'-7deg'}]},
  actor:{position:'absolute',zIndex:16},jumpFx:{position:'absolute',left:0,top:-42,width:82,height:74,zIndex:5},surfaceShadow:{position:'absolute',left:5,top:46,width:39,height:7,borderRadius:10,backgroundColor:'#062A38'},splash:{position:'absolute',top:31,width:42,height:27},dropA:{position:'absolute',left:5,top:8,width:4,height:12,backgroundColor:'#A8F0EE',transform:[{rotate:'-28deg'}]},dropB:{position:'absolute',left:18,top:0,width:4,height:15,backgroundColor:'#D5FFFF'},dropC:{position:'absolute',right:5,top:7,width:4,height:12,backgroundColor:'#87DEE2',transform:[{rotate:'29deg'}]},ripple:{position:'absolute',left:10,top:47,width:40,height:10,borderRadius:18,borderWidth:2,borderColor:'#B4F0EF'},jumpLabel:{position:'absolute',left:-22,top:-8,width:108,alignItems:'center'},jumpLabelText:{fontSize:6,color:'#FFD36B',backgroundColor:'#071A22CC',paddingHorizontal:5,paddingVertical:3,borderRadius:4},
  leftZone:{position:'absolute',left:12,top:65,bottom:55,width:88,zIndex:7},rightZone:{position:'absolute',right:14,top:72,bottom:55,width:100,zIndex:7},centerZone:{position:'absolute',left:'35%',right:'34%',bottom:54,height:95,zIndex:7},heaterUnit:{position:'absolute',left:0,top:0,width:38,height:105},heaterRod:{position:'absolute',left:8,top:9,width:10,height:75,backgroundColor:'#E46D43',borderWidth:2,borderColor:'#4E312B'},heaterGlow:{position:'absolute',left:2,top:1,width:23,height:91,backgroundColor:'#FF8A4A18'},heaterControl:{position:'absolute',left:24,top:5,width:27,height:22,backgroundColor:'#304F55',borderWidth:2,borderColor:'#142D32'},copperLoop:{position:'absolute',left:24,top:37,width:45,height:38,borderTopWidth:5,borderRightWidth:5,borderColor:'#A66C42'},statusGreen:{width:6,height:6,borderRadius:3,backgroundColor:'#6DF18D',margin:5},filterUnit:{position:'absolute',left:39,bottom:0,width:61,height:102},filterPipe:{position:'absolute',right:8,top:0,width:8,height:38,backgroundColor:'#66878A'},filterCan:{position:'absolute',left:5,bottom:0,width:25,height:51,backgroundColor:'#41636B',borderWidth:3,borderColor:'#172F36'},filterWindow:{margin:5,height:13,backgroundColor:'#C49A4B',borderWidth:2,borderColor:'#293B3E'},bubbleColumn:{position:'absolute',left:7,bottom:34,width:20,height:70},microBubble:{position:'absolute',bottom:0,width:6,height:6,borderRadius:3,borderWidth:2,borderColor:'#B2F4F0'},oxygenUnit:{position:'absolute',left:7,bottom:0,width:51,height:70},oxygenPump:{position:'absolute',bottom:0,width:32,height:24,backgroundColor:'#355E68',borderWidth:3,borderColor:'#17333A'},airTube:{position:'absolute',left:14,bottom:21,width:4,height:41,backgroundColor:'#7DB2B6'},zoneTag:{position:'absolute',bottom:-12,left:0,fontSize:4,color:'#F0D79B',backgroundColor:'#102B33',paddingHorizontal:3,paddingVertical:2},
  labUnit:{position:'absolute',left:0,bottom:0,width:61,height:82},labCabinet:{position:'absolute',bottom:0,width:43,height:58,backgroundColor:'#304D55',borderWidth:3,borderColor:'#142E34',padding:5},labGlass:{height:34,backgroundColor:'#6DB6BE66',borderWidth:2,borderColor:'#8FDDE0'},labEgg:{width:9,height:13,borderRadius:5,backgroundColor:'#F2E5C0',alignSelf:'center',marginTop:8},labLamp:{position:'absolute',right:2,bottom:20,width:18,height:5,backgroundColor:'#E2C565'},terminalUnit:{position:'absolute',left:67,bottom:20,width:52,height:45},terminalScreen:{width:47,height:31,backgroundColor:'#071A22',borderWidth:3,borderColor:'#4D6870',padding:4},terminalText:{fontSize:5,color:'#78E99A'},terminalGraph:{marginTop:5,width:28,height:3,backgroundColor:'#67DA8E',transform:[{rotate:'-12deg'}]},terminalKeyboard:{width:52,height:7,backgroundColor:'#526268'},complianceUnit:{position:'absolute',right:-47,bottom:0,width:56,height:48},complianceDesk:{position:'absolute',bottom:0,width:56,height:17,backgroundColor:'#704D37',borderWidth:2,borderColor:'#34251D'},compliancePaper:{position:'absolute',left:7,bottom:14,width:18,height:25,backgroundColor:'#E9DFC1',borderWidth:2,borderColor:'#7B6C51'},
  generator:{position:'absolute',right:0,bottom:0,width:56,height:48,backgroundColor:'#4C5556',borderWidth:3,borderColor:'#252F31'},generatorPanel:{margin:6,width:30,height:17,backgroundColor:'#293638'},showcase:{position:'absolute',right:58,bottom:0,width:53,height:73},showcaseGlass:{width:53,height:50,backgroundColor:'#A9F0EF20',borderWidth:3,borderColor:'#D1AC57'},showcasePedestal:{alignSelf:'center',width:34,height:19,backgroundColor:'#5D4931',borderWidth:2,borderColor:'#B28C4A'},collector:{position:'absolute',right:8,top:0,width:70,height:70},collectorArm:{position:'absolute',right:11,top:3,width:7,height:48,backgroundColor:'#758C90',transform:[{rotate:'24deg'}]},collectorJoint:{position:'absolute',right:21,top:39,width:14,height:14,borderRadius:7,backgroundColor:'#C59A49'},collectorNet:{position:'absolute',right:24,bottom:0,width:34,height:23,borderWidth:3,borderColor:'#9FC0BE',transform:[{rotate:'-13deg'}]},ceilingRig:{position:'absolute',left:'36%',top:28,width:170,height:62,zIndex:5},lightRail:{width:170,height:8,backgroundColor:'#273C44',borderWidth:2,borderColor:'#B28E4D'},lightCone:{alignSelf:'center',width:100,height:50,backgroundColor:'#FFF4A916'},algaeStation:{position:'absolute',right:'22%',bottom:49,width:95,height:52,zIndex:6},algaeTray:{position:'absolute',left:0,bottom:0,width:75,height:13,backgroundColor:'#74523B',borderWidth:3,borderColor:'#392A23'},algaePatch:{position:'absolute',left:7,bottom:11,width:45,height:17,borderRadius:10,backgroundColor:'#4A9A50'},algaeHopper:{position:'absolute',right:3,bottom:9,width:19,height:31,backgroundColor:'#59676A',borderWidth:2,borderColor:'#293A3E'},
  substrateBack:{position:'absolute',left:0,right:0,bottom:47,height:13,backgroundColor:'#6E5C4A',borderTopWidth:3,borderTopColor:'#806D58',zIndex:3},substrate:{position:'absolute',left:0,right:0,bottom:13,height:39,backgroundColor:'#9B7C5F',borderTopWidth:4,borderTopColor:'#C69E70',zIndex:4},pebble:{position:'absolute',bottom:7,borderRadius:4},goldCoin:{position:'absolute',left:'57%',bottom:7,width:9,height:4,borderRadius:5,backgroundColor:'#D7B14B',transform:[{rotate:'12deg'}]},paperClip:{position:'absolute',left:'27%',bottom:7,width:15,height:7,borderWidth:2,borderColor:'#AEB6B6',borderRadius:5,transform:[{rotate:'-15deg'}]},droppedChart:{position:'absolute',left:'69%',bottom:6,width:18,height:10,backgroundColor:'#E9E1C8',transform:[{rotate:'9deg'}]},floorLip:{position:'absolute',left:0,right:0,bottom:0,height:15,backgroundColor:'#443A33',borderTopWidth:3,borderTopColor:'#C29B61',zIndex:18},caption:{position:'absolute',top:30,right:16,alignItems:'flex-end',zIndex:25,backgroundColor:'#061A22C7',borderRadius:9,padding:8,borderWidth:1,borderColor:'#25525D'},count:{fontSize:16},hint:{fontSize:5,color:colors.aqua,marginTop:3},empty:{color:'#A8E5E1',opacity:.82,fontSize:9,alignSelf:'center',marginTop:150},leftSeam:{position:'absolute',left:3,top:16,bottom:14,width:8,backgroundColor:'#8DE0E11C',borderRightWidth:2,borderRightColor:'#9EEEEE38'},rightSeam:{position:'absolute',right:3,top:16,bottom:14,width:8,backgroundColor:'#8DE0E112',borderLeftWidth:2,borderLeftColor:'#9EEEEE2C'},bottomFrame:{position:'absolute',left:-5,right:-5,bottom:-10,height:21,borderRadius:10,backgroundColor:'#263E46',borderWidth:3,borderColor:'#B18849'},
});
