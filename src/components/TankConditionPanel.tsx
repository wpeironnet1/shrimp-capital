import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GameState, tankHealth } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

function conditionWord(normalized:number){
  if(normalized>=92)return 'GREAT';
  if(normalized>=75)return 'GOOD';
  if(normalized>=55)return 'WATCH';
  return 'LOW';
}

function Gauge({label,value,suffix='%',dangerBelow=55,icon,compact,tiny}:{label:string;value:number;suffix?:string;dangerBelow?:number;icon:string;compact:boolean;tiny:boolean}){
  const normalized=suffix==='°F'?Math.max(0,Math.min(100,100-Math.abs(value-76)*12)):Math.max(0,Math.min(100,value));
  const critical=normalized<dangerBelow;
  const word=conditionWord(normalized);
  return <View accessibilityLabel={`${label}: ${Math.round(value)}${suffix}, ${word.toLowerCase()}`} style={[styles.gaugeBox,compact&&styles.gaugeBoxCompact,tiny&&styles.gaugeBoxTiny,critical&&styles.gaugeBoxDanger]}>
    <View style={styles.gaugeHeading}>
      <View style={[styles.iconBox,critical&&styles.iconBoxDanger]}><Ionicons name={icon as any} size={18} color={critical?colors.danger:colors.aqua}/></View>
      <View style={styles.gaugeCopy}><PixelText style={styles.gaugeLabel}>{label}</PixelText><View style={styles.valueRow}><PixelText style={[styles.gaugeValue,critical&&styles.gaugeDanger]}>{Math.round(value)}{suffix}</PixelText><View style={[styles.wordPill,critical&&styles.wordPillDanger]}><PixelText style={[styles.wordText,critical&&styles.wordTextDanger]}>{word}</PixelText></View></View></View>
    </View>
    <View style={styles.track}><View style={[styles.fill,{width:`${normalized}%` as `${number}%`},critical&&styles.fillDanger]}/><View style={styles.trackHighlight}/></View>
  </View>;
}

