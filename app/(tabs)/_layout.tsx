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
    tabBarInactiveTintColor:'#87A3A7',
    tabBarHideOnKeyboard:true,
    tabBarStyle:{
      position:'absolute',
      backgroundColor:'#05161D',
      borderTopWidth:3,
      borderTopColor:colors.brass,
      height:mobile?64:76,
      paddingTop:mobile?4:6,
      paddingBottom:mobile?5:7,
      shadowColor:'#000',
      shadowOpacity:.65,
      shadowRadius:0,
      shadowOffset:{width:0,height:-5},
    },
    tabBarItemStyle:{
      marginHorizontal:mobile?2:5,
      marginVertical:3,
      minHeight:50,
      borderWidth:1,
      borderColor:'#29434B',
      backgroundColor:'#0A2933',
    },
    tabBarLabelStyle:{
      fontFamily:'PressStart2P',
      fontSize:tiny?5:mobile?6:7,
      letterSpacing:0,
      marginBottom:mobile?2:4,
      textTransform:'uppercase',
    },
    tabBarIcon:({color,focused})=><Ionicons
      name={route.name==='index'?'fish':route.name==='market'?'stats-chart':'business'}
      color={focused?colors.goldLight:color}
      size={mobile?(focused?22:20):(focused?24:22)}
    />,
  })}>
    <Tabs.Screen name="index" options={{title:'Farm'}}/>
    <Tabs.Screen name="market" options={{title:'Market'}}/>
    <Tabs.Screen name="clan" options={{title:'Boardroom'}}/>
  </Tabs>;
}
