import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { decorItems, DecorSlot } from '../game/decor';
import { PixelDecor } from './PixelDecor';
import { PixelText } from './PixelText';

const desktopPositions:Record<DecorSlot,object>={
  'floor-left':{left:38,bottom:78},'floor-center':{left:'43%',bottom:77},'floor-right':{right:132,bottom:78},
  'wall-left':{left:118,top:66},'wall-center':{left:'42%',top:58},'wall-right':{right:126,top:69},ceiling:{left:'44%',top:38},corner:{right:42,bottom:78},
};
const mobilePositions:Record<DecorSlot,object>={
  'floor-left':{left:16,bottom:78},'floor-center':{left:'38%',bottom:77},'floor-right':{right:70,bottom:78},
  'wall-left':{left:42,top:66},'wall-center':{left:'39%',top:58},'wall-right':{right:54,top:69},ceiling:{left:'40%',top:38},corner:{right:14,bottom:78},
};
const tinyPositions:Record<DecorSlot,object>={
  'floor-left':{left:8,bottom:78},'floor-center':{left:'36%',bottom:77},'floor-right':{right:42,bottom:78},
  'wall-left':{left:18,top:68},'wall-center':{left:'36%',top:58},'wall-right':{right:28,top:70},ceiling:{left:'37%',top:38},corner:{right:5,bottom:78},
};
const desktopScales:Record<DecorSlot,number>={'floor-left':.88,'floor-center':.9,'floor-right':.88,'wall-left':.78,'wall-center':.82,'wall-right':.78,ceiling:.83,corner:.84};
const mobileScales:Record<DecorSlot,number>={'floor-left':.72,'floor-center':.74,'floor-right':.72,'wall-left':.66,'wall-center':.69,'wall-right':.66,ceiling:.68,corner:.7};
const tinyScales:Record<DecorSlot,number>={'floor-left':.62,'floor-center':.65,'floor-right':.62,'wall-left':.57,'wall-center':.6,'wall-right':.57,ceiling:.59,corner:.61};
const floorSlots=new Set<DecorSlot>(['floor-left','floor-center','floor-right','corner']);
const wallSlots=new Set<DecorSlot>(['wall-left','wall-center','wall-right']);

function StatusPulse({delay=0}:{delay?:number}){
  const pulse=useRef(new Animated.Value(.35)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([
    Animated.delay(delay),
    Animated.timing(pulse,{toValue:1,duration:360,easing:Easing.out(Easing.quad),useNativeDriver:true}),
    Animated.timing(pulse,{toValue:.28,duration:820,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),
    Animated.delay(1450+delay),
  ]));loop.start();return()=>loop.stop();},[delay,pulse]);
  return <Animated.View style={[styles.statusLamp,{opacity:pulse,transform:[{scale:pulse.interpolate({inputRange:[.28,1],outputRange:[.85,1.35]})}]}]}/>;
}

function FloorActivity({delay=0}:{delay?:number}){
  const rise=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([
    Animated.delay(900+delay),
    Animated.timing(rise,{toValue:1,duration:2400+delay,easing:Easing.linear,useNativeDriver:true}),
    Animated.timing(rise,{toValue:0,duration:0,useNativeDriver:true}),
    Animated.delay(1800),
  ]));loop.start();return()=>loop.stop();},[delay,rise]);
  const opacity=rise.interpolate({inputRange:[0,.08,.72,1],outputRange:[0,.7,.42,0]});
  return <Animated.View pointerEvents="none" style={[styles.floorActivity,{opacity,transform:[{translateY:rise.interpolate({inputRange:[0,1],outputRange:[0,-42]})},{translateX:rise.interpolate({inputRange:[0,.5,1],outputRange:[0,5,-2]})}]}]}><View style={styles.activityBubbleA}/><View style={styles.activityBubbleB}/><View style={styles.activityBubbleC}/></Animated.View>;
}

function WallScan({delay=0}:{delay?:number}){
  const scan=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([
    Animated.delay(600+delay),
    Animated.timing(scan,{toValue:1,duration:1700,easing:Easing.linear,useNativeDriver:true}),
    Animated.timing(scan,{toValue:0,duration:0,useNativeDriver:true}),
    Animated.delay(2200+delay),
  ]));loop.start();return()=>loop.stop();},[delay,scan]);
  return <Animated.View pointerEvents="none" style={[styles.wallScan,{opacity:scan.interpolate({inputRange:[0,.1,.8,1],outputRange:[0,.65,.4,0]}),transform:[{translateX:scan.interpolate({inputRange:[0,1],outputRange:[0,61]})}]}]}/>;
}

function MarketTicker({compact}:{compact:boolean}){
  const crawl=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([
    Animated.timing(crawl,{toValue:1,duration:9200,easing:Easing.linear,useNativeDriver:true}),
    Animated.timing(crawl,{toValue:0,duration:0,useNativeDriver:true}),
  ]));loop.start();return()=>loop.stop();},[crawl]);
  const distance=compact?245:390;
  return <View pointerEvents="none" style={styles.tickerRail}>
    <View style={styles.tickerLamp}/><View style={styles.tickerLampAmber}/>
    <Animated.View style={[styles.tickerCrawl,{transform:[{translateX:crawl.interpolate({inputRange:[0,1],outputRange:[distance,-distance]})}]}]}>
      <PixelText style={styles.tickerText}>SHELL ST ▲12.4   KRILL +8.2   ROE ▲4.7   TANK INDEX +19.8</PixelText>
    </Animated.View>
    <View style={styles.tickerScanline}/>
  </View>;
}

