import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PixelDecor } from './PixelDecor';

/**
 * A tiny aquarium diorama rather than a bare asset preview. Keeping the decor
 * grounded in water/substrate makes the upgrade shop read like part of the
 * tank instead of a generic inventory grid.
 */
export function DecorThumbnail({id}:{id:string}){
  return <View style={styles.frame} pointerEvents="none">
    <View style={styles.waterGlow}/>
    <View style={[styles.bubble,{left:14,top:14}]}/>
    <View style={[styles.bubble,styles.smallBubble,{right:17,top:24}]}/>
    <View style={[styles.bubble,styles.tinyBubble,{right:28,top:10}]}/>
    <View style={styles.causticA}/>
    <View style={styles.causticB}/>
    <View style={styles.decor}><PixelDecor id={id} scale={.82}/></View>
    <View style={styles.substrate}/>
    <View style={[styles.gravel,{left:13,bottom:7}]}/>
    <View style={[styles.gravel,{left:31,bottom:5,width:9}]}/>
    <View style={[styles.gravel,{right:18,bottom:8,width:6}]}/>
    <View style={styles.glassHighlight}/>
    <View style={styles.pixelCornerTL}/><View style={styles.pixelCornerBR}/>
  </View>;
}

const styles=StyleSheet.create({
  frame:{width:92,height:72,alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',backgroundColor:'#083E55',borderWidth:2,borderColor:'#1C6C7E'},
  waterGlow:{position:'absolute',left:3,right:3,top:3,bottom:12,backgroundColor:'#0D566B'},
  decor:{zIndex:5,transform:[{translateY:2}]},
  substrate:{position:'absolute',left:0,right:0,bottom:0,height:13,backgroundColor:'#8A6846',borderTopWidth:2,borderTopColor:'#B89561'},
  gravel:{position:'absolute',width:7,height:3,backgroundColor:'#D0AF76',zIndex:7},
  bubble:{position:'absolute',width:7,height:7,borderRadius:4,borderWidth:2,borderColor:'#8EE7E8',backgroundColor:'#D7FFFF22',zIndex:3},
  smallBubble:{width:5,height:5,borderRadius:3,borderWidth:1},
  tinyBubble:{width:3,height:3,borderRadius:2,borderWidth:1},
  causticA:{position:'absolute',left:7,top:8,width:26,height:3,backgroundColor:'#8EE7E82E',transform:[{skewX:'-24deg'}]},
  causticB:{position:'absolute',right:7,top:35,width:21,height:2,backgroundColor:'#8EE7E824',transform:[{skewX:'20deg'}]},
  glassHighlight:{position:'absolute',left:4,top:5,bottom:17,width:2,backgroundColor:'#D7FFFF42',zIndex:8},
  pixelCornerTL:{position:'absolute',left:0,top:0,width:6,height:6,borderTopWidth:2,borderLeftWidth:2,borderColor:'#7DD7D5',zIndex:9},
  pixelCornerBR:{position:'absolute',right:0,bottom:0,width:6,height:6,borderRightWidth:2,borderBottomWidth:2,borderColor:'#052C3B',zIndex:9},
});
