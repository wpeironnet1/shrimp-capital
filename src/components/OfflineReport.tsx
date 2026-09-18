import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function OfflineReport({amount,onClose}:{amount:number;onClose:()=>void}){
  const {width,height}=useWindowDimensions();
  const compact=width<430;
  const short=height<700;
  const formattedAmount=Math.max(0,Math.floor(amount)).toLocaleString();

  return <Modal transparent visible={amount>0} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
    <View style={[styles.backdrop,compact&&styles.backdropCompact]}>
      <View style={styles.outer} accessibilityRole="alert" accessibilityLabel={`Overnight operations report. You earned ${formattedAmount} shrimp while offline.`}>
        <View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/>
        <View style={[styles.card,compact&&styles.cardCompact,short&&styles.cardShort]}>
          <View style={[styles.icon,(compact||short)&&styles.iconCompact]} accessibilityElementsHidden>
            <Ionicons name="moon" size={compact?27:32} color={colors.goldLight}/>
          </View>
          <PixelText style={styles.eyebrow}>OVERNIGHT REPORT</PixelText>
          <PixelText style={[styles.title,compact&&styles.titleCompact]}>THE TANK STAYED BUSY</PixelText>
          <View style={[styles.rule,short&&styles.ruleShort]}/>
          <View style={styles.payoutPanel}>
            <PixelText style={styles.payoutLabel}>PRODUCED WHILE AWAY</PixelText>
            <PixelText adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={[styles.amount,compact&&styles.amountCompact]}>+{formattedAmount} SHRIMP</PixelText>
          </View>
          <PixelText style={[styles.body,short&&styles.bodyShort]}>YOUR SHRIMP KEPT THE BUSINESS MOVING. COLLECT THEM AND GET BACK TO THE TANK.</PixelText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Collect ${formattedAmount} offline shrimp`}
            hitSlop={10}
            onPress={onClose}
            style={({pressed})=>[styles.button,compact&&styles.buttonCompact,pressed&&styles.buttonPressed]}
          >
            <Ionicons name="cash" size={21} color={colors.ink}/>
            <PixelText style={styles.buttonText}>COLLECT SHRIMP</PixelText>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const styles=StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(2,10,14,.92)',alignItems:'center',justifyContent:'center',padding:26},
  backdropCompact:{paddingHorizontal:12,paddingVertical:18},
  outer:{width:'100%',maxWidth:460,backgroundColor:'#06171E',borderWidth:3,borderColor:colors.brass,padding:4,position:'relative',shadowColor:'#000',shadowOpacity:.65,shadowRadius:0,shadowOffset:{width:6,height:8}},
  card:{backgroundColor:'#0B2B35',borderWidth:2,borderColor:'#365F69',alignItems:'center',paddingHorizontal:24,paddingVertical:24},
  cardCompact:{paddingHorizontal:14,paddingVertical:18},
  cardShort:{paddingVertical:14},
  icon:{width:64,height:64,backgroundColor:'#071B23',borderWidth:3,borderColor:colors.gold,alignItems:'center',justifyContent:'center',marginBottom:16},
  iconCompact:{width:54,height:54,marginBottom:11},
  eyebrow:{fontSize:16,color:colors.aqua,letterSpacing:.7,textAlign:'center'},
  title:{fontFamily:'PressStart2P',fontSize:14,color:colors.goldLight,marginTop:9,textAlign:'center',lineHeight:22},
  titleCompact:{fontSize:12,lineHeight:20},
  rule:{width:'78%',height:2,backgroundColor:colors.brass,marginVertical:15},
  ruleShort:{marginVertical:10},
  payoutPanel:{width:'100%',backgroundColor:'#061A22',borderWidth:2,borderColor:'#50737A',paddingHorizontal:12,paddingVertical:12,alignItems:'center'},
  payoutLabel:{fontSize:16,color:colors.muted,letterSpacing:.35,textAlign:'center'},
  amount:{fontFamily:'PressStart2P',fontSize:18,lineHeight:27,color:colors.goldLight,marginTop:7,textAlign:'center'},
  amountCompact:{fontSize:14,lineHeight:23},
  body:{fontSize:17,lineHeight:23,color:'#D1E0E2',textAlign:'center',marginTop:14,maxWidth:350},
  bodyShort:{marginTop:10},
  button:{width:'100%',minHeight:64,backgroundColor:colors.gold,borderWidth:3,borderColor:colors.goldLight,borderBottomWidth:6,borderBottomColor:colors.brassDark,paddingHorizontal:12,paddingVertical:10,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:10,marginTop:18},
  buttonCompact:{minHeight:68,marginTop:15},
  buttonPressed:{transform:[{translateY:4}],borderBottomWidth:2},
  buttonText:{fontFamily:'PressStart2P',fontSize:12,lineHeight:19,color:colors.ink,textAlign:'center'},
  cornerTL:{position:'absolute',left:-5,top:-5,width:13,height:13,borderLeftWidth:4,borderTopWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerTR:{position:'absolute',right:-5,top:-5,width:13,height:13,borderRightWidth:4,borderTopWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerBL:{position:'absolute',left:-5,bottom:-5,width:13,height:13,borderLeftWidth:4,borderBottomWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerBR:{position:'absolute',right:-5,bottom:-5,width:13,height:13,borderRightWidth:4,borderBottomWidth:4,borderColor:colors.goldLight,zIndex:5},
});
