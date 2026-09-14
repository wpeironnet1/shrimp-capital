import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { GameState, lineageMultiplier, valueMultiplier } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelShrimp, ShrimpAccessory } from './PixelShrimp';
import { PixelText } from './PixelText';

type Filter = 'ALL' | 'OWNED' | 'LEGENDS';
type Sort = 'LEVEL' | 'VALUE' | 'QUANTITY' | 'RARITY';
const legendIds = new Set(['jumbo','lehman-bro','craymer','shellfort','big-shrimp']);
const rarityRank: Record<ShrimpSpecies['rarity'], number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4, Mythic: 5, Exotic: 6 };

function accessoryFor(state: GameState, id: string): ShrimpAccessory | undefined {
  const acc = state.shrimpAccessories[id] ?? { chain: 0, crown: 0, visor: 0, suit: 0 };
  return acc.suit > 0 ? 'suit' : acc.visor > 0 ? 'visor' : acc.crown > 0 ? 'crown' : acc.chain > 0 ? 'chain' : undefined;
}

export function StockBrowser({ state, selectedId, onSelect, onInspect }: { state: GameState; selectedId: string; onSelect: (id: string) => void; onInspect: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 960;
  const [filter, setFilter] = useState<Filter>('ALL');
  const [sort, setSort] = useState<Sort>('LEVEL');

  const unlockedSpecies = useMemo(() => species.filter((item) => item.unlockLevel <= state.level), [state.level]);
  const hiddenCount = species.length - unlockedSpecies.length;

  const items = useMemo(() => {
    const filtered = unlockedSpecies.filter((item) => {
      if (filter === 'OWNED') return (state.shrimp[item.id] ?? 0) > 0;
      if (filter === 'LEGENDS') return legendIds.has(item.id);
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === 'VALUE') return b.basePrice - a.basePrice;
      if (sort === 'QUANTITY') return (state.shrimp[b.id] ?? 0) - (state.shrimp[a.id] ?? 0);
      if (sort === 'RARITY') return rarityRank[b.rarity] - rarityRank[a.rarity] || a.unlockLevel - b.unlockLevel;
      return a.unlockLevel - b.unlockLevel;
    });
  }, [filter, sort, state.shrimp, unlockedSpecies]);

  const card = (item: ShrimpSpecies) => {
    const selected = item.id === selectedId;
    const owned = state.shrimp[item.id] ?? 0;
    const accessory = accessoryFor(state, item.id);
    const lineage = state.lineage[item.id] ?? 0;
    const baseSize = 38 + (item.rarity === 'Exotic' ? 8 : item.rarity === 'Mythic' ? 6 : item.rarity === 'Legendary' ? 4 : 0);
    const cardSize = Math.min(67, Math.round(baseSize * (item.displayScale ?? 1)));
    return <Pressable key={item.id} onPress={() => onSelect(item.id)} onLongPress={() => onInspect(item.id)} delayLongPress={300} style={({ pressed }) => [styles.card, desktop && styles.cardDesktop, selected && styles.selected, pressed && styles.pressed]}>
      <View style={styles.cardTop}>
        <View style={styles.spriteStage}><PixelShrimp color={item.color} accentColor={item.accentColor} pattern={item.pattern} trait={item.trait} accessory={accessory} size={cardSize} /></View>
        <View style={styles.quantityPill}><PixelText style={styles.quantityText}>{owned}×</PixelText></View>
      </View>
      <PixelText numberOfLines={2} style={styles.name}>{item.name}</PixelText>
      <View style={styles.metaRow}><PixelText style={styles.rarity}>{item.rarity.toUpperCase()}</PixelText><PixelText style={styles.level}>LV {item.unlockLevel}</PixelText></View>
      <PixelText style={styles.value}>${Math.round(item.basePrice * valueMultiplier(state, item.id)).toLocaleString()} ea.</PixelText>
      {lineage > 0 && <PixelText style={styles.lineage}>LINE {lineage} · +{Math.round((lineageMultiplier(state,item.id)-1)*100)}%</PixelText>}
      {accessory && <PixelText style={styles.accessory}>{accessory === 'visor' ? 'GREEN VISOR' : accessory === 'suit' ? 'SUIT & TIE' : accessory.toUpperCase()}</PixelText>}
    </Pressable>;
  };

  return <View style={styles.wrap}>
    <View style={styles.headerRow}>
      <View><PixelText style={styles.title}>CURRENT STOCK</PixelText><PixelText style={styles.sub}>TAP TO SELECT · HOLD TO INSPECT · FUTURE CLASSES STAY HIDDEN</PixelText></View>
      <View style={styles.countStack}><PixelText style={styles.count}>{items.length} SHOWN</PixelText>{hiddenCount > 0 && <PixelText style={styles.hiddenCount}>{hiddenCount} CLASSIFIED</PixelText>}</View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
      {(['ALL','OWNED','LEGENDS'] as Filter[]).map((value) => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filter, filter === value && styles.filterActive]}><PixelText style={[styles.filterText, filter === value && styles.filterTextActive]}>{value}</PixelText></Pressable>)}
      <View style={styles.filterDivider}/>
      {(['LEVEL','VALUE','QUANTITY','RARITY'] as Sort[]).map((value) => <Pressable key={value} onPress={() => setSort(value)} style={[styles.sort, sort === value && styles.sortActive]}><PixelText style={styles.sortText}>{value}</PixelText></Pressable>)}
    </ScrollView>
    {desktop ? <View style={styles.grid}>{items.map(card)}</View> : <View><ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator contentContainerStyle={styles.row}>{items.map(card)}<View style={styles.endSpacer}/></ScrollView>{items.length > 2 && <View pointerEvents="none" style={styles.scrollCue}><PixelText style={styles.scrollCueText}>MORE →</PixelText></View>}</View>}
  </View>;
}

