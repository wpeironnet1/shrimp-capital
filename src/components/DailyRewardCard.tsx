import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { canClaimDailyReward, dailyRewardAmount, GameState, nextDailyStreak } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function DailyRewardCard({ state, onClaim }: { state: GameState; onClaim: () => void }) {
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<430;
  const available=canClaimDailyReward(state);
  const nextStreak=available?nextDailyStreak(state):state.dailyStreak;
  const reward=dailyRewardAmount(nextStreak);

  return <View style={styles.outer} accessibilityLabel={available?`Daily reward available. Day ${nextStreak}, ${reward} dollars.`:`Daily reward collected. ${state.dailyStreak} day streak.`}>
    {!tiny&&<><View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/></>}
    <View style={[styles.card,mobile&&styles.cardMobile,tiny&&styles.cardTiny]}>
      <View style={[styles.summary,tiny&&styles.summaryTiny]}>
        <View style={[styles.icon,tiny&&styles.iconTiny]}><Ionicons name={available?'sunny':'checkmark'} size={tiny?22:24} color={available?colors.goldLight:colors.success}/></View>
        <View style={styles.copy}><PixelText style={styles.kicker}>DAILY CAPITAL</PixelText><PixelText style={[styles.title,tiny&&styles.titleTiny]}>{available?`DAY ${nextStreak} ALLOCATION`:`${state.dailyStreak}-DAY STREAK SECURED`}</PixelText><PixelText style={[styles.detail,tiny&&styles.detailTiny]}>{available?`Collect $${reward} for today's login.`:'Collected. Next allocation arrives tomorrow.'}</PixelText></View>
      </View>
      {available&&<Pressable accessibilityRole="button" accessibilityLabel={`Claim ${reward} dollars`} hitSlop={tiny?6:2} onPress={onClaim} style={({pressed})=>[styles.claim,mobile&&styles.claimMobile,tiny&&styles.claimTiny,pressed&&styles.claimPressed]}><PixelText style={styles.claimLabel}>DAILY REWARD</PixelText><PixelText style={styles.claimText}>CLAIM ${reward}</PixelText></Pressable>}
    </View>
  </View>;
}

const styles=StyleSheet.create({
  outer:{backgroundColor:'#071A22',borderWidth:2,borderColor:colors.brass,padding:3,position:'relative',shadowColor:'#000',shadowOpacity:.35,shadowRadius:0,shadowOffset:{width:3,height:4}},
  card:{backgroundColor:'#152E3D',borderWidth:1,borderColor:'#41616B',padding:14,flexDirection:'row',alignItems:'center',gap:13},cardMobile:{padding:12},cardTiny:{padding:10,flexDirection:'column',alignItems:'stretch',gap:9},
  summary:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',gap:13},summaryTiny:{alignItems:'flex-start',gap:9},icon:{width:48,height:48,backgroundColor:'#0A202A',borderWidth:2,borderColor:colors.brass,alignItems:'center',justifyContent:'center',flexShrink:0},iconTiny:{width:42,height:42},copy:{flex:1,minWidth:0},
  kicker:{color:colors.aqua,fontSize:13,letterSpacing:.35},title:{fontFamily:'PressStart2P',fontSize:12,lineHeight:19,marginTop:5,color:colors.cream},titleTiny:{fontSize:12,lineHeight:20,marginTop:3},detail:{color:'#D0DEE0',fontSize:16,marginTop:6,lineHeight:21},detailTiny:{marginTop:4,lineHeight:21},
  claim:{backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:11,paddingHorizontal:15,minHeight:54,justifyContent:'center',alignItems:'center'},claimMobile:{minWidth:120,minHeight:56},claimTiny:{width:'100%',minHeight:60,paddingVertical:12},claimPressed:{transform:[{translateY:3}],borderBottomWidth:2},claimLabel:{color:'#6D4E18',fontSize:13},claimText:{color:colors.ink,fontFamily:'PressStart2P',fontSize:12,marginTop:2},
  cornerTL:{position:'absolute',left:-2,top:-2,width:8,height:8,borderLeftWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerTR:{position:'absolute',right:-2,top:-2,width:8,height:8,borderRightWidth:3,borderTopWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBL:{position:'absolute',left:-2,bottom:-2,width:8,height:8,borderLeftWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},cornerBR:{position:'absolute',right:-2,bottom:-2,width:8,height:8,borderRightWidth:3,borderBottomWidth:3,borderColor:colors.goldLight,zIndex:5},
});
