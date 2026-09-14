import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function CapitalHeader({ cash, section, subtitle }: { cash: number; section: string; subtitle: string }) {
  return <View style={styles.shell}>
    <View style={styles.topRow}>
      <View style={styles.brand}>
        <View style={styles.logoBox}><Ionicons name="fish" size={22} color={colors.goldLight}/><View style={styles.crown}><View style={styles.crownPoint}/><View style={[styles.crownPoint,{left:7,height:7,top:-4}]}/><View style={[styles.crownPoint,{left:14}]}/></View></View>
        <View><PixelText style={styles.brandName}>SHRIMP CAPITAL</PixelText><PixelText style={styles.tagline}>SMALL SHRIMP · BIGGER BALANCE SHEETS</PixelText></View>
      </View>
      <View style={styles.cashBox}><PixelText style={styles.cashLabel}>LIQUID CAPITAL</PixelText><View style={styles.cashRow}><View style={styles.coin}><PixelText style={styles.coinText}>$</PixelText></View><PixelText style={styles.cash}>${cash.toLocaleString()}</PixelText></View></View>
    </View>
    <View style={styles.ticker}><PixelText style={styles.tickerText}>SHMP ▲ 3.21%   ·   KRLL ▲ 1.08%   ·   ALGA ▲ 2.17%   ·   SHELL ST. OPEN</PixelText></View>
    <View style={styles.plaque}><View style={styles.plaqueWing}/><View style={styles.plaqueCenter}><PixelText style={styles.section}>{section.toUpperCase()}</PixelText><PixelText style={styles.subtitle}>{subtitle.toUpperCase()}</PixelText></View><View style={[styles.plaqueWing,{transform:[{scaleX:-1}]}]}/></View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,shadowColor:'#000',shadowOpacity:.5,shadowRadius:0,shadowOffset:{width:3,height:4}},topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass},brand:{flexDirection:'row',alignItems:'center',gap:10},logoBox:{width:43,height:37,borderWidth:2,borderColor:colors.gold,backgroundColor:'#0C2028',alignItems:'center',justifyContent:'center',position:'relative'},crown:{position:'absolute',top:0,left:9,width:22,height:7,borderBottomWidth:3,borderColor:colors.goldLight},crownPoint:{position:'absolute',left:1,top:-2,width:4,height:5,backgroundColor:colors.goldLight},brandName:{fontSize:16,color:colors.goldLight,letterSpacing:1.2},tagline:{fontSize:5,color:colors.muted,letterSpacing:1.1,marginTop:3},cashBox:{minWidth:145,backgroundColor:'#061820',borderWidth:2,borderColor:'#35545C',padding:8,alignItems:'flex-end'},cashLabel:{fontSize:5,color:colors.muted,letterSpacing:1.1},cashRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:4},coin:{width:19,height:19,borderRadius:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,alignItems:'center',justifyContent:'center'},coinText:{fontSize:8,color:colors.brassDark},cash:{fontSize:14,color:colors.goldLight},ticker:{backgroundColor:'#041218',borderTopWidth:1,borderBottomWidth:2,borderColor:'#294A53',paddingVertical:6,paddingHorizontal:10},tickerText:{fontSize:5,color:'#7FE49D',textAlign:'center',letterSpacing:.8},plaque:{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0B222B',paddingVertical:7},plaqueCenter:{minWidth:250,backgroundColor:'#161B20',borderWidth:2,borderColor:colors.brass,paddingVertical:7,paddingHorizontal:25,alignItems:'center'},plaqueWing:{width:45,height:12,borderTopWidth:3,borderBottomWidth:3,borderColor:colors.brass,backgroundColor:'#0C2C35'},section:{fontSize:14,color:colors.goldLight,letterSpacing:1.5},subtitle:{fontSize:5,color:colors.muted,marginTop:3,letterSpacing:1},
});