function DecorDepth({slot,scale,index}:{slot:DecorSlot;scale:number;index:number}){
  if(floorSlots.has(slot))return <View pointerEvents="none" style={[styles.floorShadow,{transform:[{scaleX:scale}]}]}><View style={styles.floorHighlight}/><View style={styles.floorPixelA}/><View style={styles.floorPixelB}/><FloorActivity delay={index*210}/></View>;
  if(wallSlots.has(slot))return <View pointerEvents="none" style={[styles.wallPlate,{transform:[{scale}]}]}><View style={styles.wallPlateInner}/><WallScan delay={index*190}/><StatusPulse delay={index*170}/><View style={styles.statusLampDim}/><View style={styles.plateVent}/></View>;
  if(slot==='ceiling')return <View pointerEvents="none" style={[styles.ceilingGlow,{transform:[{scaleX:scale}]}]}><View style={styles.ceilingCore}/></View>;
  return null;
}

export function TankOfficeDecor({placed}:{placed:Partial<Record<DecorSlot,string>>}){
  const {width}=useWindowDimensions();const tiny=width<430;const mobile=width<700;
  const positions=tiny?tinyPositions:mobile?mobilePositions:desktopPositions;const scales=tiny?tinyScales:mobile?mobileScales:desktopScales;
  const furnished=Object.values(placed).filter(Boolean).length;
  return <>{furnished>=3&&<MarketTicker compact={mobile}/>} {Object.entries(placed).map(([slot,id],index)=>{const typedSlot=slot as DecorSlot;if(!id||!decorItems.some(item=>item.id===id))return null;const scale=scales[typedSlot];return <View pointerEvents="none" key={`${slot}-${id}`} style={[styles.decorAnchor,positions[typedSlot]]}><DecorDepth slot={typedSlot} scale={scale} index={index}/><View style={styles.decorSprite}><PixelDecor id={id} animate scale={scale}/></View></View>;})}</>;
}

const styles=StyleSheet.create({
  decorAnchor:{position:'absolute',zIndex:9},decorSprite:{zIndex:2},
  tickerRail:{position:'absolute',left:18,right:18,top:38,height:24,zIndex:7,overflow:'hidden',backgroundColor:'#03141DEB',borderWidth:2,borderColor:'#80672E',justifyContent:'center'},
  tickerCrawl:{position:'absolute',left:0,width:520,justifyContent:'center'},tickerText:{fontFamily:'PressStart2P',fontSize:9,color:'#A7F5C0'},
  tickerLamp:{position:'absolute',left:5,top:5,width:4,height:4,backgroundColor:'#76E99A',zIndex:3},tickerLampAmber:{position:'absolute',left:5,bottom:5,width:4,height:4,backgroundColor:'#E5B64D',zIndex:3},
  tickerScanline:{position:'absolute',left:0,right:0,bottom:3,height:1,backgroundColor:'#A7F5C02B'},
  floorShadow:{position:'absolute',left:-13,bottom:-4,width:78,height:10,backgroundColor:'#03172266',borderRadius:2,borderTopWidth:2,borderTopColor:'#7FD4D52B',zIndex:0},
  floorHighlight:{position:'absolute',left:12,right:12,top:2,height:2,backgroundColor:'#C6F7E833'},
  floorPixelA:{position:'absolute',left:8,bottom:1,width:5,height:2,backgroundColor:'#4B9BA444'},floorPixelB:{position:'absolute',right:10,bottom:2,width:8,height:2,backgroundColor:'#8ED7CF30'},
  floorActivity:{position:'absolute',left:29,top:-3,width:20,height:16,zIndex:1},
  activityBubbleA:{position:'absolute',left:2,bottom:0,width:4,height:4,borderWidth:1,borderColor:'#BDF9EF',backgroundColor:'#8ADFD344'},
  activityBubbleB:{position:'absolute',left:10,bottom:5,width:3,height:3,borderWidth:1,borderColor:'#A9E9E0',backgroundColor:'#8ADFD333'},
  activityBubbleC:{position:'absolute',left:15,bottom:1,width:2,height:2,backgroundColor:'#D8FFF5AA'},
  wallPlate:{position:'absolute',left:-10,top:-8,width:82,height:52,backgroundColor:'#092D3B70',borderWidth:2,borderColor:'#5FAAB34A',zIndex:0,overflow:'hidden'},
  wallPlateInner:{position:'absolute',left:4,right:4,top:4,bottom:4,borderWidth:1,borderColor:'#B4E8D92B'},
  wallScan:{position:'absolute',left:5,top:10,width:8,height:28,backgroundColor:'#A9F5D31F',borderLeftWidth:1,borderLeftColor:'#D9FFF277'},
  statusLamp:{position:'absolute',right:5,top:5,width:5,height:5,backgroundColor:'#8DE67D',borderWidth:1,borderColor:'#E6FFD9'},
  statusLampDim:{position:'absolute',right:13,top:6,width:3,height:3,backgroundColor:'#E5B64D',opacity:.55},
  plateVent:{position:'absolute',right:5,bottom:5,width:15,height:2,backgroundColor:'#03172288',borderLeftWidth:5,borderRightWidth:5,borderColor:'#4E899144'},
  ceilingGlow:{position:'absolute',left:-24,top:-8,width:108,height:18,backgroundColor:'#B8F3DF16',borderBottomWidth:2,borderBottomColor:'#D7FFF43B',zIndex:0},
  ceilingCore:{position:'absolute',left:28,right:28,bottom:1,height:3,backgroundColor:'#D9FFF277'},
});
