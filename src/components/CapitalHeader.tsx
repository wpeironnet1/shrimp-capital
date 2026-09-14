import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function CapitalHeader({cash,section,subtitle}:{cash:number;section:string;subtitle:string}){
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<420;
  return <View style={styles.shell}>
    <View style={[styles.topRow,mobile&&styles.topRowMobile]}>
      <View style={[styles.brand,mobile&&styles.brandMobile]}>
        <View style={[styles.logoBox,tiny&&styles.logoBoxTiny]}><Ionicons name="fish" size={tiny?18:22} color={colors.goldLight}/><View style={styles.crown}><View style={styles.crownPoint}/><View style={[styles.crownPoint,{left:7,height:7,top:-4}]}/><View style={[styles.crownPoint,{left:14}]}/></View></View>
        <View style={styles.brandCopy}><PixelText numberOfLines={1} style={[styles.brandName,mobile&&styles.brandNameMobile]}>SHRIMP CAPITAL</PixelText><PixelText numberOfLines={1} style={[styles.tagline,mobile&&styles.taglineMobile]}>SMALL SHRIMP · BIGGER BALANCE SHEETS</PixelText></View>
      </View>
      <View style={[styles.cashBox,mobile&&styles.cashBoxMobile]}><PixelText style={styles.cashLabel}>LIQUID CAPITAL</PixelText><View style={styles.cashRow}><View style={styles.coin}><PixelText style={styles.coinText}>$</PixelText></View><PixelText numberOfLines={1} adjustsFontSizeToFit style={[styles.cash,mobile&&styles.cashMobile]}>${cash.toLocaleString()}</PixelText></View></View>
    </View>
    {!tiny&&<View style={styles.ticker}><PixelText numberOfLines={1} style={styles.tickerText}>SHMP ▲ 3.21% · KRLL ▲ 1.08% · ALGA ▲ 2.17% · SHELL ST. OPEN</PixelText></View>}
    <View style={[styles.plaque,mobile&&styles.plaqueMobile]}><View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile]}/><View style={[styles.plaqueCenter,mobile&&styles.plaqueCenterMobile]}><View style={styles.plaqueInner}><PixelText style={[styles.section,mobile&&styles.sectionMobile]}>{section.toUpperCase()}</PixelText><PixelText numberOfLines={1} style={[styles.subtitle,mobile&&styles.subtitleMobile]}>{subtitle.toUpperCase()}</PixelText></View></View><View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile,{transform:[{scaleX:-1}]}]}/></View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:3,borderColor:colors.brass,shadowColor:'#000',shadowOpacity:.55,shadowRadius:0,shadowOffset:{width:4,height:5}},
  topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:12,backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,gap:12},
  topRowMobile:{flexDirection:'column',alignItems:'stretch',padding:10,gap:8},
  brand:{flexDirection:'row',alignItems:'center',gap:10,flex:1,minWidth:0},brandMobile:{width:'100%'},brandCopy:{flex:1,minWidth:0},
  logoBox:{width:46,height:40,borderWidth:3,borderColor:colors.gold,backgroundColor:'#0C2028',alignItems:'center',justifyContent:'center',position:'relative',flexShrink:0},logoBoxTiny:{width:40,height:36},
  crown:{position:'absolute',top:0,left:10,width:22,height:7,borderBottomWidth:3,borderColor:colors.goldLight},crownPoint:{position:'absolute',left:1,top:-2,width:4,height:5,backgroundColor:colors.goldLight},
  brandName:{fontFamily:'PressStart2P',fontSize:11,color:colors.goldLight,letterSpacing:.3},brandNameMobile:{fontSize:9},
  tagline:{fontSize:8,color:colors.muted,letterSpacing:.9,marginTop:5},taglineMobile:{fontSize:7,letterSpacing:.45},
  cashBox:{minWidth:160,backgroundColor:'#061820',borderWidth:2,borderColor:colors.brass,padding:9,alignItems:'flex-end'},cashBoxMobile:{width:'100%',minWidth:0,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  cashLabel:{fontSize:7,color:colors.muted,letterSpacing:1},cashRow:{flexDirection:'row',alignItems:'center',gap:7},coin:{width:21,height:21,borderRadius:11,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,alignItems:'center',justifyContent:'center'},coinText:{fontSize:11,color:colors.brassDark},cash:{fontFamily:'PressStart2P',fontSize:9,color:colors.goldLight},cashMobile:{fontSize:8},
  ticker:{backgroundColor:'#041218',borderTopWidth:1,borderBottomWidth:2,borderColor:'#294A53',paddingVertical:7,paddingHorizontal:10,overflow:'hidden'},tickerText:{fontSize:8,color:'#7FE49D',textAlign:'center',letterSpacing:.55},
  plaque:{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0B222B',paddingVertical:9},plaqueMobile:{paddingVertical:7},
  plaqueCenter:{minWidth:300,backgroundColor:'#0A151A',borderWidth:3,borderColor:colors.brass,padding:3},plaqueCenterMobile:{minWidth:0,width:'72%'},
  plaqueInner:{borderWidth:1,borderColor:colors.gold,paddingVertical:9,paddingHorizontal:18,alignItems:'center',backgroundColor:'#171C21'},
  plaqueWing:{width:52,height:14,borderTopWidth:3,borderBottomWidth:3,borderColor:colors.brass,backgroundColor:'#0C2C35',flexShrink:1},plaqueWingMobile:{width:28},
  section:{fontFamily:'PressStart2P',fontSize:10,color:colors.goldLight,letterSpacing:.4},sectionMobile:{fontSize:8},subtitle:{fontSize:8,color:colors.muted,marginTop:5,letterSpacing:.8},subtitleMobile:{fontSize:7,letterSpacing:.35},
});
