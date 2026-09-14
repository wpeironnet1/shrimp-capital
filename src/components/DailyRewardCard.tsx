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
      <View style={styles.icon}><Ionicons name={available?'sunny':'checkmark'} size={22} color={available?colors.goldLight:colors.success}/></View>
      <View style={styles.copy}><PixelText style={styles.kicker}>DAILY CAPITAL</PixelText><PixelText style={[styles.title,mobile&&styles.titleMobile]}>{available?`DAY ${nextStreak} ALLOCATION`:`${state.dailyStreak}-DAY STREAK SECURED`}</PixelText><PixelText style={styles.detail}>{available?`Collect $${reward} for today's login.`:'Collected. Next allocation arrives tomorrow.'}</PixelText></View>
      {available&&<Pressable accessibilityRole="button" accessibilityLabel={`Claim ${reward} dollars`} onPress={onClaim} style={({pressed})=>[styles.claim,mobile&&styles.claimMobile,tiny&&styles.claimTiny,pressed&&styles.claimPressed]}><PixelText style={styles.claimText}>CLAIM ${reward}</PixelText></Pressable>}
    </View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071A22',borderWidth:2,borderColor:colors.brass,padding:3,position:'relative',shadowColor:'#000',shadowOpacity:.35,shadowRadius:0,shadowOffset:{width:3,height:4}},
  card:{backgroundColor:'#152E3D',borderWidth:1,borderColor:'#41616B',padding:12,flexDirection:'row',alignItems:'center',gap:12},cardMobile:{padding:11},cardTiny:{flexWrap:'wrap',alignItems:'flex-start'},
  icon:{width:44,height:44,backgroundColor:'#0A202A',borderWidth:2,borderColor:colors.brass,alignItems:'center',justifyContent:'center',flexShrink:0},copy:{flex:1,minWidth:0},
  kicker:{color:colors.aqua,fontSize:9,letterSpacing:.8},title:{fontFamily:'PressStart2P',fontSize:9,marginTop:5,color:colors.cream},titleMobile:{fontSize:9},detail:{color:'#B7C9CC',fontSize:11,marginTop:6},
  claim:{backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:11,paddingHorizontal:14,minHeight:48,justifyContent:'center',alignItems:'center'},claimMobile:{minWidth:92},claimTiny:{width:'100%',marginTop:2},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimText:{color:colors.ink,fontFamily:'PressStart2P',fontSize:9},
  cornerTL:{position:'absolute',left:-2,top:-2,width:8,height:8,borderLeftWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerTR:{position:'absolute',right:-2,top:-2,width:8,height:8,borderRightWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBL:{position:'absolute',left:-2,bottom:-2,width:8,height:8,borderLeftWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBR:{position:'absolute',right:-2,bottom:-2,width:8,height:8,borderRightWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},
});
