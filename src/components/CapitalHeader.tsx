import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function CapitalHeader({cash,section,subtitle}:{cash:number;section:string;subtitle:string}){
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const compact=width<520;
  const tiny=width<390;

  return <View style={styles.shell}>
    <View style={[styles.topRow,mobile&&styles.topRowMobile]}>
      <View style={styles.brand} accessibilityRole="header" accessibilityLabel="Shrimp Capital">
        <View style={[styles.logoBox,mobile&&styles.logoBoxMobile]} accessibilityElementsHidden>
          <Ionicons name="fish" size={mobile?22:24} color={colors.goldLight}/>
          <View style={styles.crown}><View style={styles.crownPoint}/><View style={[styles.crownPoint,{left:7,height:7,top:-4}]}/><View style={[styles.crownPoint,{left:14}]}/></View>
        </View>
        <View style={styles.brandCopy}>
          <PixelText numberOfLines={1} style={[styles.brandName,mobile&&styles.brandNameMobile]}>SHRIMP CAPITAL</PixelText>
          {!compact&&<PixelText numberOfLines={1} style={styles.tagline}>SMALL SHRIMP · BIGGER BALANCE SHEETS</PixelText>}
        </View>
      </View>
      <View style={[styles.cashBox,mobile&&styles.cashBoxMobile]} accessible accessibilityLabel={`Liquid capital ${cash.toLocaleString()} dollars`}>
        <PixelText style={styles.cashLabel}>LIQUID CAPITAL</PixelText>
        <View style={styles.cashRow}><View style={styles.coin}><PixelText style={styles.coinText}>$</PixelText></View><PixelText numberOfLines={1} style={[styles.cash,mobile&&styles.cashMobile]}>${cash.toLocaleString()}</PixelText></View>
      </View>
    </View>

    {!mobile&&<View style={styles.ticker}><PixelText numberOfLines={1} style={styles.tickerText}>SHMP ▲ 3.21% · KRLL ▲ 1.08% · ALGA ▲ 2.17% · SHELL ST. OPEN</PixelText></View>}

    <View style={[styles.plaque,mobile&&styles.plaqueMobile]}>
      {!tiny&&<View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile]}/>} 
      <View style={[styles.plaqueCenter,mobile&&styles.plaqueCenterMobile]}><View style={[styles.plaqueInner,mobile&&styles.plaqueInnerMobile]}><PixelText accessibilityRole="header" style={[styles.section,mobile&&styles.sectionMobile]}>{section.toUpperCase()}</PixelText><PixelText numberOfLines={mobile?2:1} style={[styles.subtitle,mobile&&styles.subtitleMobile]}>{subtitle.toUpperCase()}</PixelText></View></View>
      {!tiny&&<View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile,{transform:[{scaleX:-1}]}]}/>} 
    </View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,shadowColor:'#000',shadowOpacity:.5,shadowRadius:0,shadowOffset:{width:3,height:4}},
  topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:14,backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,gap:14},
  topRowMobile:{flexDirection:'column',alignItems:'stretch',padding:11,gap:10},
  brand:{flexDirection:'row',alignItems:'center',gap:11,flex:1,minWidth:0},brandCopy:{flex:1,minWidth:0},
  logoBox:{width:48,height:42,borderWidth:2,borderColor:colors.gold,backgroundColor:'#0C2028',alignItems:'center',justifyContent:'center',position:'relative',flexShrink:0},logoBoxMobile:{width:44,height:40},
  crown:{position:'absolute',top:0,left:9,width:22,height:7,borderBottomWidth:2,borderColor:colors.goldLight},crownPoint:{position:'absolute',left:1,top:-2,width:4,height:5,backgroundColor:colors.goldLight},
  brandName:{fontFamily:'PressStart2P',fontSize:13,color:colors.goldLight,letterSpacing:.2},brandNameMobile:{fontSize:12},
  tagline:{fontSize:13,color:colors.muted,letterSpacing:.35,marginTop:4},
  cashBox:{minWidth:178,backgroundColor:'#061820',borderWidth:2,borderColor:colors.brass,padding:10,alignItems:'flex-end'},cashBoxMobile:{width:'100%',minWidth:0,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:11,paddingVertical:10,gap:10},
  cashLabel:{fontSize:13,color:colors.muted,letterSpacing:.35,flexShrink:1},cashRow:{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',gap:7,flexShrink:0},coin:{width:24,height:24,borderRadius:12,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,alignItems:'center',justifyContent:'center'},coinText:{fontSize:13,color:colors.brassDark},cash:{fontFamily:'PressStart2P',fontSize:12,color:colors.goldLight},cashMobile:{fontSize:12},
  ticker:{backgroundColor:'#041218',borderBottomWidth:2,borderColor:'#294A53',paddingVertical:7,paddingHorizontal:10},tickerText:{fontSize:13,color:'#7FE49D',textAlign:'center',letterSpacing:.25},
  plaque:{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0B222B',paddingVertical:9},plaqueMobile:{paddingVertical:8},
  plaqueCenter:{minWidth:320,backgroundColor:'#0A151A',borderWidth:2,borderColor:colors.brass,padding:3},plaqueCenterMobile:{minWidth:0,width:'88%',maxWidth:420},
  plaqueInner:{borderWidth:1,borderColor:colors.gold,paddingVertical:9,paddingHorizontal:14,alignItems:'center',backgroundColor:'#171C21'},plaqueInnerMobile:{paddingVertical:10,paddingHorizontal:12},
  plaqueWing:{width:58,height:12,borderTopWidth:2,borderBottomWidth:2,borderColor:colors.brass,backgroundColor:'#0C2C35'},plaqueWingMobile:{width:18},
  section:{fontFamily:'PressStart2P',fontSize:12,color:colors.goldLight},sectionMobile:{fontSize:12},subtitle:{fontSize:13,color:colors.muted,marginTop:4,letterSpacing:.3,textAlign:'center'},subtitleMobile:{fontSize:13,lineHeight:18},
});
