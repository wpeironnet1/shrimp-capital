import React from 'react';
import { StyleSheet, View } from 'react-native';
import { decorItems, DecorSlot } from '../game/decor';
import { PixelText } from './PixelText';

const positions: Record<DecorSlot, object> = {
  'floor-left': { left: 52, bottom: 32 },
  'floor-center': { left: '44%', bottom: 32 },
  'floor-right': { right: 86, bottom: 32 },
  'wall-left': { left: 72, top: 54 },
  'wall-center': { left: '39%', top: 46 },
  'wall-right': { right: 76, top: 54 },
  ceiling: { left: '42%', top: 17 },
  corner: { right: 22, bottom: 35 },
};

function DecorVisual({ id }: { id: string }) {
  if (id === 'desk') return <View style={styles.desk}><View style={styles.deskTop} /><View style={styles.deskLegL} /><View style={styles.deskLegR} /><View style={styles.paper} /></View>;
  if (id === 'banker-lamp') return <View style={styles.lamp}><View style={styles.lampShade} /><View style={styles.lampStem} /><View style={styles.lampBase} /></View>;
  if (id === 'ticker') return <View style={styles.ticker}><PixelText style={styles.tickerText}>SHRP ▲ 4.2%  AUM ↑</PixelText></View>;
  if (id === 'terminal') return <View style={styles.terminal}><View style={styles.screen}><PixelText style={styles.screenText}>▲$</PixelText></View><View style={styles.keyboard} /></View>;
  if (id === 'chart') return <View style={styles.poster}><View style={styles.chartLine1} /><View style={styles.chartLine2} /></View>;
  if (id === 'pnl') return <View style={styles.pnl}><PixelText style={styles.pnlText}>P&L</PixelText><View style={styles.pnlGreen} /><View style={styles.pnlRed} /></View>;
  if (id === 'bull') return <View style={styles.bull}><View style={styles.bullBody} /><View style={styles.bullHead} /><View style={styles.hornL} /><View style={styles.hornR} /></View>;
  if (id === 'briefcase') return <View style={styles.briefcase}><View style={styles.handle} /></View>;
  if (id === 'vault') return <View style={styles.vault}><View style={styles.vaultWheel}><View style={styles.vaultSpokeH} /><View style={styles.vaultSpokeV} /></View></View>;
  if (id === 'earnings') return <View style={styles.sign}><PixelText style={styles.signText}>EARNINGS CALL</PixelText></View>;
  if (id === 'nameplate') return <View style={styles.nameplate}><PixelText style={styles.nameplateText}>CEO</PixelText></View>;
  if (id === 'mahogany') return <View style={styles.mahogany}><View style={styles.woodLine} /></View>;
  if (id === 'brass-rail') return <View style={styles.rail}><View style={styles.railPostL} /><View style={styles.railPostR} /></View>;
  if (id === 'velvet-rope') return <View style={styles.rope}><View style={styles.ropePostL} /><View style={styles.ropePostR} /><View style={styles.ropeLine} /></View>;
  if (id === 'skyline') return <View style={styles.skyline}><View style={[styles.building,{height:18}]} /><View style={[styles.building,{height:28}]} /><View style={[styles.building,{height:22}]} /><View style={[styles.building,{height:34}]} /></View>;
  if (id === 'ceo-portrait') return <View style={styles.portrait}><View style={styles.portraitHead} /><View style={styles.portraitBody} /></View>;
  if (id === 'private-bank') return <View style={styles.bankSign}><PixelText style={styles.bankText}>PRIVATE AQUATIC BANK</PixelText></View>;
  if (id === 'chandelier') return <View style={styles.chandelier}><View style={styles.chandelierBar} /><View style={styles.lightBulb} /><View style={[styles.lightBulb,{left:14}]} /><View style={[styles.lightBulb,{left:28}]} /></View>;
  if (id === 'visor-rack') return <View style={styles.visorRack}><View style={styles.visorOne} /><View style={styles.visorTwo} /><View style={styles.visorThree} /></View>;
  if (id === 'calculator') return <View style={styles.calculator}><View style={styles.calcScreen} /><View style={styles.calcKeyRow} /></View>;
  if (id === 'ledger') return <View style={styles.ledger}><View style={styles.ledgerBook1} /><View style={styles.ledgerBook2} /></View>;
  if (id === 'buy-dip') return <View style={styles.sign}><PixelText style={styles.signText}>BUY THE DIP</PixelText></View>;
  if (id === 'compliance-sign') return <View style={styles.sign}><PixelText style={styles.signText}>COMPLIANCE IS WATCHING</PixelText></View>;
  if (id === 'liquidity-plaque') return <View style={styles.plaque}><PixelText style={styles.plaqueText}>LIQUIDITY POOL</PixelText></View>;
  if (id === 'espresso') return <View style={styles.espresso}><View style={styles.espressoTop} /><View style={styles.espressoSpout} /><View style={styles.espressoCup} /></View>;
  if (id === 'opening-bell') return <View style={styles.bell}><View style={styles.bellDome} /><View style={styles.bellBase} /></View>;
  if (id === 'water-cooler') return <View style={styles.cooler}><View style={styles.coolerBottle} /><View style={styles.coolerBase} /></View>;
  if (id === 'filing') return <View style={styles.filing}><View style={styles.drawer} /><View style={styles.drawer} /></View>;
  if (id === 'coffee-cart') return <View style={styles.cart}><View style={styles.cartTop} /><View style={styles.cartLeg} /></View>;
  if (id === 'copier') return <View style={styles.copier}><View style={styles.copierTop} /><View style={styles.copierLight} /></View>;
  if (id === 'meeting') return <View style={styles.meeting}><View style={styles.meetingTop} /><View style={styles.meetingLeg} /></View>;
  if (id === 'chair') return <View style={styles.chair}><View style={styles.chairBack} /><View style={styles.chairSeat} /><View style={styles.chairStem} /></View>;
  return <View style={styles.generic}><PixelText style={styles.genericText}>$</PixelText></View>;
}

