import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GameState, tankHealth } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

function Gauge({ label, value, suffix='%', dangerBelow=55, icon }: { label:string; value:number; suffix?:string; dangerBelow?:number; icon:string }) {
  const normalized=suffix==='°F'?Math.max(0,Math.min(100,100-Math.abs(value-76)*12)):Math.max(0,Math.min(100,value));
  const critical=normalized<dangerBelow;
  return <View style={styles.gaugeBox}>
    <View style={styles.gaugeHeading}><View style={styles.iconBox}><Ionicons name={icon as any} size={14} color={critical?colors.danger:colors.aqua}/></View><View style={styles.gaugeCopy}><PixelText style={styles.gaugeLabel}>{label}</PixelText><PixelText style={[styles.gaugeValue,critical&&styles.gaugeDanger]}>{Math.round(value)}{suffix}</PixelText></View></View>
    <View style={styles.track}><View style={[styles.fill,{width:`${normalized}%` as `${number}%`},critical&&styles.fillDanger]}/><View style={styles.trackHighlight}/></View>
  </View>;
}

export function TankConditionPanel({state,onFeed,onService}:{state:GameState;onFeed:()=>void;onService:()=>void}){
  const health=tankHealth(state);const feedDisabled=state.cash<2||state.conditions.feeding>=98;const serviceDisabled=state.cash<4||(state.conditions.waterQuality>=98&&state.conditions.oxygen>=98);
  const status=health>=92?'PRISTINE':health>=80?'STABLE':health>=65?'WATCHLIST':health>=45?'DISTRESSED':'CRISIS';
  return <View style={styles.outer}>
    <View style={styles.header}><View><PixelText style={styles.kicker}>AQUARIUM OPERATIONS</PixelText><PixelText style={styles.title}>TANK CONDITION</PixelText></View><View style={[styles.statusPill,health<65&&styles.statusPillDanger]}><View style={[styles.statusDot,health<65&&styles.statusDotDanger]}/><PixelText style={styles.status}>{status} · {health}</PixelText></View></View>
    <View style={styles.gaugeGrid}><Gauge icon="water" label="WATER" value={state.conditions.waterQuality}/><Gauge icon="cloud" label="OXYGEN" value={state.conditions.oxygen}/><Gauge icon="fish" label="FEED" value={state.conditions.feeding}/><Gauge icon="thermometer" label="TEMP" value={state.conditions.temperature} suffix="°F"/></View>
    <View style={styles.actions}>
      <Pressable disabled={feedDisabled} onPress={onFeed} style={({pressed})=>[styles.action,feedDisabled&&styles.disabled,pressed&&!feedDisabled&&styles.pressed]}><View style={styles.actionIcon}><Ionicons name="fish" size={18} color={colors.ink}/></View><View><PixelText style={styles.actionTitle}>FEED TANK</PixelText><PixelText style={styles.actionCost}>$2 · +42 FEED</PixelText></View></Pressable>
      <Pressable disabled={serviceDisabled} onPress={onService} style={({pressed})=>[styles.action,styles.service,serviceDisabled&&styles.disabled,pressed&&!serviceDisabled&&styles.pressed]}><View style={[styles.actionIcon,styles.serviceIcon]}><Ionicons name="construct" size={18} color={colors.cream}/></View><View><PixelText style={[styles.actionTitle,styles.serviceText]}>MAINTAIN</PixelText><PixelText style={[styles.actionCost,styles.serviceCost]}>$4 · WATER + O₂</PixelText></View></Pressable>
    </View>
    <View style={styles.footerBand}><PixelText style={styles.footer}>FILTERS, HEAT, OXYGEN & FEEDING ALL AFFECT OUTPUT</PixelText></View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071C24',borderWidth:2,borderColor:colors.brass,padding:4,shadowColor:'#000',shadowOpacity:.4,shadowRadius:0,shadowOffset:{width:3,height:4}},
  header:{backgroundColor:'#0C2B35',borderWidth:1,borderColor:'#365964',borderBottomWidth:2,borderBottomColor:colors.brass,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},kicker:{color:colors.aqua,fontSize:5,letterSpacing:1.7},title:{fontSize:13,marginTop:3,color:colors.cream},
  statusPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#153A32',borderWidth:2,borderColor:'#426F5C',paddingVertical:5,paddingHorizontal:8},statusPillDanger:{backgroundColor:'#452629',borderColor:'#844A4C'},statusDot:{width:6,height:6,backgroundColor:colors.success},statusDotDanger:{backgroundColor:colors.danger},status:{fontSize:6,color:colors.cream},
  gaugeGrid:{flexDirection:'row',flexWrap:'wrap',gap:6,padding:8,backgroundColor:'#0A242D'},gaugeBox:{width:'49%',minWidth:145,backgroundColor:'#0E3340',borderWidth:2,borderColor:'#285663',padding:8},gaugeHeading:{flexDirection:'row',alignItems:'center',gap:8},iconBox:{width:27,height:27,backgroundColor:'#071B23',borderWidth:1,borderColor:'#37616B',alignItems:'center',justifyContent:'center'},gaugeCopy:{flex:1},gaugeLabel:{fontSize:5,color:colors.muted,letterSpacing:1.2},gaugeValue:{fontSize:9,color:colors.aqua,marginTop:2},gaugeDanger:{color:colors.danger},track:{height:9,backgroundColor:'#06161C',borderWidth:2,borderColor:'#294B53',marginTop:7,overflow:'hidden',position:'relative'},fill:{height:'100%',backgroundColor:colors.success},fillDanger:{backgroundColor:colors.danger},trackHighlight:{position:'absolute',left:0,right:0,top:0,height:2,backgroundColor:'#FFFFFF2C'},
  actions:{flexDirection:'row',gap:7,paddingHorizontal:8,paddingBottom:8,backgroundColor:'#0A242D'},action:{flex:1,minHeight:52,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingHorizontal:8},service:{backgroundColor:'#1B5965',borderColor:'#69BFC0',borderBottomColor:'#0D343C'},actionIcon:{width:31,height:31,borderWidth:2,borderColor:'#7E5C20',backgroundColor:'#F3D377',alignItems:'center',justifyContent:'center'},serviceIcon:{backgroundColor:'#123D46',borderColor:'#75C8C7'},actionTitle:{color:colors.ink,fontSize:7},actionCost:{color:'#654816',fontSize:5,marginTop:3},serviceText:{color:colors.cream},serviceCost:{color:'#B3DCDD'},disabled:{opacity:.32,borderBottomWidth:2},pressed:{transform:[{translateY:3}],borderBottomWidth:2},footerBand:{backgroundColor:'#071A22',borderTopWidth:2,borderTopColor:colors.brass,padding:7},footer:{color:colors.muted,fontSize:5,textAlign:'center',letterSpacing:.9},
});
