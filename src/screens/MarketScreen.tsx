import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { CapitalHeader } from '../components/CapitalHeader';
import { DecorThumbnail } from '../components/DecorThumbnail';
import { PixelText } from '../components/PixelText';
import { upgrades } from '../game/catalog';
import { DecorCategory, decorItems, decorSlots } from '../game/decor';
import { useGame } from '../game/GameProvider';
import { tankHealth, upgradeCost } from '../game/engine';
import { colors } from '../theme/colors';

const categories: DecorCategory[] = ['Office Furniture', 'Finance Props', 'Executive Decor', 'Wall Street Jokes'];

function MarketScene() {
  return (
    <View style={styles.sceneFrame}>
      <LinearGradient colors={['#195A6A', '#0D3C4B', '#071E29']} style={styles.sceneWater}>
        <View style={styles.sceneCity}>
          {[46, 72, 55, 84, 63, 76, 49, 68].map((height, index) => (
            <View key={index} style={[styles.sceneTower, { height }]} />
          ))}
        </View>

        <View style={styles.scenePlantL}>
          <View style={styles.plantStem} />
          <View style={[styles.plantLeaf, { top: 4, left: 2, transform: [{ rotate: '-28deg' }] }]} />
          <View style={[styles.plantLeaf, { top: 14, left: 10, transform: [{ rotate: '24deg' }] }]} />
        </View>
        <View style={styles.scenePlantR}>
          <View style={styles.plantStem} />
          <View style={[styles.plantLeaf, { top: 4, left: 2, transform: [{ rotate: '-28deg' }] }]} />
          <View style={[styles.plantLeaf, { top: 14, left: 10, transform: [{ rotate: '24deg' }] }]} />
        </View>

        <View style={styles.desk}>
          <View style={styles.deskTop} />
          <View style={styles.deskBody}>
            <View style={styles.deskDrawer} />
            <View style={styles.deskDrawer} />
          </View>
        </View>

        <View style={styles.bankLamp}>
          <View style={styles.lampShade} />
          <View style={styles.lampStem} />
          <View style={styles.lampBase} />
        </View>

        <View style={styles.books}>
          <View style={styles.bookA} />
          <View style={styles.bookB} />
          <View style={styles.bookC} />
        </View>

        <View style={styles.globe}>
          <View style={styles.globeBall}>
            <View style={styles.globeLineH} />
            <View style={styles.globeLineV} />
          </View>
          <View style={styles.globeStand} />
        </View>

        <View style={styles.poster}>
          <PixelText style={styles.posterText}>BUY{`\n`}HOLD{`\n`}MOLT{`\n`}REPEAT</PixelText>
        </View>
        <View style={styles.sceneFloor} />
        <View style={styles.scenePlaque}>
          <PixelText style={styles.scenePlaqueText}>CAPITAL CULTURE · CRUSTACEANS</PixelText>
        </View>
      </LinearGradient>
    </View>
  );
}

function EquipmentPreview({ id, level }: { id: string; level: number }) {
  const tier = Math.max(1, level);
  return (
    <View style={styles.previewStage}>
      <LinearGradient colors={['#123B49', '#08242D']} style={StyleSheet.absoluteFill} />
      <View style={styles.previewGrid} />
      <View style={styles.previewFloor} />

      {id === 'filter' && <><View style={styles.pPipe}/><View style={styles.pCan}><View style={styles.pWindow}/></View>{tier >= 2 && <View style={[styles.pCan,{left:30,height:40}]}/>} {tier >= 4 && <View style={styles.pGauge}/>}</>}
      {id === 'heater' && <><View style={styles.pHeater}/><View style={styles.pConsole}/>{tier >= 3 && <View style={styles.pCopper}/>}</>}
      {id === 'algae' && <><View style={styles.pTray}/><View style={styles.pAlgae}/>{tier >= 3 && <View style={styles.pHopper}/>}</>}
      {id === 'oxygen' && <><View style={styles.pPump}/><View style={styles.pTube}/><View style={styles.pBubble}/><View style={[styles.pBubble,{top:8,left:41}]}/><View style={[styles.pBubble,{top:2,left:31,width:5,height:5}]}/></>}
      {id === 'breeding-lab' && <><View style={styles.pLab}><View style={styles.pLabGlass}><View style={styles.pEgg}/></View></View><View style={styles.pLamp}/></>}
      {id === 'compliance' && <><View style={styles.pDesk}/><View style={styles.pClipboard}/><View style={styles.pLampSmall}/></>}
      {id === 'terminal' && <><View style={styles.pScreen}><PixelText style={styles.pScreenText}>SHRP ▲</PixelText><View style={styles.pGraph}/></View><View style={styles.pKeyboard}/></>}
      {id === 'lighting' && <><View style={styles.pLightBar}/><View style={styles.pLightOne}/><View style={styles.pLightTwo}/><View style={styles.pLightCone}/></>}
      {id === 'generator' && <View style={styles.pGenerator}><View style={styles.pGenPanel}/><View style={styles.pStatus}/><View style={styles.pVent}/></View>}
      {id === 'showcase' && <><View style={styles.pShowcase}/><View style={styles.pPedestal}/><View style={styles.pRopeL}/><View style={styles.pRopeR}/></>}
      {id === 'collector' && <><View style={styles.pArm}/><View style={styles.pJoint}/><View style={styles.pNet}/></>}

      <View style={styles.previewBadge}>
        <PixelText style={styles.previewBadgeText}>{level > 0 ? `LV ${level}` : 'NEW'}</PixelText>
      </View>
    </View>
  );
}