const styles = StyleSheet.create({
  wrap:{gap:12},headerRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:10},title:{fontSize:16,letterSpacing:1.6},sub:{color:colors.muted,fontSize:6,marginTop:4},countStack:{alignItems:'flex-end'},count:{fontSize:7,color:colors.aqua},hiddenCount:{fontSize:5,color:'#6F8C91',marginTop:3},filters:{gap:6,paddingRight:18},filter:{paddingVertical:8,paddingHorizontal:11,borderRadius:8,backgroundColor:'#0B2D36',borderWidth:1,borderColor:'#24515C'},filterActive:{backgroundColor:'#214D58',borderColor:colors.aqua},filterText:{fontSize:6,color:colors.muted},filterTextActive:{color:colors.cream},filterDivider:{width:1,backgroundColor:'#2B5560',marginHorizontal:3},sort:{paddingVertical:8,paddingHorizontal:9,borderRadius:8,backgroundColor:'#112E36'},sortActive:{backgroundColor:'#453B27',borderWidth:1,borderColor:colors.gold},sortText:{fontSize:6,color:'#D9CFB5'},grid:{flexDirection:'row',flexWrap:'wrap',gap:11},row:{gap:10,paddingRight:70},card:{width:148,minHeight:158,padding:12,borderRadius:15,backgroundColor:'#123B47',borderWidth:2,borderBottomWidth:5,borderColor:'#285F6B',borderBottomColor:'#071F27',shadowColor:'#000',shadowOpacity:.18,shadowRadius:8,shadowOffset:{width:0,height:4}},cardDesktop:{width:'23.5%',minWidth:170,maxWidth:250},selected:{borderColor:colors.coral,backgroundColor:'#174B57'},pressed:{transform:[{translateY:2}],borderBottomWidth:2},cardTop:{height:56,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},spriteStage:{height:55,minWidth:78,justifyContent:'center'},quantityPill:{backgroundColor:'#092B35',borderRadius:9,paddingHorizontal:7,paddingVertical:4,borderWidth:1,borderColor:'#315E68'},quantityText:{fontSize:6,color:colors.aqua},name:{fontSize:9,lineHeight:13,minHeight:25,marginTop:6},metaRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:4},rarity:{fontSize:6,color:colors.aqua},level:{fontSize:5,color:colors.muted},value:{fontSize:7,color:colors.gold,marginTop:6},lineage:{fontSize:5,color:'#8CE5A6',marginTop:5},accessory:{fontSize:5,color:'#B9EDC7',marginTop:4},endSpacer:{width:12},scrollCue:{position:'absolute',right:0,top:0,bottom:0,width:54,justifyContent:'center',alignItems:'center',backgroundColor:'#08242BDD',borderLeftWidth:1,borderLeftColor:'#1D4A54'},scrollCueText:{fontSize:5,color:colors.aqua,transform:[{rotate:'90deg'}]},
});
