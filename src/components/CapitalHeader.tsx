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
    <View style={styles.plaque}><View style={styles.plaqueWing}/><View style={styles.plaqueCenter}><View style={styles.plaqueInner}><PixelText style={styles.section}>{section.toUpperCase()}</PixelText><PixelText style={styles.subtitle}>{subtitle.toUpperCase()}</PixelText></View></View><View style={[styles.plaqueWing,{transform:[{scaleX:-1}]}]}/></View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:3,borderColor:colors.brass,shadowColor:'#000',shadowOpacity:.55,shadowRadius:0,shadowOffset:{width:4,height:5}},topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass},brand:{flexDirection:'row',alignItems:'center',gap:10},logoBox:{width:46,height:40,borderWidth:3,borderColor:colors.gold,backgroundColor:'#0C2028',alignItems:'center',justifyContent:'center',position:'relative'},crown:{position:'absolute',top:0,left:10,width:22,height:7,borderBottomWidth:3,borderColor:colors.goldLight},crownPoint:{position:'absolute',left:1,top:-2,width:4,height:5,backgroundColor:colors.goldLight},brandName:{fontFamily:'PressStart2P',fontSize:11,color:colors.goldLight,letterSpacing:.3},tagline:{fontSize:7,color:colors.muted,letterSpacing:1.1,marginTop:5},cashBox:{minWidth:150,backgroundColor:'#061820',borderWidth:2,borderColor:colors.brass,padding:8,alignItems:'flex-end'},cashLabel:{fontSize:6,color:colors.muted,letterSpacing:1.1},cashRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:4},coin:{width:20,height:20,borderRadius:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,alignItems:'center',justifyContent:'center'},coinText:{fontSize:10,color:colors.brassDark},cash:{fontFamily:'PressStart2P',fontSize:9,color:colors.goldLight},ticker:{backgroundColor:'#041218',borderTopWidth:1,borderBottomWidth:2,borderColor:'#294A53',paddingVertical:6,paddingHorizontal:10},tickerText:{fontSize:7,color:'#7FE49D',textAlign:'center',letterSpacing:.8},plaque:{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0B222B',paddingVertical:8},plaqueCenter:{minWidth:280,backgroundColor:'#0A151A',borderWidth:3,borderColor:colors.brass,padding:3},plaqueInner:{borderWidth:1,borderColor:colors.gold,paddingVertical:8,paddingHorizontal:20,alignItems:'center',backgroundColor:'#171C21'},plaqueWing:{width:48,height:14,borderTopWidth:3,borderBottomWidth:3,borderColor:colors.brass,backgroundColor:'#0C2C35'},section:{fontFamily:'PressStart2P',fontSize:10,color:colors.goldLight,letterSpacing:.4},subtitle:{fontSize:7,color:colors.muted,marginTop:5,letterSpacing:1},
});
