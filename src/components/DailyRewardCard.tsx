import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { canClaimDailyReward, dailyRewardAmount, GameState, nextDailyStreak } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function DailyRewardCard({ state, onClaim }: { state: GameState; onClaim: () => void }) {
  const available = canClaimDailyReward(state);
  const nextStreak = available ? nextDailyStreak(state) : state.dailyStreak;
  const reward = dailyRewardAmount(nextStreak);
  return (
    <View style={styles.outer} accessibilityLabel={available ? `Daily reward available. Day ${nextStreak}, ${reward} dollars.` : `Daily reward collected. ${state.dailyStreak} day streak.`}>
      <View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/>
      <View style={styles.card}>
        <View style={styles.icon}><Ionicons name={available ? 'sunny' : 'checkmark'} size={20} color={available ? colors.goldLight : colors.success} /></View>
        <View style={styles.copy}><PixelText style={styles.kicker}>MARKET OPEN</PixelText><PixelText style={styles.title}>{available ? `DAY ${nextStreak} ALLOCATION` : `${state.dailyStreak}-DAY STREAK SECURED`}</PixelText><PixelText style={styles.detail}>{available ? `Daily capital available · $${reward}` : 'Next allocation available tomorrow'}</PixelText></View>
        {available && <Pressable onPress={onClaim} style={({pressed})=>[styles.claim,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM</PixelText></Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer:{backgroundColor:'#071A22',borderWidth:2,borderColor:colors.brass,padding:3,position:'relative',shadowColor:'#000',shadowOpacity:.35,shadowRadius:0,shadowOffset:{width:3,height:4}},
  card:{backgroundColor:'#152E3D',borderWidth:1,borderColor:'#41616B',padding:12,flexDirection:'row',alignItems:'center'},
  icon:{width:40,height:40,backgroundColor:'#0A202A',borderWidth:2,borderColor:colors.brass,alignItems:'center',justifyContent:'center'},copy:{flex:1,marginLeft:11},
  kicker:{color:colors.aqua,fontSize:6,letterSpacing:1.7},title:{fontSize:11,marginTop:4,color:colors.cream},detail:{color:colors.muted,fontSize:7,marginTop:5},
  claim:{backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:9,paddingHorizontal:12},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{color:colors.ink,fontSize:8,letterSpacing:1},
  cornerTL:{position:'absolute',left:-2,top:-2,width:8,height:8,borderLeftWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerTR:{position:'absolute',right:-2,top:-2,width:8,height:8,borderRightWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBL:{position:'absolute',left:-2,bottom:-2,width:8,height:8,borderLeftWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBR:{position:'absolute',right:-2,bottom:-2,width:8,height:8,borderRightWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},
});
