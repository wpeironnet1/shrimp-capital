import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function OfflineReport({amount,onClose}:{amount:number;onClose:()=>void}){
  const {width}=useWindowDimensions();
  const compact=width<420;
  const formattedAmount=Math.max(0,Math.floor(amount)).toLocaleString();

  return <Modal transparent visible={amount>0} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
    <View style={[styles.backdrop,compact&&styles.backdropCompact]}>
      <View style={styles.outer} accessibilityRole="alert" accessibilityLabel={`Overnight operations report. You earned ${formattedAmount} shrimp while offline.`}>
        <View style={styles.cornerTL}/><View style={styles.cornerTR}/><View style={styles.cornerBL}/><View style={styles.cornerBR}/>
        <View style={[styles.card,compact&&styles.cardCompact]}>
          <View style={[styles.icon,compact&&styles.iconCompact]} accessibilityElementsHidden>
            <Ionicons name="moon" size={compact?28:32} color={colors.goldLight}/>
          </View>
          <PixelText style={[styles.eyebrow,compact&&styles.eyebrowCompact]}>OVERNIGHT OPERATIONS</PixelText>
          <PixelText style={[styles.title,compact&&styles.titleCompact]}>THE TANK STAYED BUSY</PixelText>
          <View style={styles.rule}/>
          <View style={styles.payoutPanel}>
            <PixelText style={styles.payoutLabel}>OFFLINE PRODUCTION</PixelText>
            <PixelText numberOfLines={1} style={[styles.amount,compact&&styles.amountCompact]}>+{formattedAmount} SHRIMP</PixelText>
          </View>
          <PixelText style={[styles.body,compact&&styles.bodyCompact]}>YOUR AQUATIC WORKFORCE KEPT PRODUCING WHILE YOU WERE AWAY. COLLECT THE EARNINGS AND GET BACK TO THE TANK.</PixelText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Collect ${formattedAmount} offline shrimp`}
            hitSlop={8}
            onPress={onClose}
            style={({pressed})=>[styles.button,compact&&styles.buttonCompact,pressed&&styles.buttonPressed]}
          >
            <PixelText style={styles.buttonSmall}>RECONCILE POSITION</PixelText>
            <PixelText style={[styles.buttonText,compact&&styles.buttonTextCompact]}>COLLECT DIVIDENDS</PixelText>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const styles=StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(2,10,14,.92)',alignItems:'center',justifyContent:'center',padding:26},
  backdropCompact:{paddingHorizontal:14,paddingVertical:22},
  outer:{width:'100%',maxWidth:460,backgroundColor:'#06171E',borderWidth:3,borderColor:colors.brass,padding:4,position:'relative',shadowColor:'#000',shadowOpacity:.65,shadowRadius:0,shadowOffset:{width:6,height:8}},
  card:{backgroundColor:'#0B2B35',borderWidth:2,borderColor:'#365F69',alignItems:'center',paddingHorizontal:24,paddingVertical:24},
  cardCompact:{paddingHorizontal:16,paddingVertical:20},
  icon:{width:64,height:64,backgroundColor:'#071B23',borderWidth:3,borderColor:colors.gold,alignItems:'center',justifyContent:'center',marginBottom:16},
  iconCompact:{width:58,height:58,marginBottom:14},
  eyebrow:{fontSize:13,lineHeight:18,color:colors.aqua,letterSpacing:1.1,textAlign:'center'},
  eyebrowCompact:{fontSize:12,lineHeight:17,letterSpacing:.7},
  title:{fontFamily:'PressStart2P',fontSize:14,color:colors.goldLight,marginTop:10,textAlign:'center',lineHeight:22},
  titleCompact:{fontSize:12,lineHeight:20},
  rule:{width:'78%',height:2,backgroundColor:colors.brass,marginVertical:16},
  payoutPanel:{width:'100%',backgroundColor:'#061A22',borderWidth:2,borderColor:'#50737A',paddingHorizontal:12,paddingVertical:12,alignItems:'center'},
  payoutLabel:{fontSize:12,lineHeight:17,color:colors.muted,letterSpacing:.6,textAlign:'center'},
  amount:{fontFamily:'PressStart2P',fontSize:18,lineHeight:27,color:colors.goldLight,marginTop:7,textAlign:'center'},
  amountCompact:{fontSize:15,lineHeight:24},
  body:{fontSize:14,lineHeight:21,color:'#BCD0D3',textAlign:'center',marginTop:15,maxWidth:350},
  bodyCompact:{fontSize:13,lineHeight:20},
  button:{width:'100%',minHeight:62,backgroundColor:colors.gold,borderWidth:3,borderColor:colors.goldLight,borderBottomWidth:6,borderBottomColor:colors.brassDark,paddingHorizontal:12,paddingVertical:10,alignItems:'center',justifyContent:'center',marginTop:20},
  buttonCompact:{minHeight:66,paddingVertical:11},
  buttonPressed:{transform:[{translateY:4}],borderBottomWidth:2},
  buttonSmall:{fontSize:11,lineHeight:15,color:'#654816',letterSpacing:.4,textAlign:'center'},
  buttonText:{fontFamily:'PressStart2P',fontSize:11,lineHeight:17,color:colors.ink,marginTop:4,textAlign:'center'},
  buttonTextCompact:{fontSize:10,lineHeight:16},
  cornerTL:{position:'absolute',left:-5,top:-5,width:13,height:13,borderLeftWidth:4,borderTopWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerTR:{position:'absolute',right:-5,top:-5,width:13,height:13,borderRightWidth:4,borderTopWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerBL:{position:'absolute',left:-5,bottom:-5,width:13,height:13,borderLeftWidth:4,borderBottomWidth:4,borderColor:colors.goldLight,zIndex:5},
  cornerBR:{position:'absolute',right:-5,bottom:-5,width:13,height:13,borderRightWidth:4,borderBottomWidth:4,borderColor:colors.goldLight,zIndex:5},
});