function SectionPlaque({ title, copy, right }: { title: string; copy: string; right?: string }) {
  return (
    <View style={styles.sectionPlaque}>
      <View>
        <PixelText style={styles.sectionKicker}>SHELL STREET DESK</PixelText>
        <PixelText style={styles.sectionTitle}>{title}</PixelText>
        <PixelText style={styles.sectionCopy}>{copy}</PixelText>
      </View>
      {right && <View style={styles.sectionCounter}><PixelText style={styles.sectionCounterText}>{right}</PixelText></View>}
    </View>
  );
}

function DecorCard({ item, desktop }: { item: (typeof decorItems)[number]; desktop: boolean }) {
  const { state, ownedDecor, placedDecor, buyDecor, placeDecor, removeDecor } = useGame();
  const owned = !!ownedDecor[item.id];
  const equipped = placedDecor[item.slot] === item.id;
  const locked = state.level < item.unlockLevel;
  const affordable = state.cash >= item.price;

  return (
    <View style={[styles.decorCard, desktop && styles.decorCardDesktop, equipped && styles.decorEquipped, locked && styles.decorLocked]}>
      <View style={styles.decorInner}>
        <View style={styles.decorPreview}>
          <LinearGradient colors={['#123B49', '#082A34']} style={StyleSheet.absoluteFill} />
          <View style={styles.decorFloor} />
          <DecorThumbnail id={item.id} />
          <View style={styles.slotTag}><PixelText style={styles.slotTagText}>{item.slot.replace('-', ' ').toUpperCase()}</PixelText></View>
          {equipped && <View style={styles.liveBadge}><View style={styles.liveDot}/><PixelText style={styles.liveText}>IN TANK</PixelText></View>}
        </View>
        <PixelText numberOfLines={2} style={styles.decorName}>{item.name.toUpperCase()}</PixelText>
        <PixelText style={styles.decorBuff}>{item.buff ?? 'COSMETIC HQ UPGRADE'}</PixelText>
        <View style={styles.decorSpacer} />

        {locked ? (
          <View style={styles.lockedButton}><Ionicons name="lock-closed" size={12} color={colors.muted}/><PixelText style={styles.lockText}>UNLOCK LV {item.unlockLevel}</PixelText></View>
        ) : owned ? equipped ? (
          <Pressable onPress={() => removeDecor(item.slot)} style={({pressed}) => [styles.decorButton, styles.unplaceButton, pressed && styles.pressed]}><PixelText style={styles.decorButtonText}>UNPLACE</PixelText></Pressable>
        ) : (
          <Pressable onPress={() => placeDecor(item.id)} style={({pressed}) => [styles.decorButton, pressed && styles.pressed]}><PixelText style={styles.decorButtonText}>PLACE</PixelText></Pressable>
        ) : (
          <Pressable disabled={!affordable} onPress={() => buyDecor(item.id)} style={({pressed}) => [styles.decorButton, !affordable && styles.disabled, pressed && affordable && styles.pressed]}><PixelText style={styles.decorButtonText}>BUY ${item.price}</PixelText></Pressable>
        )}
      </View>
    </View>
  );
}

