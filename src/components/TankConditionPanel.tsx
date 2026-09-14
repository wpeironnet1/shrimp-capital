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

function Gauge({label,value,suffix='%',dangerBelow=55,icon,compact,stacked}:{label:string;value:number;suffix?:string;dangerBelow?:number;icon:string;compact:boolean;stacked:boolean}){
  const normalized=suffix==='°F'?Math.max(0,Math.min(100,100-Math.abs(value-76)*12)):Math.max(0,Math.min(100,value));
  const critical=normalized<dangerBelow;
  const word=conditionWord(normalized);
  return <View accessibilityLabel={`${label}: ${Math.round(value)}${suffix}, ${word.toLowerCase()}`} style={[styles.gaugeBox,compact&&styles.gaugeBoxCompact,stacked&&styles.gaugeBoxStacked,critical&&styles.gaugeBoxDanger]}>
    <View style={styles.gaugeHeading}>
      <View style={[styles.iconBox,critical&&styles.iconBoxDanger]}><Ionicons name={icon as any} size={20} color={critical?colors.danger:colors.aqua}/></View>
      <View style={styles.gaugeCopy}>
        <PixelText style={styles.gaugeLabel}>{label}</PixelText>
        <View style={styles.valueRow}>
          <PixelText style={[styles.gaugeValue,critical&&styles.gaugeDanger]}>{Math.round(value)}{suffix}</PixelText>
          <View style={[styles.wordPill,critical&&styles.wordPillDanger]}><PixelText style={[styles.wordText,critical&&styles.wordTextDanger]}>{word}</PixelText></View>
        </View>
      </View>
    </View>
    <View style={styles.track}><View style={[styles.fill,{width:`${normalized}%` as `${number}%`},critical&&styles.fillDanger]}/><View style={styles.trackHighlight}/></View>
  </View>;
}

