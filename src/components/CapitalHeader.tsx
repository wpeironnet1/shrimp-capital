import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function CapitalHeader({cash,section,subtitle}:{cash:number;section:string;subtitle:string}){
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<390;

  return <View style={styles.shell}>
    <View style={[styles.topRow,mobile&&styles.topRowMobile]}>
      <View style={styles.brand}>
        <View style={[styles.logoBox,mobile&&styles.logoBoxMobile]}>
          <Ionicons name="fish" size={mobile?19:22} color={colors.goldLight}/>
          <View style={styles.crown}><View style={styles.crownPoint}/><View style={[styles.crownPoint,{left:7,height:7,top:-4}]}/><View style={[styles.crownPoint,{left:14}]}/></View>
        </View>
        <View style={styles.brandCopy}>
          <PixelText numberOfLines={1} style={[styles.brandName,mobile&&styles.brandNameMobile]}>SHRIMP CAPITAL</PixelText>
          {!tiny&&<PixelText numberOfLines={1} style={[styles.tagline,mobile&&styles.taglineMobile]}>SMALL SHRIMP · BIGGER BALANCE SHEETS</PixelText>}
        </View>
      </View>
      <View style={[styles.cashBox,mobile&&styles.cashBoxMobile]}>
        <PixelText style={styles.cashLabel}>LIQUID CAPITAL</PixelText>
        <View style={styles.cashRow}><View style={styles.coin}><PixelText style={styles.coinText}>$</PixelText></View><PixelText numberOfLines={1} adjustsFontSizeToFit style={[styles.cash,mobile&&styles.cashMobile]}>${cash.toLocaleString()}</PixelText></View>
      </View>
    </View>

    {!mobile&&<View style={styles.ticker}><PixelText numberOfLines={1} style={styles.tickerText}>SHMP ▲ 3.21% · KRLL ▲ 1.08% · ALGA ▲ 2.17% · SHELL ST. OPEN</PixelText></View>}

    <View style={[styles.plaque,mobile&&styles.plaqueMobile]}>
      {!tiny&&<View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile]}/>} 
      <View style={[styles.plaqueCenter,mobile&&styles.plaqueCenterMobile]}><View style={styles.plaqueInner}><PixelText style={[styles.section,mobile&&styles.sectionMobile]}>{section.toUpperCase()}</PixelText><PixelText numberOfLines={1} style={[styles.subtitle,mobile&&styles.subtitleMobile]}>{subtitle.toUpperCase()}</PixelText></View></View>
      {!tiny&&<View style={[styles.plaqueWing,mobile&&styles.plaqueWingMobile,{transform:[{scaleX:-1}]}]}/>} 
    </View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,shadowColor:'#000',shadowOpacity:.5,shadowRadius:0,shadowOffset:{width:3,height:4}},
  topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:12,backgroundColor:'#0A2731',borderBottomWidth:2,borderBottomColor:colors.brass,gap:12},
  topRowMobile:{padding:9,gap:8},
  brand:{flexDirection:'row',alignItems:'center',gap:9,flex:1,minWidth:0},brandCopy:{flex:1,minWidth:0},
  logoBox:{width:44,height:38,borderWidth:2,borderColor:colors.gold,backgroundColor:'#0C2028',alignItems:'center',justifyContent:'center',position:'relative',flexShrink:0},logoBoxMobile:{width:38,height:34},
  crown:{position:'absolute',top:0,left:9,width:22,height:7,borderBottomWidth:2,borderColor:colors.goldLight},crownPoint:{position:'absolute',left:1,top:-2,width:4,height:5,backgroundColor:colors.goldLight},
  brandName:{fontFamily:'PressStart2P',fontSize:10,color:colors.goldLight,letterSpacing:.2},brandNameMobile:{fontSize:8},
  tagline:{fontSize:8,color:colors.muted,letterSpacing:.65,marginTop:4},taglineMobile:{fontSize:7},
  cashBox:{minWidth:155,backgroundColor:'#061820',borderWidth:2,borderColor:colors.brass,padding:8,alignItems:'flex-end'},cashBoxMobile:{minWidth:0,maxWidth:150,padding:7},
  cashLabel:{fontSize:7,color:colors.muted,letterSpacing:.7},cashRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:3},coin:{width:20,height:20,borderRadius:10,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,alignItems:'center',justifyContent:'center'},coinText:{fontSize:10,color:colors.brassDark},cash:{fontFamily:'PressStart2P',fontSize:9,color:colors.goldLight},cashMobile:{fontSize:7},
  ticker:{backgroundColor:'#041218',borderBottomWidth:2,borderColor:'#294A53',paddingVertical:6,paddingHorizontal:10},tickerText:{fontSize:8,color:'#7FE49D',textAlign:'center',letterSpacing:.45},
  plaque:{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0B222B',paddingVertical:8},plaqueMobile:{paddingVertical:6},
  plaqueCenter:{minWidth:300,backgroundColor:'#0A151A',borderWidth:2,borderColor:colors.brass,padding:3},plaqueCenterMobile:{minWidth:0,width:'78%',maxWidth:360},
  plaqueInner:{borderWidth:1,borderColor:colors.gold,paddingVertical:8,paddingHorizontal:14,alignItems:'center',backgroundColor:'#171C21'},
  plaqueWing:{width:52,height:12,borderTopWidth:2,borderBottomWidth:2,borderColor:colors.brass,backgroundColor:'#0C2C35'},plaqueWingMobile:{width:24},
  section:{fontFamily:'PressStart2P',fontSize:10,color:colors.goldLight},sectionMobile:{fontSize:8},subtitle:{fontSize:8,color:colors.muted,marginTop:4,letterSpacing:.55},subtitleMobile:{fontSize:7},
});