export function TankConditionPanel({state,onFeed,onService}:{state:GameState;onFeed:()=>void;onService:()=>void}){
  const {width}=useWindowDimensions();
  const compact=width<700;
  const tiny=width<390;
  const health=tankHealth(state);
  const feedDisabled=state.cash<2||state.conditions.feeding>=98;
  const serviceDisabled=state.cash<4||(state.conditions.waterQuality>=98&&state.conditions.oxygen>=98);
  const status=health>=92?'PRISTINE':health>=80?'STABLE':health>=65?'WATCHLIST':health>=45?'DISTRESSED':'CRISIS';

  return <View style={styles.outer}>
    <View style={[styles.header,compact&&styles.headerCompact]}>
      <View style={styles.headerCopy}><PixelText style={styles.kicker}>AQUARIUM OPERATIONS</PixelText><PixelText style={styles.title}>TANK CONDITION</PixelText><PixelText style={styles.headerHint}>KEEP THESE FOUR METRICS HEALTHY TO PROTECT OUTPUT.</PixelText></View>
      <View style={[styles.statusPill,health<65&&styles.statusPillDanger]}><View style={[styles.statusDot,health<65&&styles.statusDotDanger]}/><View><PixelText style={styles.statusLabel}>OPS SCORE</PixelText><PixelText style={styles.status}>{status} · {health}</PixelText></View></View>
    </View>
    <View style={[styles.gaugeGrid,tiny&&styles.gaugeGridTiny]}>
      <Gauge compact={compact} tiny={tiny} icon="water" label="WATER" value={state.conditions.waterQuality}/>
      <Gauge compact={compact} tiny={tiny} icon="cloud" label="OXYGEN" value={state.conditions.oxygen}/>
      <Gauge compact={compact} tiny={tiny} icon="fish" label="FEED" value={state.conditions.feeding}/>
      <Gauge compact={compact} tiny={tiny} icon="thermometer" label="TEMP" value={state.conditions.temperature} suffix="°F"/>
    </View>
    <View style={[styles.actions,tiny&&styles.actionsTiny]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Feed tank for two dollars" disabled={feedDisabled} onPress={onFeed} style={({pressed})=>[styles.action,feedDisabled&&styles.disabled,pressed&&!feedDisabled&&styles.pressed]}><View style={styles.actionIcon}><Ionicons name="fish" size={19} color={colors.ink}/></View><View style={styles.actionCopy}><PixelText style={styles.actionTitle}>FEED TANK</PixelText><PixelText style={styles.actionCost}>$2 · +42 FEED</PixelText></View></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Maintain water and oxygen for four dollars" disabled={serviceDisabled} onPress={onService} style={({pressed})=>[styles.action,styles.service,serviceDisabled&&styles.disabled,pressed&&!serviceDisabled&&styles.pressed]}><View style={[styles.actionIcon,styles.serviceIcon]}><Ionicons name="construct" size={19} color={colors.cream}/></View><View style={styles.actionCopy}><PixelText style={[styles.actionTitle,styles.serviceText]}>MAINTAIN</PixelText><PixelText style={[styles.actionCost,styles.serviceCost]}>$4 · WATER + O₂</PixelText></View></Pressable>
    </View>
    <View style={styles.footerBand}><PixelText style={styles.footer}>GOOD CONDITIONS = FASTER HATCHING + STRONGER SALE VALUE</PixelText></View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071C24',borderWidth:2,borderColor:colors.brass,padding:4,shadowColor:'#000',shadowOpacity:.4,shadowRadius:0,shadowOffset:{width:3,height:4}},
  header:{backgroundColor:'#0C2B35',borderWidth:1,borderColor:'#365964',borderBottomWidth:2,borderBottomColor:colors.brass,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},headerCompact:{padding:10,alignItems:'flex-start',flexDirection:'column'},headerCopy:{flex:1,minWidth:0},
  kicker:{color:colors.aqua,fontSize:8,letterSpacing:1},title:{fontFamily:'PressStart2P',fontSize:10,lineHeight:15,marginTop:5,color:colors.cream},headerHint:{fontSize:8,lineHeight:12,color:'#B6C9CC',marginTop:7},
  statusPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#153A32',borderWidth:2,borderColor:'#426F5C',paddingVertical:8,paddingHorizontal:10,minWidth:125},statusPillDanger:{backgroundColor:'#452629',borderColor:'#844A4C'},statusDot:{width:8,height:8,backgroundColor:colors.success},statusDotDanger:{backgroundColor:colors.danger},statusLabel:{fontSize:6,color:'#AFC5C3',letterSpacing:.8},status:{fontSize:9,color:colors.cream,marginTop:2},
  gaugeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,padding:8,backgroundColor:'#0A242D'},gaugeGridTiny:{gap:6,padding:6},
  gaugeBox:{width:'49%',minWidth:145,backgroundColor:'#0E3340',borderWidth:2,borderColor:'#285663',padding:10},gaugeBoxCompact:{width:'48.7%',minWidth:0,padding:9},gaugeBoxTiny:{width:'100%'},gaugeBoxDanger:{borderColor:'#7B4548',backgroundColor:'#36282E'},
  gaugeHeading:{flexDirection:'row',alignItems:'center',gap:9},iconBox:{width:36,height:36,backgroundColor:'#071B23',borderWidth:1,borderColor:'#37616B',alignItems:'center',justifyContent:'center'},iconBoxDanger:{borderColor:'#7B4548',backgroundColor:'#241A20'},gaugeCopy:{flex:1,minWidth:0},gaugeLabel:{fontSize:8,color:'#B4C5C8',letterSpacing:.8},valueRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:4},gaugeValue:{fontFamily:'PressStart2P',fontSize:9,color:colors.aqua,lineHeight:13},gaugeDanger:{color:colors.danger},
  wordPill:{backgroundColor:'#14372F',borderWidth:1,borderColor:'#4B7F68',paddingHorizontal:6,paddingVertical:3},wordPillDanger:{backgroundColor:'#4A292C',borderColor:'#875054'},wordText:{fontSize:6,color:'#9FE2B3'},wordTextDanger:{color:'#FFB1AC'},
  track:{height:12,backgroundColor:'#06161C',borderWidth:2,borderColor:'#294B53',marginTop:9,overflow:'hidden',position:'relative'},fill:{height:'100%',backgroundColor:colors.success},fillDanger:{backgroundColor:colors.danger},trackHighlight:{position:'absolute',left:0,right:0,top:0,height:2,backgroundColor:'#FFFFFF2C'},
  actions:{flexDirection:'row',gap:8,paddingHorizontal:8,paddingBottom:8,backgroundColor:'#0A242D'},actionsTiny:{flexDirection:'column'},
  action:{flex:1,minHeight:62,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingHorizontal:10},service:{backgroundColor:'#1B5965',borderColor:'#69BFC0',borderBottomColor:'#0D343C'},
  actionIcon:{width:36,height:36,borderWidth:2,borderColor:'#7E5C20',backgroundColor:'#F3D377',alignItems:'center',justifyContent:'center'},serviceIcon:{backgroundColor:'#123D46',borderColor:'#75C8C7'},actionCopy:{flexShrink:1},actionTitle:{color:colors.ink,fontFamily:'PressStart2P',fontSize:7,lineHeight:11},actionCost:{color:'#654816',fontSize:9,marginTop:4},serviceText:{color:colors.cream},serviceCost:{color:'#C5E5E0'},disabled:{opacity:.32,borderBottomWidth:2},pressed:{transform:[{translateY:3}],borderBottomWidth:2},
  footerBand:{backgroundColor:'#071A22',borderTopWidth:2,borderTopColor:colors.brass,padding:8},footer:{color:'#AFC0C3',fontSize:8,textAlign:'center',letterSpacing:.25},
});
