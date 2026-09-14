import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Pattern = 'solid' | 'banded' | 'striped' | 'spotted';
type Trait = 'long-whiskers' | 'fan-tail' | 'claws' | 'crown' | 'red-tie' | 'pinstripe' | 'glasses' | 'briefcase';
export type ShrimpAccessory = 'chain' | 'crown' | 'visor' | 'suit';

export function PixelShrimp({ color, accentColor = '#F5B6A9', pattern = 'solid', trait, accessory, size = 48, flip = false }: { color: string; accentColor?: string; pattern?: Pattern; trait?: Trait; accessory?: ShrimpAccessory; size?: number; flip?: boolean }) {
  const visualScale = trait === 'briefcase' ? 1.5 : 1;
  const scale = (size / 48) * visualScale;
  const px = (value: number) => value * scale;
  const frameW = 62 * scale;
  const frameH = 39 * scale;
  return (
    <View accessibilityLabel="Detailed pixel shrimp" style={[styles.canvas, { width: frameW, height: frameH, transform: [{ scaleX: flip ? -1 : 1 }] }]}>
      <View style={[styles.shadow, { width: px(39), height: px(6), left: px(9), top: px(28), borderRadius: px(5) }]} />

      <View style={[styles.tailRear, { width: px(14), height: px(14), left: px(0), top: px(10), transform: [{ rotate: '45deg' }] }]} />
      <LinearGradient colors={[accentColor, color]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.tail, { width: px(13), height: px(13), left: px(1), top: px(9), transform: [{ rotate: '45deg' }], borderRadius: px(2) }]} />
      <View style={[styles.tailCut, { width: px(4), height: px(7), left: px(4), top: px(6), transform: [{ rotate: '-22deg' }] }]} />
      <View style={[styles.tailCut, { width: px(4), height: px(7), left: px(4), top: px(21), transform: [{ rotate: '22deg' }] }]} />
      {trait === 'fan-tail' && <><View style={[styles.tailFin, { backgroundColor: accentColor, width: px(13), height: px(9), left: px(-3), top: px(1), transform: [{ rotate: '-23deg' }] }]} /><View style={[styles.tailFin, { backgroundColor: accentColor, width: px(13), height: px(9), left: px(-3), top: px(23), transform: [{ rotate: '23deg' }] }]} /></>}

      <View style={[styles.underBody, { width: px(31), height: px(10), left: px(11), top: px(18), borderRadius: px(5) }]} />
      <LinearGradient colors={[accentColor, color]} start={{x:0,y:0}} end={{x:.7,y:1}} style={[styles.bodyPlate, { width: px(15), height: px(17), left: px(9), top: px(8), borderRadius: px(4) }]} />
      <LinearGradient colors={[accentColor, color]} start={{x:0,y:0}} end={{x:.7,y:1}} style={[styles.bodyPlate, { width: px(16), height: px(18), left: px(20), top: px(6.5), borderRadius: px(4) }]} />
      <LinearGradient colors={[accentColor, color]} start={{x:0,y:0}} end={{x:.7,y:1}} style={[styles.bodyPlate, { width: px(15), height: px(17), left: px(32), top: px(6), borderRadius: px(4) }]} />
      <LinearGradient colors={[accentColor, color]} start={{x:0,y:0}} end={{x:.8,y:1}} style={[styles.head, { width: px(13), height: px(15), left: px(43), top: px(5), borderRadius: px(4) }]} />

      <View style={[styles.segmentShade, { width: px(2), height: px(15), left: px(20), top: px(8) }]} />
      <View style={[styles.segmentShade, { width: px(2), height: px(15), left: px(32), top: px(7) }]} />
      <View style={[styles.segmentShade, { width: px(2), height: px(13), left: px(43), top: px(7) }]} />
      <View style={[styles.shellRim, { width: px(34), height: px(2), left: px(13), top: px(8), borderRadius: px(2) }]} />
      <View style={[styles.shellGlint, { width: px(8), height: px(2), left: px(23), top: px(8), borderRadius: px(2) }]} />
      <View style={[styles.shellGlint, { width: px(5), height: px(2), left: px(38), top: px(8), borderRadius: px(2) }]} />

      {pattern === 'banded' && <><View style={[styles.mark, { backgroundColor: accentColor, width: px(5), height: px(16), left: px(15), top: px(8) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(5), height: px(17), left: px(29), top: px(7) }]} /></>}
      {pattern === 'striped' && <><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(15), left: px(15), top: px(8) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(16), left: px(25), top: px(7) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(15), left: px(36), top: px(7) }]} /></>}
      {pattern === 'spotted' && <><View style={[styles.spot, { backgroundColor: accentColor, width: px(4), height: px(4), left: px(16), top: px(11), borderRadius:px(2) }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: px(4), height: px(4), left: px(29), top: px(16), borderRadius:px(2) }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: px(3), height: px(3), left: px(40), top: px(10), borderRadius:px(2) }]} /></>}
      {trait === 'pinstripe' && <><View style={[styles.pinstripe,{left:px(17),top:px(8),height:px(14)}]}/><View style={[styles.pinstripe,{left:px(26),top:px(7),height:px(16)}]}/><View style={[styles.pinstripe,{left:px(36),top:px(7),height:px(15)}]}/></>}

      <View style={[styles.eyeSocket, { width:px(6),height:px(6),left:px(49),top:px(4),borderRadius:px(3)}]} />
      <View style={[styles.eyeWhite, { width:px(4.5),height:px(4.5),left:px(50),top:px(4.5),borderRadius:px(3)}]} />
      <View style={[styles.eye, { width:px(2.3),height:px(2.3),left:px(51.3),top:px(5.5),borderRadius:px(2)}]} />
      <View style={[styles.mouth, { width:px(5),height:px(1.5),left:px(51),top:px(14),transform:[{rotate:'8deg'}]}]} />

      <View style={[styles.legShadow,{width:px(2),height:px(8),left:px(17),top:px(22),transform:[{rotate:'25deg'}]}]}/><View style={[styles.leg,{backgroundColor:accentColor,width:px(2),height:px(8),left:px(16),top:px(21),transform:[{rotate:'27deg'}]}]}/>
      <View style={[styles.legShadow,{width:px(2),height:px(10),left:px(23),top:px(22),transform:[{rotate:'17deg'}]}]}/><View style={[styles.leg,{backgroundColor:accentColor,width:px(2),height:px(10),left:px(22),top:px(21),transform:[{rotate:'19deg'}]}]}/>
      <View style={[styles.legShadow,{width:px(2),height:px(9),left:px(30),top:px(22),transform:[{rotate:'23deg'}]}]}/><View style={[styles.leg,{backgroundColor:accentColor,width:px(2),height:px(9),left:px(29),top:px(21),transform:[{rotate:'25deg'}]}]}/>
      <View style={[styles.legShadow,{width:px(2),height:px(8),left:px(37),top:px(21),transform:[{rotate:'16deg'}]}]}/><View style={[styles.leg,{backgroundColor:accentColor,width:px(2),height:px(8),left:px(36),top:px(20),transform:[{rotate:'18deg'}]}]}/>

      <View style={[styles.antennaShadow,{width:px(18),left:px(51),top:px(8),transform:[{rotate:'-18deg'}]}]}/><View style={[styles.antenna,{backgroundColor:accentColor,width:px(18),left:px(51),top:px(7),transform:[{rotate:'-18deg'}]}]}/>
      <View style={[styles.antennaShadow,{width:px(15),left:px(51),top:px(13),transform:[{rotate:'12deg'}]}]}/><View style={[styles.antenna,{backgroundColor:accentColor,width:px(15),left:px(51),top:px(12),transform:[{rotate:'12deg'}]}]}/>
      {trait === 'long-whiskers' && <><View style={[styles.antenna,{backgroundColor:accentColor,width:px(30),left:px(49),top:px(5),transform:[{rotate:'-25deg'}]}]}/><View style={[styles.antenna,{backgroundColor:accentColor,width:px(27),left:px(50),top:px(14),transform:[{rotate:'20deg'}]}]}/></>}

      {trait === 'crown' && <><View style={[styles.crest,{backgroundColor:accentColor,width:px(5),height:px(7),left:px(42),top:px(-1)}]}/><View style={[styles.crest,{backgroundColor:accentColor,width:px(5),height:px(9),left:px(48),top:px(-3)}]}/></>}
      {trait === 'red-tie' && <><View style={[styles.tieKnot,{width:px(5),height:px(4),left:px(42),top:px(16)}]}/><View style={[styles.tieBody,{width:px(5),height:px(10),left:px(42),top:px(19)}]}/></>}
      {trait === 'glasses' && <><View style={[styles.glassesLens,{width:px(7),height:px(5),left:px(45),top:px(3)}]}/><View style={[styles.glassesLens,{width:px(7),height:px(5),left:px(52),top:px(3)}]}/><View style={[styles.glassesBridge,{width:px(4),height:px(1.5),left:px(50),top:px(5)}]}/></>}
      {trait === 'briefcase' && <><View style={[styles.miniCase,{width:px(13),height:px(9),left:px(31),top:px(25)}]}/><View style={[styles.miniHandle,{width:px(6),height:px(3),left:px(34),top:px(23)}]}/></>}
      {trait === 'claws' && <><View style={[styles.arm,{backgroundColor:accentColor,width:px(15),height:px(3),left:px(44),top:px(19),transform:[{rotate:'20deg'}]}]}/><View style={[styles.claw,{borderColor:accentColor,width:px(9),height:px(8),left:px(56),top:px(21),borderWidth:Math.max(1,px(3))}]}/></>}

      {accessory === 'chain' && <><View style={[styles.chain,{width:px(20),height:px(3),left:px(26),top:px(19),transform:[{rotate:'10deg'}]}]}/><View style={[styles.pendant,{width:px(5),height:px(5),left:px(35),top:px(22)}]}/></>}
      {accessory === 'crown' && <><View style={[styles.goldCrownBase,{width:px(16),height:px(4),left:px(42),top:px(-3)}]}/><View style={[styles.goldCrownPoint,{width:px(4),height:px(8),left:px(43),top:px(-9)}]}/><View style={[styles.goldCrownPoint,{width:px(4),height:px(11),left:px(49),top:px(-12)}]}/><View style={[styles.goldCrownPoint,{width:px(4),height:px(8),left:px(55),top:px(-9)}]}/></>}
      {accessory === 'visor' && <><View style={[styles.visorBand,{width:px(19),height:px(3),left:px(40),top:px(1),transform:[{rotate:'-7deg'}]}]}/><View style={[styles.visorBill,{width:px(15),height:px(4),left:px(45),top:px(-2),transform:[{rotate:'-7deg'}]}]}/><View style={[styles.visorHighlight,{width:px(7),height:px(1.5),left:px(47),top:px(-1)}]}/></>}
      {accessory === 'suit' && <><View style={[styles.suitJacket,{width:px(25),height:px(12),left:px(23),top:px(13),borderRadius:px(2)}]}/><View style={[styles.suitShirt,{width:px(8),height:px(9),left:px(32),top:px(13)}]}/><View style={[styles.suitLapels,{width:px(18),height:px(7),left:px(27),top:px(13)}]}/><View style={[styles.suitTieKnot,{width:px(4),height:px(4),left:px(34),top:px(14)}]}/><View style={[styles.suitTieBody,{width:px(4),height:px(9),left:px(34),top:px(17)}]}/><View style={[styles.suitPocket,{width:px(6),height:px(2),left:px(25),top:px(18)}]}/></>}
    </View>
  );
}

