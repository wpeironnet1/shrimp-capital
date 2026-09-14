import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { missions } from '../game/catalog';
import { GameState, missionProgress } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function MissionPanel({ state, onClaim }: { state: GameState; onClaim: (id: string) => void }) {
  const {width}=useWindowDimensions();const mobile=width<700;
  const missionIndex = missions.findIndex((entry) => !state.claimedMissions[entry.id]);
  const mission = missions[missionIndex];
  if (!mission) return <View style={styles.complete}><Ionicons name="trophy" size={24} color={colors.goldLight} /><View style={styles.completeCopy}><PixelText style={styles.completeTitle}>OPENING BELL CLEARED</PixelText><PixelText style={styles.detail}>All current mandates have been completed.</PixelText></View></View>;
  const progress = Math.min(mission.target, missionProgress(state, mission.metric));
  const ready = progress >= mission.target;
  return <View style={styles.frame} accessibilityLabel={`${mission.detail}. ${progress} of ${mission.target} complete.`}>
    <View style={[styles.headerBand,mobile&&styles.headerBandMobile]}><PixelText style={styles.kicker}>MANDATE {missionIndex + 1} / {missions.length}</PixelText><View style={[styles.rewards,mobile&&styles.rewardsMobile]}><PixelText style={styles.reward}>+${mission.reward.toLocaleString()}</PixelText><PixelText style={styles.rewardXp}>+{mission.rewardXp} XP</PixelText></View></View>
    <View style={styles.card}><PixelText style={styles.title}>{mission.title.toUpperCase()}</PixelText><PixelText style={styles.detail}>{mission.detail}</PixelText><View style={styles.progressRow}><PixelText style={styles.progressText}>{progress} / {mission.target}</PixelText></View><View style={styles.track}><View style={[styles.fill,{width:`${progress/mission.target*100}%`}]} /><View style={styles.trackShine}/></View>{ready&&<Pressable onPress={()=>onClaim(mission.id)} style={({pressed})=>[styles.claim,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM MANDATE</PixelText></Pressable>}</View>
  </View>;
}

const styles=StyleSheet.create({
  frame:{borderWidth:2,borderColor:colors.brass,backgroundColor:'#081D25',padding:3,shadowColor:'#000',shadowOpacity:.38,shadowRadius:0,shadowOffset:{width:3,height:4}},headerBand:{backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,paddingHorizontal:10,paddingVertical:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},headerBandMobile:{alignItems:'flex-start'},
  card:{backgroundColor:'#123844',padding:12,borderWidth:1,borderColor:'#315E67'},kicker:{color:colors.aqua,fontSize:7,letterSpacing:1.2},title:{fontFamily:'PressStart2P',fontSize:8,lineHeight:13,color:colors.cream},rewards:{alignItems:'flex-end'},rewardsMobile:{minWidth:70},reward:{color:colors.goldLight,fontSize:10},rewardXp:{color:colors.aqua,fontSize:7,marginTop:2},detail:{color:colors.muted,fontSize:8,marginTop:7,lineHeight:13},progressRow:{alignItems:'flex-end',marginTop:6},progressText:{fontSize:7,color:colors.cream},
  track:{height:12,backgroundColor:'#07191F',borderWidth:2,borderColor:'#294B53',overflow:'hidden',marginTop:6,position:'relative'},fill:{height:'100%',backgroundColor:colors.coral},trackShine:{position:'absolute',left:1,right:1,top:1,height:2,backgroundColor:'#FFFFFF33'},
  claim:{marginTop:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:11,minHeight:48,alignItems:'center',justifyContent:'center'},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{fontFamily:'PressStart2P',color:colors.ink,fontSize:6,letterSpacing:.3},
  complete:{backgroundColor:'#123844',borderWidth:2,borderColor:colors.brass,padding:13,flexDirection:'row',alignItems:'center',gap:11},completeCopy:{flex:1},completeTitle:{fontFamily:'PressStart2P',fontSize:7,lineHeight:12,color:colors.goldLight},
});
