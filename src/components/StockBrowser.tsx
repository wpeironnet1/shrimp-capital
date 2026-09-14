import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { GameState, lineageMultiplier, valueMultiplier } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelShrimp, ShrimpAccessory } from './PixelShrimp';
import { PixelText } from './PixelText';

type Filter='OWNED'|'UNLOCKED'|'LEGENDS';
type Sort='LEVEL'|'VALUE'|'QUANTITY'|'RARITY';
const legendIds=new Set(['jumbo','lehman-bro','craymer','shellfort','big-shrimp']);
const rarityRank:Record<ShrimpSpecies['rarity'],number>={Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Mythic:5,Exotic:6};
const rarityColor:Record<ShrimpSpecies['rarity'],string>={Common:'#90B9B8',Uncommon:'#72D694',Rare:'#5CA6E6',Epic:'#A67AE0',Legendary:'#E2B64F',Mythic:'#E477A9',Exotic:'#F08B4D'};

function accessoryFor(state:GameState,id:string):ShrimpAccessory|undefined{const acc=state.shrimpAccessories[id]??{chain:0,crown:0,visor:0,suit:0};return acc.suit>0?'suit':acc.visor>0?'visor':acc.crown>0?'crown':acc.chain>0?'chain':undefined;}

export function StockBrowser({state,selectedId,onSelect,onInspect}:{state:GameState;selectedId:string;onSelect:(id:string)=>void;onInspect:(id:string)=>void}){
  const {width}=useWindowDimensions();
  const desktop=width>=960;
  const mobile=width<700;
  const tiny=width<390;
  const [filter,setFilter]=useState<Filter>('UNLOCKED');
  const [sort,setSort]=useState<Sort>('LEVEL');
  const unlockedSpecies=useMemo(()=>species.filter(item=>item.unlockLevel<=state.level),[state.level]);
  const items=useMemo(()=>{
    const filtered=unlockedSpecies.filter(item=>filter==='OWNED'?(state.shrimp[item.id]??0)>0:filter==='LEGENDS'?legendIds.has(item.id):true);
    return [...filtered].sort((a,b)=>sort==='VALUE'?b.basePrice-a.basePrice:sort==='QUANTITY'?(state.shrimp[b.id]??0)-(state.shrimp[a.id]??0):sort==='RARITY'?rarityRank[b.rarity]-rarityRank[a.rarity]||a.unlockLevel-b.unlockLevel:a.unlockLevel-b.unlockLevel);
  },[filter,sort,state.shrimp,unlockedSpecies]);
  const hiddenCount=Math.max(0,species.length-unlockedSpecies.length);

  const card=(item:ShrimpSpecies)=>{
    const selected=item.id===selectedId;
    const owned=state.shrimp[item.id]??0;
    const accessory=accessoryFor(state,item.id);
    const lineage=state.lineage[item.id]??0;
    const baseSize=39+(item.rarity==='Exotic'?9:item.rarity==='Mythic'?7:item.rarity==='Legendary'?5:0);
    const cardSize=Math.min(72,Math.round(baseSize*(item.displayScale??1)));
    const currentValue=Math.round(item.basePrice*valueMultiplier(state,item.id));
    return <Pressable
      key={item.id}
      accessibilityRole="button"
      accessibilityState={{selected}}
      accessibilityLabel={`${item.name}, ${item.rarity}, ${owned} owned, worth ${currentValue} dollars each. Tap to select or use inspect for details.`}
      onPress={()=>onSelect(item.id)}
      onLongPress={()=>onInspect(item.id)}
      delayLongPress={280}
      style={({pressed})=>[styles.card,desktop&&styles.cardDesktop,mobile&&styles.cardMobile,tiny&&styles.cardTiny,selected&&styles.selected,pressed&&styles.pressed]}
    >
      <View style={styles.cardInner}>
        <View style={[styles.rarityRail,{backgroundColor:rarityColor[item.rarity]}]}/>
        <View style={[styles.cardTop,mobile&&styles.cardTopMobile]}>
          <View style={[styles.spriteFrame,mobile&&styles.spriteFrameMobile,tiny&&styles.spriteFrameTiny]}><View style={styles.spriteWater}/><PixelShrimp color={item.color} accentColor={item.accentColor} pattern={item.pattern} trait={item.trait} accessory={accessory} size={cardSize}/></View>
          <View style={styles.quantityPill}><PixelText style={styles.quantityText}>{owned}×</PixelText></View>
        </View>
        <PixelText numberOfLines={2} style={[styles.name,mobile&&styles.nameMobile]}>{item.name.toUpperCase()}</PixelText>
        <View style={styles.metaRow}><PixelText style={[styles.rarity,{color:rarityColor[item.rarity]}]}>{item.rarity.toUpperCase()}</PixelText><PixelText style={styles.level}>LV {item.unlockLevel}</PixelText></View>
        <View style={styles.valueRow}><PixelText style={[styles.value,mobile&&styles.valueMobile]}>${currentValue.toLocaleString()}</PixelText><PixelText style={styles.per}>EA.</PixelText></View>
        {lineage>0&&<PixelText style={styles.lineage}>LINE {lineage} · +{Math.round((lineageMultiplier(state,item.id)-1)*100)}%</PixelText>}
        {accessory&&<PixelText style={styles.accessory}>{accessory==='visor'?'GREEN VISOR':accessory==='suit'?'SUIT & TIE':accessory.toUpperCase()}</PixelText>}
        <View style={styles.cardSpacer}/>
        <View style={[styles.cardActions,mobile&&styles.cardActionsMobile]}>
          <View style={[styles.selectState,selected&&styles.selectStateActive]}><PixelText style={[styles.selectStateText,selected&&styles.selectStateTextActive]}>{selected?'ACTIVE':'TAP TO SELECT'}</PixelText></View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Inspect ${item.name}`} onPress={()=>onInspect(item.id)} style={({pressed})=>[styles.inspectButton,pressed&&styles.inspectPressed]}><PixelText style={styles.inspectText}>INSPECT</PixelText></Pressable>
        </View>
      </View>
    </Pressable>;
  };

  return <View style={styles.shell}>
    <View style={[styles.headerBand,mobile&&styles.headerBandMobile,tiny&&styles.headerBandTiny]}>
      <View style={styles.headerCopy}><PixelText style={styles.eyebrow}>PORTFOLIO DESK</PixelText><PixelText style={[styles.title,mobile&&styles.titleMobile]}>CURRENT STOCK</PixelText><PixelText style={styles.sub}>TAP TO SELECT · INSPECT FOR DETAILS</PixelText></View>
      <View style={[styles.discovery,tiny&&styles.discoveryTiny]}><PixelText style={styles.discoveryValue}>{unlockedSpecies.length}/{species.length}</PixelText><PixelText style={styles.discoveryLabel}>DISCOVERED</PixelText></View>
    </View>

    <View style={styles.controlArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.controlScroll}>
        <View style={styles.controlGroup}><PixelText style={styles.controlLabel}>SHOW</PixelText><View style={styles.controlWrap}>{(['OWNED','UNLOCKED','LEGENDS'] as Filter[]).map(value=><Pressable accessibilityRole="button" accessibilityState={{selected:filter===value}} key={value} onPress={()=>setFilter(value)} style={[styles.filter,filter===value&&styles.filterActive]}><PixelText style={[styles.filterText,filter===value&&styles.filterTextActive]}>{value}</PixelText></Pressable>)}</View></View>
        <View style={styles.controlDivider}/>
        <View style={styles.controlGroup}><PixelText style={styles.controlLabel}>SORT</PixelText><View style={styles.controlWrap}>{(['LEVEL','VALUE','QUANTITY','RARITY'] as Sort[]).map(value=><Pressable accessibilityRole="button" accessibilityState={{selected:sort===value}} key={value} onPress={()=>setSort(value)} style={[styles.sort,sort===value&&styles.sortActive]}><PixelText style={[styles.sortText,sort===value&&styles.sortTextActive]}>{value}</PixelText></Pressable>)}</View></View>
        {hiddenCount>0&&<View style={styles.classified}><PixelText style={styles.classifiedText}>{hiddenCount} CLASSIFIED</PixelText></View>}
      </ScrollView>
    </View>

    <View style={styles.contentArea}>
      {mobile||desktop?<View style={[styles.grid,mobile&&styles.gridMobile]}>{items.map(card)}</View>:<ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{items.map(card)}<View style={styles.endSpacer}/></ScrollView>}
    </View>
  </View>;
}

const styles=StyleSheet.create({
  shell:{backgroundColor:'#071B23',borderWidth:2,borderColor:colors.brass,padding:4,shadowColor:'#000',shadowOpacity:.4,shadowRadius:0,shadowOffset:{width:3,height:4}},
  headerBand:{backgroundColor:'#0B2A34',borderWidth:1,borderColor:'#315965',borderBottomWidth:2,borderBottomColor:colors.brass,padding:12,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:12},headerBandMobile:{alignItems:'center',padding:10},headerBandTiny:{alignItems:'stretch',flexDirection:'column',gap:8},headerCopy:{flex:1,minWidth:0},
  eyebrow:{fontSize:8,color:colors.aqua,letterSpacing:1.1},title:{fontFamily:'PressStart2P',fontSize:10,marginTop:5,color:colors.cream},titleMobile:{fontSize:9,lineHeight:14},sub:{fontSize:9,color:'#B6C9CC',marginTop:6,lineHeight:13},
  discovery:{alignItems:'flex-end',minWidth:72},discoveryTiny:{alignItems:'flex-start',minWidth:0},discoveryValue:{fontFamily:'PressStart2P',fontSize:10,color:colors.goldLight},discoveryLabel:{fontSize:8,color:'#B6C9CC',marginTop:3},
  controlArea:{backgroundColor:'#081F28',borderBottomWidth:1,borderBottomColor:'#173E48'},controlScroll:{alignItems:'center',gap:9,padding:9,paddingRight:20},controlGroup:{gap:5},controlLabel:{fontSize:8,color:'#B6C9CC',letterSpacing:1},controlWrap:{flexDirection:'row',gap:5},controlDivider:{width:2,height:34,backgroundColor:colors.brass,opacity:.75,alignSelf:'flex-end',marginBottom:1},
  filter:{minHeight:38,paddingVertical:8,paddingHorizontal:11,backgroundColor:'#0D313B',borderWidth:2,borderColor:'#3A6671',justifyContent:'center'},filterActive:{backgroundColor:'#1A5560',borderColor:colors.gold},filterText:{fontSize:8,color:'#C1D0D2'},filterTextActive:{color:colors.goldLight},
  sort:{minHeight:38,paddingVertical:8,paddingHorizontal:10,backgroundColor:'#102B34',borderWidth:1,borderColor:'#3A5961',justifyContent:'center'},sortActive:{backgroundColor:'#3A3120',borderWidth:2,borderColor:colors.gold},sortText:{fontSize:8,color:'#D9CFB5'},sortTextActive:{color:colors.goldLight},
  classified:{alignSelf:'flex-end',paddingVertical:8,paddingHorizontal:10,backgroundColor:'#171C25',borderWidth:1,borderColor:'#414553'},classifiedText:{fontSize:8,color:'#AEB7C2'},
  contentArea:{backgroundColor:'#0A2630',padding:9,borderTopWidth:1,borderTopColor:'#173E48'},grid:{flexDirection:'row',flexWrap:'wrap',gap:9},gridMobile:{justifyContent:'space-between',gap:8},row:{gap:10,paddingRight:30},
  card:{width:164,minHeight:228,backgroundColor:'#0D3541',borderWidth:2,borderColor:'#315D68',borderBottomWidth:5,borderBottomColor:'#041319',padding:3},cardDesktop:{width:'23.8%',minWidth:185,maxWidth:255},cardMobile:{width:'48.7%',minHeight:250},cardTiny:{width:'100%',minHeight:224},selected:{borderColor:colors.goldLight,backgroundColor:'#123F49'},pressed:{transform:[{translateY:2}],borderBottomWidth:3},
  cardInner:{flex:1,borderWidth:1,borderColor:'#214B55',padding:9,position:'relative'},rarityRail:{position:'absolute',left:0,top:0,bottom:0,width:4},cardTop:{height:70,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},cardTopMobile:{height:76},spriteFrame:{width:96,height:64,backgroundColor:'#08242D',borderWidth:2,borderColor:'#397784',justifyContent:'center',alignItems:'center',overflow:'hidden'},spriteFrameMobile:{width:'72%',maxWidth:104,height:68},spriteFrameTiny:{width:112},spriteWater:{position:'absolute',left:0,right:0,bottom:0,height:18,backgroundColor:'#0C425166',borderTopWidth:1,borderTopColor:'#4FABB7'},quantityPill:{backgroundColor:'#061A22',borderWidth:1,borderColor:colors.brass,paddingHorizontal:6,paddingVertical:6},quantityText:{fontSize:9,color:colors.aqua},
  name:{fontFamily:'PressStart2P',fontSize:8,lineHeight:13,minHeight:28,marginTop:9,color:colors.cream},nameMobile:{fontSize:8,lineHeight:13},metaRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:7,gap:6},rarity:{fontSize:9,flexShrink:1},level:{fontSize:9,color:'#BBC7CA'},valueRow:{flexDirection:'row',alignItems:'baseline',gap:5,marginTop:8},value:{fontFamily:'PressStart2P',fontSize:9,color:colors.goldLight},valueMobile:{fontSize:9},per:{fontSize:8,color:'#BBC7CA'},lineage:{fontSize:8,color:'#9CE7AE',marginTop:6},accessory:{fontSize:8,color:'#D0F0D5',marginTop:5},cardSpacer:{flex:1,minHeight:8},
  cardActions:{flexDirection:'row',alignItems:'stretch',gap:6,marginTop:8},cardActionsMobile:{flexDirection:'column'},selectState:{flex:1,minHeight:38,borderWidth:1,borderColor:'#38606A',backgroundColor:'#09252E',paddingHorizontal:7,paddingVertical:7,alignItems:'center',justifyContent:'center'},selectStateActive:{backgroundColor:'#244A31',borderColor:'#79B98A'},selectStateText:{fontSize:7,color:'#AFC1C4',textAlign:'center'},selectStateTextActive:{color:'#BFF1C8'},inspectButton:{minHeight:38,minWidth:74,backgroundColor:'#173F49',borderWidth:2,borderColor:'#6FB5B7',borderBottomWidth:4,borderBottomColor:'#0A2C34',paddingHorizontal:9,paddingVertical:7,alignItems:'center',justifyContent:'center'},inspectPressed:{transform:[{translateY:2}],borderBottomWidth:2},inspectText:{fontFamily:'PressStart2P',fontSize:6,color:'#D7FFFF'},
  endSpacer:{width:14},
});
