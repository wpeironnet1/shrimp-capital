import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { canClaimDailyReward, dailyRewardAmount, GameState, nextDailyStreak } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function DailyRewardCard({ state, onClaim }: { state: GameState; onClaim: () => void }) {
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<390;
  const available=canClaimDailyReward(state);
  const nextStreak=available?nextDailyStreak(state):state.dailyStreak;
  const reward=dailyRewardAmount(nextStreak);

  return <View style={styles.outer} accessibilityLabel={available?`Daily reward available. Day ${nextStreak}, ${reward} dollars.`:`Daily reward collected. ${state.dailyStreak} day streak.`}>
    <View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/>
    <View style={[styles.card,mobile&&styles.cardMobile,tiny&&styles.cardTiny]}>
      <View style={styles.icon}><Ionicons name={available?'sunny':'checkmark'} size={20} color={available?colors.goldLight:colors.success}/></View>
      <View style={styles.copy}><PixelText style={styles.kicker}>MARKET OPEN</PixelText><PixelText style={[styles.title,mobile&&styles.titleMobile]}>{available?`DAY ${nextStreak} ALLOCATION`:`${state.dailyStreak}-DAY STREAK SECURED`}</PixelText><PixelText style={styles.detail}>{available?`Daily capital available · $${reward}`:'Next allocation available tomorrow'}</PixelText></View>
      {available&&<Pressable onPress={onClaim} style={({pressed})=>[styles.claim,mobile&&styles.claimMobile,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM</PixelText></Pressable>}
    </View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071A22',borderWidth:2,borderColor:colors.brass,padding:3,position:'relative',shadowColor:'#000',shadowOpacity:.35,shadowRadius:0,shadowOffset:{width:3,height:4}},
  card:{backgroundColor:'#152E3D',borderWidth:1,borderColor:'#41616B',padding:12,flexDirection:'row',alignItems:'center',gap:10},cardMobile:{padding:10},cardTiny:{flexWrap:'wrap'},
  icon:{width:40,height:40,backgroundColor:'#0A202A',borderWidth:2,borderColor:colors.brass,alignItems:'center',justifyContent:'center',flexShrink:0},copy:{flex:1,minWidth:0},
  kicker:{color:colors.aqua,fontSize:8,letterSpacing:1.1},title:{fontSize:11,marginTop:4,color:colors.cream},titleMobile:{fontSize:10},detail:{color:colors.muted,fontSize:8,marginTop:5},
  claim:{backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:10,paddingHorizontal:13,minHeight:44,justifyContent:'center'},claimMobile:{minWidth:72,alignItems:'center'},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{color:colors.ink,fontFamily:'PressStart2P',fontSize:6},
  cornerTL:{position:'absolute',left:-2,top:-2,width:8,height:8,borderLeftWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerTR:{position:'absolute',right:-2,top:-2,width:8,height:8,borderRightWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBL:{position:'absolute',left:-2,bottom:-2,width:8,height:8,borderLeftWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBR:{position:'absolute',right:-2,bottom:-2,width:8,height:8,borderRightWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},
});
