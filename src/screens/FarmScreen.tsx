import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { DailyRewardCard } from '../components/DailyRewardCard';
import { MissionPanel } from '../components/MissionPanel';
import { OfflineReport } from '../components/OfflineReport';
import { PixelShrimp } from '../components/PixelShrimp';
import { PixelText } from '../components/PixelText';
import { StockBrowser } from '../components/StockBrowser';
import { Tank } from '../components/Tank';
import { TankConditionPanel } from '../components/TankConditionPanel';
import { species } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { conditionMultiplier, currentBiome, lineageLabel, lineageMultiplier, saleXpFor, secondsUntilNextHatch, tankHealth, totalShrimp, valueMultiplier, xpForNextLevel } from '../game/engine';
import { colors } from '../theme/colors';

type AmbientEvent = 'inspection' | 'power' | 'visitor' | 'treasure' | null;

export function FarmScreen() {
  const { state, hatchNow, sellOne, selectSpecies, offlineHatches, dismissOfflineReport, claimMission, claimDailyReward, feed, service, placedDecor } = useGame();
  const [feedingFrenzy, setFeedingFrenzy] = useState(false);
  const [ambientEvent, setAmbientEvent] = useState<AmbientEvent>(null);
  const [inspectId, setInspectId] = useState<string | null>(null);
  const current = species.find((item) => item.id === state.selectedSpecies) ?? species[0];
  const inspected = species.find((item) => item.id === inspectId) ?? null;
  const tankFull = totalShrimp(state) >= state.tankCapacity;
  const nextHatch = secondsUntilNextHatch(state);
  const health = tankHealth(state);
  const conditionRate = Math.round(conditionMultiplier(state) * 100);
  const salePrice = Math.round(current.basePrice * valueMultiplier(state, current.id));
  const tintOpacity = Math.max(0, (78 - state.conditions.waterQuality) / 145);
  const tintColor = state.conditions.waterQuality < 45 ? '#6D6830' : '#557C55';
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  const biome = currentBiome(state);
  const totalLineage = Object.values(state.lineage).reduce((sum, value) => sum + value, 0);
  const selectedLineage = state.lineage[current.id] ?? 0;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        const events: AmbientEvent[] = ['inspection', 'power', 'visitor', 'treasure'];
        setAmbientEvent(events[Math.floor(Math.random() * events.length)]);
        setTimeout(() => setAmbientEvent(null), 4200);
        schedule();
      }, 18000 + Math.random() * 26000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const handleFeed = () => {
    if (state.cash < 2 || state.conditions.feeding >= 98) return;
    feed();
    setFeedingFrenzy(true);
    setTimeout(() => setFeedingFrenzy(false), 1800);
  };

  const inspectedAccessories = inspected ? state.shrimpAccessories[inspected.id] ?? { chain: 0, crown: 0, visor: 0, suit: 0 } : null;
  const inspectAccessory = inspectedAccessories?.suit ? 'suit' : inspectedAccessories?.visor ? 'visor' : inspectedAccessories?.crown ? 'crown' : inspectedAccessories?.chain ? 'chain' : undefined;
  const inspectSeed = inspected ? inspected.id.length * 17 + (state.shrimp[inspected.id] ?? 0) * 3 + state.level : 0;

  return <LinearGradient colors={[colors.ink, colors.deep]} style={styles.page}>
    <OfflineReport amount={offlineHatches} onClose={dismissOfflineReport} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><PixelText style={styles.eyebrow}>SHRIMP CAPITAL</PixelText><PixelText style={styles.title}>The Bedroom Fund</PixelText></View><View style={styles.money}><PixelText style={styles.moneyText}>${state.cash.toLocaleString()}</PixelText><PixelText style={styles.moneyHint}>LIQUID ASSETS</PixelText></View></View>
      <View style={styles.levelRow}><PixelText style={styles.level}>LV. {state.level}</PixelText><View style={styles.xpTrack}><View style={[styles.xpFill,{width:`${Math.min(100,state.xp/xpForNextLevel(state.level)*100)}%`}]} /></View><PixelText style={styles.xp}>{state.xp} / {xpForNextLevel(state.level)} XP</PixelText></View>
      <MissionPanel state={state} onClaim={claimMission} /><DailyRewardCard state={state} onClaim={claimDailyReward} />

      <View style={styles.tankWrap}>
        <Tank population={state.shrimp} accessoryPopulation={state.shrimpAccessories} capacity={state.tankCapacity} upgrades={state.upgrades} placedDecor={placedDecor} onPress={hatchNow} />
        <View pointerEvents="none" style={styles.overlayClip}>
          {isNight && <View style={[StyleSheet.absoluteFillObject,styles.nightTint]} />}
          {tintOpacity > 0 && <View style={[StyleSheet.absoluteFillObject,{backgroundColor:tintColor,opacity:tintOpacity}]} />}
          {state.conditions.waterQuality < 62 && <><View style={[styles.grime,{left:'15%',top:'35%'}]}/><View style={[styles.grime,{right:'18%',top:'58%',width:10}]}/></>}
        </View>
        {biome !== 'starter-office' && <View pointerEvents="none" style={styles.ticker}><PixelText style={styles.tickerText}>{biome === 'trading-floor' ? 'SHMP ▲ 4.2   KRLL ▼ 1.1   ALGA ▲ 8.7' : biome === 'executive-reef' ? 'EXECUTIVE REEF · PRIVATE CLIENT GROUP' : 'OFFSHORE FUND · CAYMAN TANK DESK'}</PixelText></View>}
        {state.ipoCount > 0 && <View pointerEvents="none" style={styles.ipoFixture}><View style={styles.ipoBell}><View style={styles.ipoBellDome}/><View style={styles.ipoBellBase}/></View><View><PixelText style={styles.ipoFixtureTitle}>PUBLIC CO. ×{state.ipoCount}</PixelText><PixelText style={styles.ipoFixtureSub}>{state.prestigeShares} FOUNDER SHARES</PixelText></View></View>}
        {totalLineage > 0 && <View pointerEvents="none" style={styles.lineageFixture}><View style={styles.dna}><View style={styles.dnaBarA}/><View style={styles.dnaBarB}/><View style={styles.dnaBarC}/></View><View><PixelText style={styles.lineageFixtureTitle}>GENETICS DESK</PixelText><PixelText style={styles.lineageFixtureSub}>{selectedLineage} pts · {lineageLabel(selectedLineage)}</PixelText></View></View>}
        {feedingFrenzy&&<View pointerEvents="none" style={styles.overlayClip}><PixelText style={styles.frenzyText}>FEEDING FRENZY!</PixelText>{[22,37,51,66,78].map((left,i)=><View key={left} style={[styles.foodPellet,{left:`${left}%` as `${number}%`,top:12+(i%3)*6}]}/>)}</View>}
        {ambientEvent==='power'&&<View pointerEvents="none" style={[styles.overlayClip,styles.powerFailure]}><PixelText style={styles.eventHeadline}>⚠ POWER FAILURE</PixelText><PixelText style={styles.eventSub}>Emergency generator is negotiating terms.</PixelText></View>}
        {ambientEvent==='inspection'&&<View pointerEvents="none" style={styles.inspectionEvent}><Ionicons name="clipboard" size={17} color={colors.cream}/><View><PixelText style={styles.eventHeadline}>SURPRISE INSPECTION</PixelText><PixelText style={styles.eventSub}>Act natural. Hide the offshore algae.</PixelText></View></View>}
        {ambientEvent==='visitor'&&<View pointerEvents="none" style={styles.visitor}><PixelText style={styles.visitorText}>WHALE ANALYST VISITING</PixelText></View>}
        {ambientEvent==='treasure'&&<View pointerEvents="none" style={styles.treasure}><View style={styles.treasureLid}/><View style={styles.treasureBox}/><PixelText style={styles.treasureLabel}>UNEXPLAINED ASSETS</PixelText></View>}
        <View pointerEvents="none" style={styles.timeBadge}><Ionicons name={isNight?'moon':'sunny'} size={10} color={isNight?'#B9C8FF':colors.gold}/><PixelText style={styles.timeText}>{isNight?'NIGHT DESK':'DAY SESSION'}</PixelText></View>
      </View>

      <View style={styles.productionBar}><View style={[styles.liveDot,health<65&&styles.liveDotDanger]}/><PixelText style={styles.productionLabel}>{tankFull?'TANK FULL — SELL OR EXPAND':`AUTO-HATCH IN ${nextHatch}s`}</PixelText><PixelText style={[styles.productionRate,conditionRate<80&&styles.productionRateDanger]}>OPS {conditionRate}%</PixelText></View>
      {(selectedLineage > 0 || state.ipoCount > 0) && <View style={styles.permanentBonusBar}><PixelText style={styles.permanentBonusText}>{selectedLineage > 0 ? `${lineageLabel(selectedLineage)} · +${Math.round((lineageMultiplier(state,current.id)-1)*100)}% ${current.name} value` : 'NO LINEAGE YET'}</PixelText><PixelText style={styles.permanentBonusText}>{state.ipoCount > 0 ? `PUBLIC COMPANY · ${state.prestigeShares} founder shares` : ''}</PixelText></View>}
      <TankConditionPanel state={state} onFeed={handleFeed} onService={service}/>

      <StockBrowser state={state} selectedId={state.selectedSpecies} onSelect={selectSpecies} onInspect={setInspectId}/>

      {inspected&&<View style={styles.inspector}><Pressable onPress={()=>setInspectId(null)} style={styles.inspectClose}><Ionicons name="close" size={15} color={colors.ink}/></Pressable><PixelShrimp color={inspected.color} accentColor={inspected.accentColor} pattern={inspected.pattern} trait={inspected.trait} accessory={inspectAccessory} size={Math.min(95,Math.round(68*(inspected.displayScale??1)))}/><View style={styles.inspectInfo}><PixelText style={styles.inspectKicker}>PERSONNEL FILE</PixelText><PixelText style={styles.inspectName}>{inspected.name}</PixelText><PixelText style={styles.inspectLine}>{inspected.rarity} · Age {1+inspectSeed%41} days · {(state.mutations[inspected.id]??0)} mutations · Lineage {state.lineage[inspected.id]??0}</PixelText><PixelText style={styles.inspectLine}>Desk: {['Audit','Equities','M&A','Fixed Income'][inspectSeed%4]} · Lifetime P&L ${(inspected.basePrice*(2+inspectSeed%7)).toLocaleString()}</PixelText>{inspected.legend&&<PixelText style={styles.inspectLegend}>{inspected.legend}</PixelText>}</View></View>}
      <View style={styles.sellCard}><View><PixelText style={styles.sellTitle}>Sell one {current.name}</PixelText><PixelText style={styles.sellDetail}>{state.shrimp[current.id]??0} ready · +{saleXpFor(current.id)} XP per sale</PixelText></View><Pressable disabled={(state.shrimp[current.id]??0)<1} onPress={()=>sellOne(current.id)} style={({pressed})=>[styles.sellButton,(state.shrimp[current.id]??0)<1&&styles.sellDisabled,pressed&&styles.sellPressed]}><Ionicons name="cash" size={18} color={colors.ink}/><PixelText style={styles.sellButtonText}>SELL ${salePrice.toLocaleString()}</PixelText></Pressable></View>
    </ScrollView>
  </LinearGradient>;
}

