import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function TabLayout(){
  return <Tabs screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:colors.goldLight,
    tabBarInactiveTintColor:colors.muted,
    tabBarStyle:{position:'absolute',backgroundColor:'#05161D',borderTopWidth:4,borderTopColor:colors.brass,height:92,paddingTop:6,paddingBottom:7,shadowColor:'#000',shadowOpacity:.65,shadowRadius:0,shadowOffset:{width:0,height:-5}},
    tabBarItemStyle:{marginHorizontal:3,marginVertical:3,borderWidth:2,borderColor:'#29434B',backgroundColor:'#0A2933'},
    tabBarLabelStyle:{fontFamily:'PressStart2P',fontSize:6,letterSpacing:.2,marginBottom:5,textTransform:'uppercase'},
    tabBarIcon:({color,focused})=><Ionicons name={route.name==='index'?'fish':route.name==='market'?'stats-chart':'business'} color={focused?colors.goldLight:color} size={focused?26:22}/>,
  })}>
    <Tabs.Screen name="index" options={{title:'Farm'}}/>
    <Tabs.Screen name="market" options={{title:'Market'}}/>
    <Tabs.Screen name="clan" options={{title:'Boardroom'}}/>
  </Tabs>;
}