export function TankConditionPanel({state,onFeed,onService}:{state:GameState;onFeed:()=>void;onService:()=>void}){
  const {width}=useWindowDimensions();
  const compact=width<700;
  const stacked=width<520;
  const health=tankHealth(state);
  const feedDisabled=state.cash<2||state.conditions.feeding>=98;
  const serviceDisabled=state.cash<4||(state.conditions.waterQuality>=98&&state.conditions.oxygen>=98);
  const status=health>=92?'PRISTINE':health>=80?'STABLE':health>=65?'WATCHLIST':health>=45?'DISTRESSED':'CRISIS';
  const needsFeed=state.conditions.feeding<70;
  const needsService=state.conditions.waterQuality<70||state.conditions.oxygen<70;
  const recommendation=needsService?'MAINTENANCE RECOMMENDED':needsFeed?'FEEDING RECOMMENDED':'SYSTEMS RUNNING WELL';

  return <View style={styles.outer}>
    <View style={[styles.header,compact&&styles.headerCompact]}>
      <View style={styles.headerCopy}>
        <PixelText style={styles.kicker}>AQUARIUM OPERATIONS</PixelText>
        <PixelText style={styles.title}>TANK CONDITION</PixelText>
        <PixelText style={styles.headerHint}>HEALTHY WATER, OXYGEN, FEEDING, AND TEMPERATURE PROTECT HATCH SPEED AND SALE VALUE.</PixelText>
      </View>
      <View style={[styles.statusPill,health<65&&styles.statusPillDanger]}>
        <View style={[styles.statusDot,health<65&&styles.statusDotDanger]}/>
        <View style={styles.statusCopy}><PixelText style={styles.statusLabel}>OPS SCORE</PixelText><PixelText style={styles.status}>{status} · {health}%</PixelText></View>
      </View>
    </View>

    <View style={[styles.recommendation,health<65&&styles.recommendationDanger]}>
      <Ionicons name={needsService?'construct':needsFeed?'fish':'checkmark-circle'} size={18} color={health<65?colors.danger:colors.goldLight}/>
      <PixelText style={[styles.recommendationText,health<65&&styles.recommendationTextDanger]}>{recommendation}</PixelText>
    </View>

    <View style={[styles.gaugeGrid,stacked&&styles.gaugeGridStacked]}>
      <Gauge compact={compact} stacked={stacked} icon="water" label="WATER" value={state.conditions.waterQuality}/>
      <Gauge compact={compact} stacked={stacked} icon="cloud" label="OXYGEN" value={state.conditions.oxygen}/>
      <Gauge compact={compact} stacked={stacked} icon="fish" label="FEED" value={state.conditions.feeding}/>
      <Gauge compact={compact} stacked={stacked} icon="thermometer" label="TEMP" value={state.conditions.temperature} suffix="°F"/>
    </View>

    <View style={[styles.actions,stacked&&styles.actionsStacked]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Feed tank for two dollars" disabled={feedDisabled} onPress={onFeed} style={({pressed})=>[styles.action,feedDisabled&&styles.disabled,pressed&&!feedDisabled&&styles.pressed]}>
        <View style={styles.actionIcon}><Ionicons name="fish" size={20} color={colors.ink}/></View>
        <View style={styles.actionCopy}><PixelText style={styles.actionTitle}>FEED TANK</PixelText><PixelText style={styles.actionCost}>$2 · +42 FEED</PixelText></View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Maintain water and oxygen for four dollars" disabled={serviceDisabled} onPress={onService} style={({pressed})=>[styles.action,styles.service,serviceDisabled&&styles.disabled,pressed&&!serviceDisabled&&styles.pressed]}>
        <View style={[styles.actionIcon,styles.serviceIcon]}><Ionicons name="construct" size={20} color={colors.cream}/></View>
        <View style={styles.actionCopy}><PixelText style={[styles.actionTitle,styles.serviceText]}>MAINTAIN</PixelText><PixelText style={[styles.actionCost,styles.serviceCost]}>$4 · WATER + O₂</PixelText></View>
      </Pressable>
    </View>
    <View style={styles.footerBand}><PixelText style={styles.footer}>BETTER CONDITIONS → FASTER HATCHING → STRONGER SALE VALUE</PixelText></View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071C24',borderWidth:2,borderColor:colors.brass,padding:4,shadowColor:'#000',shadowOpacity:.4,shadowRadius:0,shadowOffset:{width:3,height:4}},
  header:{backgroundColor:'#0C2B35',borderWidth:1,borderColor:'#365964',borderBottomWidth:2,borderBottomColor:colors.brass,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:14},
  headerCompact:{padding:12,alignItems:'flex-start',flexDirection:'column'},
  headerCopy:{flex:1,minWidth:0},
  kicker:{color:colors.aqua,fontSize:12,letterSpacing:.5},
  title:{fontFamily:'PressStart2P',fontSize:12,lineHeight:18,marginTop:6,color:colors.cream},
  headerHint:{fontSize:13,lineHeight:19,color:'#C8D7D9',marginTop:8,maxWidth:760},
  statusPill:{flexDirection:'row',alignItems:'center',gap:9,backgroundColor:'#153A32',borderWidth:2,borderColor:'#426F5C',paddingVertical:10,paddingHorizontal:12,minWidth:150,minHeight:56},
  statusPillDanger:{backgroundColor:'#452629',borderColor:'#844A4C'},
  statusDot:{width:10,height:10,backgroundColor:colors.success},
  statusDotDanger:{backgroundColor:colors.danger},
  statusCopy:{flexShrink:1},
  statusLabel:{fontSize:11,color:'#BFD0CE',letterSpacing:.35},
  status:{fontSize:12,color:colors.cream,marginTop:4},
  recommendation:{minHeight:42,flexDirection:'row',alignItems:'center',gap:9,backgroundColor:'#132D31',borderBottomWidth:1,borderBottomColor:'#36545A',paddingHorizontal:12,paddingVertical:8},
  recommendationDanger:{backgroundColor:'#342327'},
  recommendationText:{fontSize:12,color:colors.goldLight,letterSpacing:.3},
  recommendationTextDanger:{color:'#FFB6B0'},
  gaugeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,padding:8,backgroundColor:'#0A242D'},
  gaugeGridStacked:{gap:7,padding:7},
  gaugeBox:{width:'49%',minWidth:160,backgroundColor:'#0E3340',borderWidth:2,borderColor:'#285663',padding:11},
  gaugeBoxCompact:{width:'48.7%',minWidth:0,padding:10},
  gaugeBoxStacked:{width:'100%',minWidth:0},
  gaugeBoxDanger:{borderColor:'#7B4548',backgroundColor:'#36282E'},
  gaugeHeading:{flexDirection:'row',alignItems:'center',gap:10},
  iconBox:{width:40,height:40,backgroundColor:'#071B23',borderWidth:1,borderColor:'#37616B',alignItems:'center',justifyContent:'center'},
  iconBoxDanger:{borderColor:'#7B4548',backgroundColor:'#241A20'},
  gaugeCopy:{flex:1,minWidth:0},
  gaugeLabel:{fontSize:12,color:'#C4D2D4',letterSpacing:.4},
  valueRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:5},
  gaugeValue:{fontFamily:'PressStart2P',fontSize:11,color:colors.aqua,lineHeight:16},
  gaugeDanger:{color:colors.danger},
  wordPill:{backgroundColor:'#14372F',borderWidth:1,borderColor:'#4B7F68',paddingHorizontal:8,paddingVertical:5,minWidth:58,alignItems:'center'},
  wordPillDanger:{backgroundColor:'#4A292C',borderColor:'#875054'},
  wordText:{fontSize:11,color:'#AEE7BD'},
  wordTextDanger:{color:'#FFB1AC'},
  track:{height:14,backgroundColor:'#06161C',borderWidth:2,borderColor:'#294B53',marginTop:10,overflow:'hidden',position:'relative'},
  fill:{height:'100%',backgroundColor:colors.success},
  fillDanger:{backgroundColor:colors.danger},
  trackHighlight:{position:'absolute',left:0,right:0,top:0,height:2,backgroundColor:'#FFFFFF2C'},
  actions:{flexDirection:'row',gap:8,paddingHorizontal:8,paddingBottom:8,backgroundColor:'#0A242D'},
  actionsStacked:{flexDirection:'column'},
  action:{flex:1,minHeight:68,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:11,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingHorizontal:12,paddingVertical:9},
  service:{backgroundColor:'#1B5965',borderColor:'#69BFC0',borderBottomColor:'#0D343C'},
  actionIcon:{width:40,height:40,borderWidth:2,borderColor:'#7E5C20',backgroundColor:'#F3D377',alignItems:'center',justifyContent:'center'},
  serviceIcon:{backgroundColor:'#123D46',borderColor:'#75C8C7'},
  actionCopy:{flexShrink:1},
  actionTitle:{color:colors.ink,fontFamily:'PressStart2P',fontSize:11,lineHeight:16},
  actionCost:{color:'#654816',fontSize:12,marginTop:5},
  serviceText:{color:colors.cream},
  serviceCost:{color:'#D6EBE7'},
  disabled:{opacity:.32,borderBottomWidth:2},
  pressed:{transform:[{translateY:3}],borderBottomWidth:2},
  footerBand:{backgroundColor:'#071A22',borderTopWidth:2,borderTopColor:colors.brass,padding:10},
  footer:{color:'#C1CDD0',fontSize:12,textAlign:'center',letterSpacing:.15,lineHeight:17},
});