const styles=StyleSheet.create({
  page:{flex:1},content:{padding:18,paddingBottom:115,gap:16},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:4},eyebrow:{fontSize:11,color:colors.coral,letterSpacing:2.4},title:{fontSize:24,marginTop:3},money:{alignItems:'flex-end',backgroundColor:'#0C313C',borderRadius:12,paddingVertical:9,paddingHorizontal:12,borderWidth:1,borderColor:'#28515C'},moneyText:{color:colors.gold,fontSize:18},moneyHint:{color:colors.muted,fontSize:7,marginTop:2},levelRow:{flexDirection:'row',alignItems:'center',gap:8},level:{color:colors.aqua,fontSize:11},xp:{color:colors.muted,fontSize:8},xpTrack:{flex:1,height:8,borderRadius:4,backgroundColor:'#1B414B',overflow:'hidden'},xpFill:{height:'100%',backgroundColor:colors.aqua},
  tankWrap:{position:'relative',overflow:'visible',borderRadius:18,marginTop:9},overlayClip:{position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'hidden',borderRadius:18},nightTint:{borderRadius:18,backgroundColor:'#171A48',opacity:.18},grime:{position:'absolute',width:7,height:7,borderRadius:4,backgroundColor:'#A7A75B',opacity:.22},ticker:{position:'absolute',left:'34%',right:'34%',top:18,height:19,backgroundColor:'#061B22E8',borderWidth:1,borderColor:'#9A7134',justifyContent:'center',overflow:'hidden'},tickerText:{color:colors.gold,fontSize:5,textAlign:'center'},ipoFixture:{position:'absolute',right:22,bottom:49,flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#171F2DEB',borderWidth:1,borderColor:colors.gold,borderRadius:8,padding:6},ipoBell:{width:24,height:21},ipoBellDome:{width:21,height:13,borderTopLeftRadius:12,borderTopRightRadius:12,backgroundColor:'#D4A33F',alignSelf:'center'},ipoBellBase:{width:24,height:5,backgroundColor:'#7B5922'},ipoFixtureTitle:{fontSize:6,color:colors.gold},ipoFixtureSub:{fontSize:5,color:'#F3E4B8',marginTop:2},lineageFixture:{position:'absolute',left:26,bottom:49,flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#103C3AE8',borderWidth:1,borderColor:'#65B783',borderRadius:7,padding:5},dna:{width:18,height:21,position:'relative'},dnaBarA:{position:'absolute',left:2,top:2,width:14,height:2,backgroundColor:'#7DE2A0',transform:[{rotate:'25deg'}]},dnaBarB:{position:'absolute',left:2,top:9,width:14,height:2,backgroundColor:'#7DE2A0',transform:[{rotate:'-25deg'}]},dnaBarC:{position:'absolute',left:2,top:16,width:14,height:2,backgroundColor:'#7DE2A0',transform:[{rotate:'25deg'}]},lineageFixtureTitle:{fontSize:5,color:'#A8EDBA'},lineageFixtureSub:{fontSize:4,color:'#D8F4DF',marginTop:2},
  frenzyText:{position:'absolute',top:45,alignSelf:'center',color:colors.gold,fontSize:11,textShadowColor:'#071A22',textShadowRadius:5},foodPellet:{position:'absolute',width:5,height:7,borderRadius:2,backgroundColor:'#D39551',borderWidth:1,borderColor:'#6E4927'},powerFailure:{backgroundColor:'#02080BCC',alignItems:'center',justifyContent:'center'},inspectionEvent:{position:'absolute',alignSelf:'center',top:104,flexDirection:'row',gap:8,alignItems:'center',backgroundColor:'#582F28E8',borderWidth:2,borderColor:colors.coral,padding:10,borderRadius:10},eventHeadline:{color:colors.cream,fontSize:9},eventSub:{color:'#D7C9B8',fontSize:6,marginTop:3},visitor:{position:'absolute',right:35,top:80,backgroundColor:'#173A52D9',borderWidth:1,borderColor:'#6FA8C8',borderRadius:8,padding:8},visitorText:{fontSize:6,color:'#BCE1F4'},treasure:{position:'absolute',right:88,bottom:41,alignItems:'center'},treasureLid:{width:31,height:9,borderWidth:3,borderColor:'#543416',backgroundColor:'#B27B35'},treasureBox:{width:35,height:20,borderWidth:3,borderColor:'#543416',backgroundColor:'#8C5E2C'},treasureLabel:{color:colors.gold,fontSize:5,marginTop:2,backgroundColor:'#071A22AA',padding:3},timeBadge:{position:'absolute',left:12,top:20,flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'#071A22CC',borderRadius:10,paddingHorizontal:7,paddingVertical:5},timeText:{color:'#D5E7E8',fontSize:6},
  productionBar:{marginTop:2,backgroundColor:'#0C313C',borderRadius:10,paddingVertical:9,paddingHorizontal:11,flexDirection:'row',alignItems:'center',gap:7,borderWidth:1,borderColor:'#234B56'},liveDot:{width:7,height:7,borderRadius:4,backgroundColor:colors.success},liveDotDanger:{backgroundColor:colors.coral},productionLabel:{color:colors.aqua,fontSize:9,flex:1},productionRate:{color:colors.muted,fontSize:8},productionRateDanger:{color:colors.coral},permanentBonusBar:{flexDirection:'row',justifyContent:'space-between',gap:8,backgroundColor:'#173831',borderRadius:9,padding:9,borderWidth:1,borderColor:'#356D59'},permanentBonusText:{fontSize:6,color:'#AEE5BD',flex:1},
  inspector:{backgroundColor:colors.cream,borderRadius:15,padding:13,flexDirection:'row',alignItems:'center',gap:11,position:'relative',minHeight:100},inspectClose:{position:'absolute',right:8,top:8,zIndex:3,padding:5},inspectInfo:{flex:1,paddingRight:18},inspectKicker:{color:'#758485',fontSize:6,letterSpacing:1.2},inspectName:{color:colors.ink,fontSize:15,marginTop:3},inspectLine:{color:'#4F686B',fontSize:7,lineHeight:11,marginTop:4},inspectLegend:{color:'#6D5842',fontSize:7,lineHeight:11,marginTop:5},sellCard:{backgroundColor:colors.cream,borderRadius:16,padding:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sellTitle:{color:colors.ink,fontSize:13},sellDetail:{color:'#4B666A',fontSize:8,marginTop:4},sellButton:{backgroundColor:colors.gold,paddingVertical:10,paddingHorizontal:12,borderRadius:10,flexDirection:'row',alignItems:'center',gap:6,borderBottomWidth:4,borderBottomColor:'#B17C24'},sellButtonText:{color:colors.ink,fontSize:10},sellDisabled:{opacity:.35},sellPressed:{transform:[{translateY:2}],borderBottomWidth:2},
});
