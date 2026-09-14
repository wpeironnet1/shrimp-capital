import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { missions } from '../game/catalog';
import { GameState, missionProgress } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function MissionPanel({ state, onClaim }: { state: GameState; onClaim: (id: string) => void }) {
  const missionIndex = missions.findIndex((entry) => !state.claimedMissions[entry.id]);
  const mission = missions[missionIndex];
  if (!mission) return <View style={styles.complete}><Ionicons name="trophy" size={22} color={colors.goldLight} /><View><PixelText style={styles.completeTitle}>OPENING BELL CLEARED</PixelText><PixelText style={styles.detail}>All current mandates have been completed.</PixelText></View></View>;
  const progress = Math.min(mission.target, missionProgress(state, mission.metric));
  const ready = progress >= mission.target;
  return (
    <View style={styles.frame} accessibilityLabel={`${mission.detail}. ${progress} of ${mission.target} complete.`}>
      <View style={styles.headerBand}><PixelText style={styles.kicker}>MANDATE {missionIndex + 1} / {missions.length}</PixelText><View style={styles.rewards}><PixelText style={styles.reward}>+${mission.reward.toLocaleString()}</PixelText><PixelText style={styles.rewardXp}>+{mission.rewardXp} XP</PixelText></View></View>
      <View style={styles.card}>
        <PixelText style={styles.title}>{mission.title.toUpperCase()}</PixelText>
        <PixelText style={styles.detail}>{mission.detail} · {progress}/{mission.target}</PixelText>
        <View style={styles.track}><View style={[styles.fill,{width:`${progress/mission.target*100}%`}]} /><View style={styles.trackShine}/></View>
        {ready&&<Pressable onPress={()=>onClaim(mission.id)} style={({pressed})=>[styles.claim,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM MANDATE</PixelText></Pressable>}
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  frame:{borderWidth:2,borderColor:colors.brass,backgroundColor:'#081D25',padding:3,shadowColor:'#000',shadowOpacity:.38,shadowRadius:0,shadowOffset:{width:3,height:4}},
  headerBand:{backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,paddingHorizontal:10,paddingVertical:7,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  card:{backgroundColor:'#123844',padding:12,borderWidth:1,borderColor:'#315E67'},kicker:{color:colors.aqua,fontSize:6,letterSpacing:1.5},title:{fontSize:12,color:colors.cream},rewards:{alignItems:'flex-end'},reward:{color:colors.goldLight,fontSize:11},rewardXp:{color:colors.aqua,fontSize:7,marginTop:2},detail:{color:colors.muted,fontSize:7,marginTop:7,lineHeight:11},
  track:{height:10,backgroundColor:'#07191F',borderWidth:2,borderColor:'#294B53',overflow:'hidden',marginTop:10,position:'relative'},fill:{height:'100%',backgroundColor:colors.coral},trackShine:{position:'absolute',left:1,right:1,top:1,height:2,backgroundColor:'#FFFFFF33'},
  claim:{marginTop:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:9,alignItems:'center'},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{color:colors.ink,fontSize:8,letterSpacing:1},
  complete:{backgroundColor:'#123844',borderWidth:2,borderColor:colors.brass,padding:13,flexDirection:'row',alignItems:'center',gap:11},completeTitle:{fontSize:10,color:colors.goldLight},
});