export function MarketScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 980;
  const { state, buyUpgrade, expandTank, placedDecor } = useGame();
  const tankCost = Math.round(75 * Math.pow(1.45, Math.max(0, (state.tankCapacity - 20) / 10)));
  const health = tankHealth(state);
  const usedSlots = Object.keys(placedDecor).length;

  return (
    <LinearGradient colors={['#06131A', '#08222B', '#07161D']} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CapitalHeader cash={state.cash} section="Market" subtitle="Trade · Upgrade · Decorate" />
        <MarketScene />

        <SectionPlaque title="OPERATING EQUIPMENT" copy="CAPEX THAT CHANGES BOTH OUTPUT AND THE TANK ITSELF" right={`${upgrades.length} SYSTEMS`} />
        <View style={styles.equipmentGrid}>
          {upgrades.map(item => {
            const owned = state.upgrades[item.id] ?? 0;
            const cost = upgradeCost(item.baseCost, owned);
            const affordable = state.cash >= cost;
            return (
              <View key={item.id} style={[styles.equipmentCard, desktop && styles.equipmentCardDesktop, affordable && styles.affordable]}>
                <View style={styles.equipmentInner}>
                  <EquipmentPreview id={item.id} level={owned} />
                  <View style={styles.equipmentInfo}>
                    <View style={styles.nameRow}>
                      <PixelText style={styles.name}>{item.name.toUpperCase()}</PixelText>
                      {owned > 0 && <View style={styles.levelBadge}><PixelText style={styles.levelBadgeText}>LV {owned}</PixelText></View>}
                    </View>
                    <PixelText style={styles.detail}>{item.detail}</PixelText>
                    <View style={styles.pips}>{Array.from({length:5},(_,i)=><View key={i} style={[styles.pip,i<Math.min(5,owned)&&styles.pipActive]}/>)}</View>
                  </View>
                  <Pressable disabled={!affordable} onPress={() => buyUpgrade(item.id)} style={({pressed}) => [styles.buy, !affordable && styles.disabled, pressed && affordable && styles.pressed]}>
                    <PixelText style={styles.buyHint}>{owned === 0 ? 'INSTALL' : 'UPGRADE'}</PixelText>
                    <PixelText style={styles.buyText}>${cost.toLocaleString()}</PixelText>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <SectionPlaque title="TANK REAL ESTATE" copy="EXPAND CAPACITY AND REDUCE CROWDING PRESSURE" />
        <View style={[styles.realEstateOuter, state.cash >= tankCost && styles.affordable]}>
          <View style={styles.realEstate}>
            <View style={styles.realEstateIcon}><Ionicons name="business" size={28} color={colors.goldLight}/></View>
            <View style={styles.equipmentInfo}>
              <PixelText style={styles.name}>AQUARIUM EXPANSION</PixelText>
              <PixelText style={styles.detail}>+10 CAPACITY · CURRENT {state.tankCapacity} · OPS HEALTH {health}/100</PixelText>
              <View style={styles.capacityTrack}><View style={[styles.capacityFill,{width:`${Math.min(100,state.tankCapacity/120*100)}%`}]}><View style={styles.capacityShine}/></View></View>
            </View>
            <Pressable disabled={state.cash < tankCost} onPress={expandTank} style={({pressed}) => [styles.buy, state.cash < tankCost && styles.disabled, pressed && state.cash >= tankCost && styles.pressed]}>
              <PixelText style={styles.buyHint}>EXPAND</PixelText>
              <PixelText style={styles.buyText}>${tankCost.toLocaleString()}</PixelText>
            </Pressable>
          </View>
        </View>

        <SectionPlaque title="OFFICE DECOR" copy="CURATE A SMALL UNDERWATER CORPORATE DIORAMA" right={`${usedSlots}/${decorSlots.length} DISPLAYED`} />
        <View style={styles.slotBar}>
          {decorSlots.map(slot => <View key={slot} style={[styles.slotChip, placedDecor[slot] && styles.slotChipFilled]}><PixelText style={styles.slotChipText}>{slot.replace('-', ' ').toUpperCase()}</PixelText></View>)}
        </View>

        {categories.map(category => (
          <View key={category} style={styles.decorGroup}>
            <View style={styles.decorGroupHeader}><PixelText style={styles.decorGroupTitle}>{category.toUpperCase()}</PixelText><View style={styles.decorGroupLine}/></View>
            {desktop ? (
              <View style={styles.decorGrid}>{decorItems.filter(item => item.category === category).map(item => <DecorCard key={item.id} item={item} desktop />)}</View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.decorRow}>{decorItems.filter(item => item.category === category).map(item => <DecorCard key={item.id} item={item} desktop={false} />)}</ScrollView>
            )}
          </View>
        ))}

        <View style={styles.memoOuter}>
          <View style={styles.memo}>
            <PixelText style={styles.memoTag}>DESIGN DESK MEMO</PixelText>
            <PixelText style={styles.memoTitle}>CURATE, DON'T CRAM.</PixelText>
            <PixelText style={styles.memoBody}>Place one strong object per slot. Let equipment anchor the left and right sides, keep the central water column open, and treat every prop like a tiny piece of a Wall Street aquarium diorama.</PixelText>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page:{flex:1},content:{padding:14,paddingBottom:118,gap:13},sceneFrame:{backgroundColor:'#071A22',borderWidth:3,borderColor:colors.brass,padding:4,shadowColor:'#000',shadowOpacity:.5,shadowRadius:0,shadowOffset:{width:4,height:5}},sceneWater:{height:220,borderWidth:1,borderColor:'#4D8590',position:'relative',overflow:'hidden'},sceneCity:{position:'absolute',left:'26%',right:'20%',bottom:45,height:100,flexDirection:'row',alignItems:'flex-end',gap:6,opacity:.22},sceneTower:{width:20,backgroundColor:'#A5D1D333'},scenePlantL:{position:'absolute',left:22,bottom:37,width:25,height:76},scenePlantR:{position:'absolute',right:28,bottom:37,width:25,height:76},plantStem:{position:'absolute',left:10,bottom:0,width:5,height:64,backgroundColor:'#2D805E'},plantLeaf:{position:'absolute',width:17,height:6,backgroundColor:'#4AA775'},desk:{position:'absolute',left:'25%',right:'20%',bottom:37,height:78},deskTop:{height:10,backgroundColor:'#7A4C31',borderWidth:2,borderColor:'#352319'},deskBody:{position:'absolute',left:8,right:8,top:10,bottom:0,backgroundColor:'#593723',borderWidth:2,borderColor:'#2E1C14',flexDirection:'row',gap:8,padding:9},deskDrawer:{flex:1,backgroundColor:'#71482E',borderWidth:1,borderColor:'#2E1C14'},bankLamp:{position:'absolute',left:'37%',bottom:55,width:44,height:65},lampShade:{position:'absolute',top:4,width:40,height:14,backgroundColor:'#258451',borderWidth:2,borderColor:'#12442B'},lampStem:{position:'absolute',left:19,top:18,width:4,height:34,backgroundColor:colors.gold},lampBase:{position:'absolute',left:8,bottom:3,width:28,height:6,backgroundColor:colors.brass},books:{position:'absolute',left:'48%',bottom:50,width:44,height:46},bookA:{position:'absolute',bottom:0,width:42,height:8,backgroundColor:'#8C3F36'},bookB:{position:'absolute',bottom:10,left:6,width:34,height:9,backgroundColor:'#375D81'},bookC:{position:'absolute',bottom:21,left:10,width:30,height:9,backgroundColor:'#A17E39'},globe:{position:'absolute',right:'23%',bottom:47,width:55,height:65},globeBall:{width:44,height:44,borderRadius:22,borderWidth:4,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},globeLineH:{width:34,height:2,backgroundColor:colors.gold},globeLineV:{position:'absolute',width:2,height:34,backgroundColor:colors.gold},globeStand:{width:8,height:19,backgroundColor:colors.brass,alignSelf:'center'},poster:{position:'absolute',right:32,top:20,width:91,height:104,backgroundColor:'#12191E',borderWidth:3,borderColor:colors.brass,alignItems:'center',justifyContent:'center'},posterText:{fontFamily:'PressStart2P',fontSize:7,lineHeight:16,color:colors.goldLight,textAlign:'center'},sceneFloor:{position:'absolute',left:0,right:0,bottom:0,height:37,backgroundColor:'#72513B',borderTopWidth:3,borderTopColor:'#B58C5F'},scenePlaque:{position:'absolute',left:'32%',right:'32%',bottom:9,backgroundColor:'#091C23',borderWidth:2,borderColor:colors.brass,padding:5},scenePlaqueText:{fontSize:6,color:colors.goldLight,textAlign:'center',letterSpacing:1},sectionPlaque:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,padding:11,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'},sectionKicker:{fontSize:5,color:colors.aqua,letterSpacing:1.5},sectionTitle:{fontFamily:'PressStart2P',fontSize:8,color:colors.goldLight,marginTop:5},sectionCopy:{fontSize:7,color:colors.muted,marginTop:5},sectionCounter:{backgroundColor:'#101C20',borderWidth:2,borderColor:colors.brass,paddingHorizontal:8,paddingVertical:6},sectionCounterText:{fontSize:6,color:colors.goldLight},equipmentGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},equipmentCard:{width:'100%',backgroundColor:'#071B23',borderWidth:2,borderColor:'#2F5B66',borderBottomWidth:5,borderBottomColor:'#031218',padding:3},equipmentCardDesktop:{width:'49.5%'},equipmentInner:{backgroundColor:'#0D3541',borderWidth:1,borderColor:'#173F49',padding:8,flexDirection:'row',alignItems:'center',minHeight:112},affordable:{borderColor:colors.brass},previewStage:{width:92,height:86,backgroundColor:'#082833',borderWidth:2,borderColor:'#2E626E',position:'relative',overflow:'hidden'},previewGrid:{position:'absolute',left:8,right:8,top:10,height:1,backgroundColor:'#4D7D8525'},previewFloor:{position:'absolute',left:0,right:0,bottom:0,height:16,backgroundColor:'#765A43',borderTopWidth:3,borderTopColor:'#B78F61'},previewBadge:{position:'absolute',right:4,top:4,backgroundColor:'#071A22',borderWidth:1,borderColor:colors.brass,paddingHorizontal:5,paddingVertical:3},previewBadgeText:{fontSize:5,color:colors.goldLight},equipmentInfo:{flex:1,marginHorizontal:11},nameRow:{flexDirection:'row',alignItems:'center',gap:6},name:{fontFamily:'PressStart2P',fontSize:7,color:colors.cream,flexShrink:1,lineHeight:12},detail:{fontSize:7,lineHeight:11,color:colors.muted,marginTop:6},levelBadge:{backgroundColor:'#123D48',borderWidth:1,borderColor:colors.aqua,paddingHorizontal:5,paddingVertical:3},levelBadgeText:{fontSize:5,color:colors.aqua},pips:{flexDirection:'row',gap:3,marginTop:8},pip:{width:14,height:5,backgroundColor:'#183944',borderWidth:1,borderColor:'#234B55'},pipActive:{backgroundColor:colors.aqua,borderColor:'#A0EEE4'},buy:{minWidth:82,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:5,borderBottomColor:colors.brassDark,paddingVertical:8,paddingHorizontal:8,alignItems:'center'},buyHint:{fontSize:5,color:'#654718'},buyText:{fontFamily:'PressStart2P',fontSize:7,color:colors.ink,marginTop:4},disabled:{opacity:.28,borderBottomWidth:2},pressed:{transform:[{translateY:3}],borderBottomWidth:2},realEstateOuter:{backgroundColor:'#071B23',borderWidth:2,borderColor:'#315A64',padding:3},realEstate:{backgroundColor:'#0D3541',borderWidth:1,borderColor:'#173F49',padding:10,flexDirection:'row',alignItems:'center'},realEstateIcon:{width:76,height:66,backgroundColor:'#091F28',borderWidth:2,borderColor:colors.brass,alignItems:'center',justifyContent:'center'},capacityTrack:{height:10,backgroundColor:'#06161C',borderWidth:2,borderColor:'#2C4D55',overflow:'hidden',marginTop:8},capacityFill:{height:'100%',backgroundColor:colors.coral,position:'relative'},capacityShine:{position:'absolute',left:0,right:0,top:1,height:2,backgroundColor:'#FFFFFF44'},slotBar:{flexDirection:'row',flexWrap:'wrap',gap:5,backgroundColor:'#081E27',borderWidth:2,borderColor:'#284B54',padding:7},slotChip:{paddingHorizontal:7,paddingVertical:6,backgroundColor:'#0C2C36',borderWidth:1,borderColor:'#2A505A'},slotChipFilled:{backgroundColor:'#263F2C',borderColor:colors.gold},slotChipText:{fontSize:5,color:'#D1D9CA'},decorGroup:{marginTop:8},decorGroupHeader:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:7},decorGroupTitle:{fontFamily:'PressStart2P',fontSize:7,color:colors.cream},decorGroupLine:{flex:1,height:2,backgroundColor:colors.brass},decorGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},decorRow:{gap:8,paddingRight:30},decorCard:{width:162,minHeight:205,backgroundColor:'#071B23',borderWidth:2,borderColor:'#2C5964',borderBottomWidth:5,borderBottomColor:'#031218',padding:3},decorCardDesktop:{width:'19.2%',minWidth:165,maxWidth:225},decorEquipped:{borderColor:colors.goldLight},decorLocked:{opacity:.38},decorInner:{flex:1,backgroundColor:'#0D3541',borderWidth:1,borderColor:'#173F49',padding:8},decorPreview:{height:92,backgroundColor:'#082A34',borderWidth:2,borderColor:'#2B5F6A',alignItems:'center',justifyContent:'center',overflow:'hidden'},decorFloor:{position:'absolute',left:5,right:5,bottom:5,height:18,backgroundColor:'#80644A',borderTopWidth:3,borderTopColor:'#B79164'},slotTag:{position:'absolute',left:5,bottom:5,backgroundColor:'#061A22E8',borderWidth:1,borderColor:'#3A616A',paddingHorizontal:4,paddingVertical:3},slotTagText:{fontSize:4,color:colors.aqua},liveBadge:{position:'absolute',right:5,top:5,flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'#0D2D26EE',borderWidth:1,borderColor:'#4D8D6E',paddingHorizontal:5,paddingVertical:4},liveDot:{width:5,height:5,backgroundColor:'#73E79C'},liveText:{fontSize:4,color:'#BCEFD0'},decorName:{fontFamily:'PressStart2P',fontSize:6,lineHeight:11,marginTop:8,minHeight:27,color:colors.cream},decorBuff:{fontSize:6,color:colors.goldLight,marginTop:5},decorSpacer:{flex:1,minHeight:7},decorButton:{backgroundColor:colors.gold,borderWidth:2,borderColor:colors.goldLight,borderBottomWidth:4,borderBottomColor:colors.brassDark,paddingVertical:7,alignItems:'center'},unplaceButton:{backgroundColor:'#56766C',borderColor:'#81A79A',borderBottomColor:'#2D4A41'},decorButtonText:{fontFamily:'PressStart2P',fontSize:5,color:colors.ink},lockedButton:{flexDirection:'row',gap:5,alignItems:'center',justifyContent:'center',height:32,backgroundColor:'#071A22',borderWidth:1,borderColor:'#31454B'},lockText:{fontSize:5,color:colors.muted},memoOuter:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,padding:4},memo:{backgroundColor:'#171C2B',borderWidth:1,borderColor:'#5D5479',padding:16},memoTag:{color:'#A9CFE4',fontSize:6,letterSpacing:1.4},memoTitle:{fontFamily:'PressStart2P',fontSize:8,color:colors.goldLight,marginTop:7},memoBody:{fontSize:8,lineHeight:13,color:'#B8C9CD',marginTop:8},
  pPipe:{position:'absolute',right:13,top:15,width:8,height:31,backgroundColor:'#718C8D',borderWidth:1,borderColor:'#263F44'},pCan:{position:'absolute',left:50,bottom:15,width:24,height:42,backgroundColor:'#42646B',borderWidth:2,borderColor:'#19333A'},pWindow:{margin:4,height:11,backgroundColor:'#C49B4C',borderWidth:1,borderColor:'#293B3E'},pGauge:{position:'absolute',left:19,top:19,width:17,height:17,borderRadius:9,backgroundColor:'#E6DDB9',borderWidth:2,borderColor:'#98743F'},pHeater:{position:'absolute',left:13,top:15,width:10,height:46,backgroundColor:'#F07B49',borderWidth:2,borderColor:'#5A3730'},pConsole:{position:'absolute',left:31,top:16,width:31,height:19,backgroundColor:'#31515A',borderWidth:2,borderColor:'#132A30'},pCopper:{position:'absolute',left:31,top:42,width:38,height:18,borderTopWidth:4,borderRightWidth:4,borderColor:'#A86D42'},pTray:{position:'absolute',left:11,bottom:15,width:54,height:10,backgroundColor:'#77563D'},pAlgae:{position:'absolute',left:16,bottom:24,width:34,height:16,backgroundColor:'#50A659',borderWidth:1,borderColor:'#2C6634'},pHopper:{position:'absolute',right:9,bottom:22,width:14,height:30,backgroundColor:'#69767A',borderWidth:2,borderColor:'#324147'},pPump:{position:'absolute',left:12,bottom:15,width:31,height:23,backgroundColor:'#426771',borderWidth:2,borderColor:'#17323A'},pTube:{position:'absolute',left:26,bottom:36,width:4,height:30,backgroundColor:'#7DB2B6'},pBubble:{position:'absolute',left:31,top:19,width:8,height:8,borderRadius:4,borderWidth:2,borderColor:'#9DE5E4'},pLab:{position:'absolute',left:14,bottom:15,width:35,height:48,backgroundColor:'#385863',borderWidth:2,borderColor:'#17333A',padding:4},pLabGlass:{height:28,backgroundColor:'#75BFC65A',borderWidth:1,borderColor:'#8FDDE0'},pEgg:{width:8,height:11,borderRadius:5,backgroundColor:'#F0E5C4',alignSelf:'center',marginTop:8},pLamp:{position:'absolute',right:12,bottom:25,width:17,height:5,backgroundColor:'#E0C766'},pDesk:{position:'absolute',left:10,bottom:15,width:54,height:14,backgroundColor:'#74513A',borderWidth:1,borderColor:'#3F2A20'},pClipboard:{position:'absolute',left:16,bottom:28,width:18,height:26,backgroundColor:'#EFE3C0',borderWidth:2,borderColor:'#83745A'},pLampSmall:{position:'absolute',right:13,bottom:28,width:3,height:22,backgroundColor:'#C4A44F'},pScreen:{position:'absolute',left:13,top:15,width:54,height:39,backgroundColor:'#071A22',borderWidth:3,borderColor:'#49666D',padding:5},pScreenText:{fontSize:5,color:'#75E997'},pGraph:{position:'absolute',left:8,top:24,width:25,height:2,backgroundColor:'#75E997',transform:[{rotate:'-12deg'}]},pKeyboard:{position:'absolute',left:11,bottom:15,width:58,height:8,backgroundColor:'#536267',borderWidth:1,borderColor:'#28383D'},pLightBar:{position:'absolute',left:11,top:15,width:62,height:8,backgroundColor:'#C5A04F',borderWidth:1,borderColor:'#775B29'},pLightOne:{position:'absolute',left:22,top:23,width:10,height:8,backgroundColor:'#F3DA8A'},pLightTwo:{position:'absolute',right:20,top:23,width:10,height:8,backgroundColor:'#F3DA8A'},pLightCone:{position:'absolute',left:24,top:31,width:36,height:41,backgroundColor:'#FFF2A422'},pGenerator:{position:'absolute',left:15,top:20,width:53,height:38,backgroundColor:'#535C5D',borderWidth:2,borderColor:'#263337'},pGenPanel:{margin:5,width:31,height:17,backgroundColor:'#2D393C'},pStatus:{position:'absolute',right:6,top:6,width:6,height:6,backgroundColor:'#76EF8E'},pVent:{position:'absolute',left:7,right:7,bottom:5,height:3,borderTopWidth:2,borderBottomWidth:2,borderColor:'#899596'},pShowcase:{position:'absolute',left:24,top:11,width:41,height:44,backgroundColor:'#9DEAE91A',borderWidth:3,borderColor:'#D4AF58'},pPedestal:{position:'absolute',left:31,bottom:15,width:27,height:13,backgroundColor:'#6B5136',borderWidth:1,borderColor:'#A68550'},pRopeL:{position:'absolute',left:18,bottom:15,width:3,height:20,backgroundColor:colors.gold},pRopeR:{position:'absolute',right:17,bottom:15,width:3,height:20,backgroundColor:colors.gold},pArm:{position:'absolute',right:20,top:12,width:7,height:41,backgroundColor:'#788D91',transform:[{rotate:'23deg'}]},pJoint:{position:'absolute',right:31,top:41,width:13,height:13,borderRadius:7,backgroundColor:'#C59A49'},pNet:{position:'absolute',right:33,bottom:14,width:29,height:20,borderWidth:2,borderColor:'#AAC4C3'}
});
