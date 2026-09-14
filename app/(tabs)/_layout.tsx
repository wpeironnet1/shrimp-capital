import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.goldLight,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      position: 'absolute',
      backgroundColor: '#071B23',
      borderTopWidth: 3,
      borderTopColor: colors.brass,
      height: 88,
      paddingTop: 7,
      paddingBottom: 8,
      shadowColor: '#000',
      shadowOpacity: 0.55,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: -5 },
    },
    tabBarItemStyle: {
      marginHorizontal: 4,
      marginVertical: 3,
      borderWidth: 2,
      borderColor: route.name === 'index' ? '#29434B' : route.name === 'market' ? '#29434B' : '#29434B',
      backgroundColor: '#0A2933',
    },
    tabBarLabelStyle: {
      fontFamily: Platform.select({ web: 'monospace', ios: 'Menlo', android: 'monospace', default: 'monospace' }),
      fontWeight: '900',
      fontSize: 9,
      letterSpacing: 1.2,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    tabBarIcon: ({ color, focused }) => <Ionicons
      name={route.name === 'index' ? 'fish' : route.name === 'market' ? 'stats-chart' : 'business'}
      color={focused ? colors.goldLight : color}
      size={focused ? 27 : 23}
    />,
  })}>
    <Tabs.Screen name="index" options={{ title: 'Farm' }} />
    <Tabs.Screen name="market" options={{ title: 'Market' }} />
    <Tabs.Screen name="clan" options={{ title: 'Boardroom' }} />
  </Tabs>;
}
