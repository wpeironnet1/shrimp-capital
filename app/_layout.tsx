import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p/400Regular';
import { VT323_400Regular } from '@expo-google-fonts/vt323/400Regular';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { WebNoiseGuard } from '../src/components/WebNoiseGuard';
import { GameProvider } from '../src/game/GameProvider';
import { colors } from '../src/theme/colors';

export default function RootLayout(){
  const [loaded]=useFonts({VT323:VT323_400Regular,PressStart2P:PressStart2P_400Regular});
  if(!loaded)return <View style={{flex:1,backgroundColor:colors.ink}}/>;
  return <GameProvider><WebNoiseGuard/><StatusBar style="light"/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.ink}}}/></GameProvider>;
}