export function TankOfficeDecor({ placed }: { placed: Partial<Record<DecorSlot, string>> }) {
  return <>{Object.entries(placed).map(([slot, id]) => {
    if (!id || !decorItems.some((item) => item.id === id)) return null;
    return <View pointerEvents="none" key={`${slot}-${id}`} style={[styles.item, positions[slot as DecorSlot]]}><DecorVisual id={id} /></View>;
  })}</>;
}

const styles = StyleSheet.create({
  item:{position:'absolute',zIndex:5}, generic:{width:28,height:22,backgroundColor:'#C79C4A',borderWidth:2,borderColor:'#5E4727',alignItems:'center',justifyContent:'center'},genericText:{fontSize:8,color:'#2C281F'},
  desk:{width:46,height:29},deskTop:{position:'absolute',top:6,width:46,height:6,backgroundColor:'#7B553B',borderWidth:2,borderColor:'#38281E'},deskLegL:{position:'absolute',left:5,top:12,width:5,height:17,backgroundColor:'#5D4030'},deskLegR:{position:'absolute',right:5,top:12,width:5,height:17,backgroundColor:'#5D4030'},paper:{position:'absolute',left:8,top:2,width:17,height:5,backgroundColor:'#EFE5C6'},
  lamp:{width:28,height:34},lampShade:{position:'absolute',top:2,left:7,width:19,height:9,backgroundColor:'#2F8A59',transform:[{skewX:'-14deg'}]},lampStem:{position:'absolute',left:15,top:10,width:3,height:17,backgroundColor:'#C8A652'},lampBase:{position:'absolute',left:8,bottom:2,width:17,height:4,backgroundColor:'#9E7C35'},
  ticker:{width:118,height:18,backgroundColor:'#071A22',borderWidth:2,borderColor:'#9A7938',justifyContent:'center',paddingHorizontal:5},tickerText:{fontSize:6,color:'#7CF3AB'},
  terminal:{width:40,height:34},screen:{width:34,height:22,backgroundColor:'#091A22',borderWidth:3,borderColor:'#3D6268',alignItems:'center',justifyContent:'center'},screenText:{fontSize:7,color:'#73E5B4'},keyboard:{marginTop:2,width:40,height:6,backgroundColor:'#4A5960'},
  poster:{width:42,height:31,backgroundColor:'#F1E8C9',borderWidth:3,borderColor:'#6B5137'},chartLine1:{position:'absolute',left:6,bottom:7,width:19,height:3,backgroundColor:'#4D9F69',transform:[{rotate:'-24deg'}]},chartLine2:{position:'absolute',left:21,bottom:12,width:13,height:3,backgroundColor:'#4D9F69',transform:[{rotate:'22deg'}]},
  pnl:{width:43,height:31,backgroundColor:'#10282E',borderWidth:2,borderColor:'#A68B50',padding:4},pnlText:{fontSize:6,color:'#F3DE9C'},pnlGreen:{width:27,height:4,backgroundColor:'#62D58D',marginTop:3},pnlRed:{width:16,height:4,backgroundColor:'#E06D65',marginTop:2},
  bull:{width:40,height:27},bullBody:{position:'absolute',left:8,top:10,width:22,height:11,backgroundColor:'#C49442'},bullHead:{position:'absolute',right:2,top:8,width:11,height:10,backgroundColor:'#D0A44F'},hornL:{position:'absolute',right:4,top:3,width:9,height:3,backgroundColor:'#EEE0AF',transform:[{rotate:'-25deg'}]},hornR:{position:'absolute',right:-2,top:5,width:8,height:3,backgroundColor:'#EEE0AF',transform:[{rotate:'25deg'}]},
  briefcase:{width:34,height:22,backgroundColor:'#D2A747',borderWidth:2,borderColor:'#7C5B26'},handle:{position:'absolute',left:10,top:-7,width:12,height:7,borderWidth:2,borderBottomWidth:0,borderColor:'#A47C31'},
  vault:{width:42,height:42,borderRadius:21,backgroundColor:'#61747A',borderWidth:5,borderColor:'#293D42',alignItems:'center',justifyContent:'center'},vaultWheel:{width:19,height:19,borderRadius:10,borderWidth:3,borderColor:'#D0B26D'},vaultSpokeH:{position:'absolute',top:6,left:0,width:13,height:2,backgroundColor:'#D0B26D'},vaultSpokeV:{position:'absolute',left:6,top:0,width:2,height:13,backgroundColor:'#D0B26D'},
  sign:{minWidth:68,height:22,backgroundColor:'#16343D',borderWidth:2,borderColor:'#D2AE55',alignItems:'center',justifyContent:'center',paddingHorizontal:5},signText:{fontSize:5,color:'#F4D681'},
  nameplate:{width:40,height:15,backgroundColor:'#D1A642',borderWidth:2,borderColor:'#7B5B22',alignItems:'center',justifyContent:'center'},nameplateText:{fontSize:6,color:'#342B19'},mahogany:{width:50,height:38,backgroundColor:'#5D352A',borderWidth:3,borderColor:'#2E1B17'},woodLine:{margin:7,width:31,height:3,backgroundColor:'#7E5141'},
  rail:{width:62,height:25,borderTopWidth:4,borderColor:'#D3B15D'},railPostL:{position:'absolute',left:4,top:0,width:4,height:24,backgroundColor:'#D3B15D'},railPostR:{position:'absolute',right:4,top:0,width:4,height:24,backgroundColor:'#D3B15D'},
  rope:{width:58,height:27},ropePostL:{position:'absolute',left:3,top:3,width:4,height:23,backgroundColor:'#D0A24D'},ropePostR:{position:'absolute',right:3,top:3,width:4,height:23,backgroundColor:'#D0A24D'},ropeLine:{position:'absolute',left:7,top:8,width:45,height:5,backgroundColor:'#9C2F3B',transform:[{rotate:'7deg'}]},
  skyline:{width:72,height:40,backgroundColor:'#102530',flexDirection:'row',alignItems:'flex-end',gap:4,padding:5,borderWidth:2,borderColor:'#49616D'},building:{width:11,backgroundColor:'#314F61'},portrait:{width:35,height:43,backgroundColor:'#6D4B36',borderWidth:3,borderColor:'#C2A25B',alignItems:'center',paddingTop:7},portraitHead:{width:10,height:10,borderRadius:5,backgroundColor:'#E7A89B'},portraitBody:{width:17,height:15,backgroundColor:'#253E49',marginTop:3},
  bankSign:{width:92,height:27,backgroundColor:'#19232A',borderWidth:3,borderColor:'#D5B15A',alignItems:'center',justifyContent:'center'},bankText:{fontSize:5,color:'#F5DC97'},chandelier:{width:42,height:24},chandelierBar:{position:'absolute',top:0,left:0,width:40,height:4,backgroundColor:'#C3A24D'},lightBulb:{position:'absolute',top:6,left:2,width:9,height:11,backgroundColor:'#FFEBA1',borderRadius:5},
  visorRack:{width:48,height:30,borderWidth:2,borderColor:'#705339',backgroundColor:'#5F4330'},visorOne:{position:'absolute',left:4,top:6,width:11,height:6,backgroundColor:'#4CA66A'},visorTwo:{position:'absolute',left:18,top:11,width:11,height:6,backgroundColor:'#4CA66A'},visorThree:{position:'absolute',left:31,top:5,width:11,height:6,backgroundColor:'#4CA66A'},calculator:{width:27,height:31,backgroundColor:'#47545B',borderWidth:2,borderColor:'#1E2F35'},calcScreen:{margin:4,width:15,height:7,backgroundColor:'#9BD7A8'},calcKeyRow:{marginLeft:4,width:15,height:9,borderTopWidth:3,borderBottomWidth:3,borderColor:'#88989E'},ledger:{width:37,height:22},ledgerBook1:{position:'absolute',bottom:0,width:35,height:8,backgroundColor:'#9A4738'},ledgerBook2:{position:'absolute',bottom:9,left:5,width:29,height:8,backgroundColor:'#466B8C'},plaque:{width:61,height:16,backgroundColor:'#725439',borderWidth:2,borderColor:'#C8A66A',alignItems:'center',justifyContent:'center'},plaqueText:{fontSize:4,color:'#F1D9A8'},
  espresso:{width:35,height:34,backgroundColor:'#58666B',borderWidth:2,borderColor:'#27383D'},espressoTop:{height:8,backgroundColor:'#313D41'},espressoSpout:{position:'absolute',left:8,top:14,width:13,height:4,backgroundColor:'#202C30'},espressoCup:{position:'absolute',left:10,bottom:2,width:12,height:9,borderWidth:2,borderTopWidth:0,borderColor:'#F0E6C7'},bell:{width:29,height:24},bellDome:{width:25,height:16,borderTopLeftRadius:14,borderTopRightRadius:14,backgroundColor:'#D0A33B'},bellBase:{width:29,height:5,backgroundColor:'#7D5B21'},cooler:{width:24,height:40},coolerBottle:{width:16,height:18,borderRadius:6,backgroundColor:'#80D3E0',alignSelf:'center'},coolerBase:{width:24,height:22,backgroundColor:'#D8E1E0'},filing:{width:26,height:37,backgroundColor:'#617079',padding:4,gap:3},drawer:{height:11,backgroundColor:'#87949A',borderWidth:1,borderColor:'#36474D'},cart:{width:37,height:28},cartTop:{width:37,height:9,backgroundColor:'#8B5B38'},cartLeg:{width:4,height:18,backgroundColor:'#5D3C29',marginLeft:7},copier:{width:31,height:34,backgroundColor:'#C5CBC8',borderWidth:2,borderColor:'#59666A'},copierTop:{height:8,backgroundColor:'#424F55'},copierLight:{width:4,height:4,backgroundColor:'#6CE88B',margin:5},meeting:{width:50,height:24},meetingTop:{width:50,height:9,borderRadius:5,backgroundColor:'#805537'},meetingLeg:{width:5,height:16,backgroundColor:'#5C3E2C',alignSelf:'center'},chair:{width:28,height:35},chairBack:{width:21,height:16,backgroundColor:'#334851',borderRadius:6},chairSeat:{width:26,height:8,backgroundColor:'#405962'},chairStem:{width:4,height:11,backgroundColor:'#66777D',alignSelf:'center'},
});
