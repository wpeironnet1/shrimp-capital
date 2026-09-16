import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function TabLayout(){
  const {width}=useWindowDimensions();
  const mobile=width<700;
  const tiny=width<390;

  return <Tabs screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:colors.goldLight,
    tabBarInactiveTintColor:'#A8BEC1',
    tabBarHideOnKeyboard:true,
    tabBarStyle:{
      position:'absolute',
      backgroundColor:'#05161D',
      borderTopWidth:3,
      borderTopColor:colors.brass,
      height:mobile?78:84,
      paddingTop:mobile?6:7,
      paddingBottom:mobile?8:9,
      shadowColor:'#000',
      shadowOpacity:.65,
      shadowRadius:0,
      shadowOffset:{width:0,height:-5},
    },
    tabBarItemStyle:{
      marginHorizontal:mobile?3:6,
      marginVertical:3,
      minHeight:60,
      minWidth:72,
      borderWidth:1,
      borderColor:'#36545D',
      backgroundColor:'#0A2933',
    },
    tabBarLabelStyle:{
      fontFamily:'PressStart2P',
      fontSize:tiny?9:mobile?10:11,
      lineHeight:tiny?13:mobile?14:15,
      letterSpacing:0,
      marginBottom:mobile?3:4,
      textTransform:'uppercase',
    },
    tabBarIcon:({color,focused})=><Ionicons
      name={route.name==='index'?'fish':route.name==='market'?'stats-chart':'business'}
      color={focused?colors.goldLight:color}
      size={mobile?(focused?27:25):(focused?28:25)}
    />,
  })}>
    <Tabs.Screen name="index" options={{title:'Farm'}}/>
    <Tabs.Screen name="market" options={{title:'Market'}}/>
    <Tabs.Screen name="clan" options={{title:'Boardroom'}}/>
  </Tabs>;
}
