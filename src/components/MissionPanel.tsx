import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { missions } from '../game/catalog';
import { GameState, missionProgress } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function MissionPanel({state,onClaim}:{state:GameState;onClaim:(id:string)=>void}){
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<390;
  const missionIndex=missions.findIndex(entry=>!state.claimedMissions[entry.id]);
  const mission=missions[missionIndex];
  if(!mission)return <View style={styles.complete}><Ionicons name="trophy" size={28} color={colors.goldLight}/><View style={styles.completeCopy}><PixelText style={styles.completeTitle}>OPENING BELL CLEARED</PixelText><PixelText style={styles.detail}>All current mandates have been completed.</PixelText></View></View>;
  const progress=Math.min(mission.target,missionProgress(state,mission.metric));
  const ready=progress>=mission.target;
  const progressPct=Math.min(100,Math.round(progress/mission.target*100));

  return <View style={styles.frame} accessibilityLabel={`${mission.detail}. ${progress} of ${mission.target} complete.`}>
    <View style={[styles.headerBand,mobile&&styles.headerBandMobile,tiny&&styles.headerBandTiny]}>
      <View style={styles.headerCopy}><PixelText style={styles.kicker}>CURRENT MANDATE</PixelText><PixelText style={styles.mandateNumber}>{missionIndex+1} OF {missions.length}</PixelText></View>
      <View style={[styles.rewards,mobile&&styles.rewardsMobile,tiny&&styles.rewardsTiny]}><PixelText style={styles.reward}>+${mission.reward.toLocaleString()}</PixelText><PixelText style={styles.rewardXp}>+{mission.rewardXp} XP</PixelText></View>
    </View>
    <View style={[styles.card,tiny&&styles.cardTiny]}>
      <PixelText style={[styles.title,mobile&&styles.titleMobile]}>{mission.title.toUpperCase()}</PixelText>
      <PixelText style={styles.detail}>{mission.detail}</PixelText>
      <View style={[styles.progressRow,tiny&&styles.progressRowTiny]}><PixelText style={styles.progressLabel}>PROGRESS</PixelText><PixelText style={styles.progressText}>{progress} / {mission.target}</PixelText></View>
      <View style={[styles.percentRow,tiny&&styles.percentRowTiny]}><PixelText style={styles.percentText}>{progressPct}% COMPLETE</PixelText></View>
      <View style={styles.track} accessible accessibilityRole="progressbar" accessibilityValue={{min:0,max:100,now:progressPct}}><View style={[styles.fill,{width:`${progressPct}%`}]} /><View style={styles.trackShine}/></View>
      {ready&&<Pressable accessibilityRole="button" accessibilityLabel={`Claim mandate reward of ${mission.reward} dollars and ${mission.rewardXp} XP`} onPress={()=>onClaim(mission.id)} style={({pressed})=>[styles.claim,tiny&&styles.claimTiny,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM REWARD</PixelText></Pressable>}
    </View>
  </View>;
}

const styles=StyleSheet.create({
  frame:{borderWidth:2,borderColor:colors.brass,backgroundColor:'#081D25',padding:3,shadowColor:'#000',shadowOpacity:.38,shadowRadius:0,shadowOffset:{width:3,height:4}},
  headerBand:{backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,paddingHorizontal:12,paddingVertical:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},headerBandMobile:{paddingHorizontal:11,paddingVertical:10},headerBandTiny:{alignItems:'stretch',gap:8},headerCopy:{flex:1,minWidth:0},
  card:{backgroundColor:'#123844',padding:14,borderWidth:1,borderColor:'#315E67'},cardTiny:{padding:12},kicker:{color:colors.aqua,fontSize:13,letterSpacing:.25},mandateNumber:{color:'#AFC6CA',fontSize:13,marginTop:2},title:{fontFamily:'PressStart2P',fontSize:12,lineHeight:20,color:colors.cream},titleMobile:{fontSize:12,lineHeight:20},rewards:{alignItems:'flex-end'},rewardsMobile:{minWidth:96},rewardsTiny:{minWidth:0,alignItems:'flex-end',justifyContent:'center'},reward:{color:colors.goldLight,fontSize:16},rewardXp:{color:colors.aqua,fontSize:13,marginTop:2},detail:{color:'#D0DEE0',fontSize:15,marginTop:9,lineHeight:21},progressRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8,marginTop:13},progressRowTiny:{marginTop:14},progressLabel:{fontSize:13,color:colors.muted},progressText:{fontSize:14,color:colors.cream},percentRow:{alignItems:'flex-end',marginTop:3},percentRowTiny:{alignItems:'flex-start'},percentText:{fontSize:13,color:colors.aqua},
  track:{height:18,backgroundColor:'#07191F',borderWidth:2,borderColor:'#294B53',overflow:'hidden',marginTop:8,position:'relative'},fill:{height:'100%',backgroundColor:colors.coral},trackShine:{position:'absolute',left:1,right:1,top:1,height:2,backgroundColor:'#FFFFFF33'},
  claim:{marginTop:13,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:13,minHeight:54,alignItems:'center',justifyContent:'center'},claimTiny:{minHeight:54},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{fontFamily:'PressStart2P',color:colors.ink,fontSize:12},
  complete:{backgroundColor:'#123844',borderWidth:2,borderColor:colors.brass,padding:15,flexDirection:'row',alignItems:'center',gap:12},completeCopy:{flex:1},completeTitle:{fontFamily:'PressStart2P',fontSize:12,color:colors.goldLight},
});