const styles=StyleSheet.create({
  canvas:{position:'relative'},shadow:{position:'absolute',backgroundColor:'#04151C55'},tailRear:{position:'absolute',backgroundColor:'#071A224D'},tail:{position:'absolute',borderWidth:1,borderColor:'#071A2238'},tailCut:{position:'absolute',backgroundColor:'#071A2238'},tailFin:{position:'absolute',borderRadius:2},underBody:{position:'absolute',backgroundColor:'#081D244E'},bodyPlate:{position:'absolute',borderWidth:1,borderColor:'#071A2235'},head:{position:'absolute',borderWidth:1,borderColor:'#071A2238'},segmentShade:{position:'absolute',backgroundColor:'#071A222F'},shellRim:{position:'absolute',backgroundColor:'#FFFFFF32'},shellGlint:{position:'absolute',backgroundColor:'#FFFFFF8A'},mark:{position:'absolute',opacity:.88},spot:{position:'absolute'},pinstripe:{position:'absolute',width:1,backgroundColor:'#EEF5F6B5'},eyeSocket:{position:'absolute',backgroundColor:'#071A225A'},eyeWhite:{position:'absolute',backgroundColor:'#F7FFF6'},eye:{position:'absolute',backgroundColor:'#061117'},mouth:{position:'absolute',backgroundColor:'#10252A88'},leg:{position:'absolute'},legShadow:{position:'absolute',backgroundColor:'#071A2244'},antenna:{position:'absolute',height:2},antennaShadow:{position:'absolute',height:2,backgroundColor:'#071A2240'},crest:{position:'absolute'},arm:{position:'absolute'},claw:{position:'absolute',borderLeftWidth:0,backgroundColor:'transparent'},chain:{position:'absolute',backgroundColor:'#F8C83B',borderBottomWidth:1,borderBottomColor:'#8C5F1C'},pendant:{position:'absolute',backgroundColor:'#FFE783',borderWidth:1,borderColor:'#8C5F1C',transform:[{rotate:'45deg'}]},goldCrownBase:{position:'absolute',backgroundColor:'#F2B92E',borderBottomWidth:1,borderBottomColor:'#8F5E17'},goldCrownPoint:{position:'absolute',backgroundColor:'#FFD95A'},visorBand:{position:'absolute',backgroundColor:'#21492F',borderBottomWidth:1,borderBottomColor:'#10281A'},visorBill:{position:'absolute',backgroundColor:'#4FA66A',borderWidth:1,borderColor:'#1E5B32'},visorHighlight:{position:'absolute',backgroundColor:'#A4E2AF'},tieKnot:{position:'absolute',backgroundColor:'#B91922',transform:[{rotate:'45deg'}]},tieBody:{position:'absolute',backgroundColor:'#E02B34',transform:[{rotate:'8deg'}]},glassesLens:{position:'absolute',borderWidth:1.5,borderColor:'#101B22',backgroundColor:'#B9D7E655'},glassesBridge:{position:'absolute',backgroundColor:'#101B22'},miniCase:{position:'absolute',backgroundColor:'#8A5A32',borderWidth:1,borderColor:'#422D1C'},miniHandle:{position:'absolute',borderWidth:1,borderBottomWidth:0,borderColor:'#422D1C'},suitJacket:{position:'absolute',backgroundColor:'#172638',borderWidth:1,borderColor:'#09131D'},suitShirt:{position:'absolute',backgroundColor:'#F3F0E4'},suitLapels:{position:'absolute',borderTopWidth:2,borderBottomWidth:2,borderColor:'#344A63',transform:[{rotate:'-4deg'}]},suitTieKnot:{position:'absolute',backgroundColor:'#A7222A',transform:[{rotate:'45deg'}]},suitTieBody:{position:'absolute',backgroundColor:'#D5323B',transform:[{rotate:'4deg'}]},suitPocket:{position:'absolute',backgroundColor:'#EEF1E7'},
});
