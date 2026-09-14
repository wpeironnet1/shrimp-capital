import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WebNoiseGuard } from '../src/components/WebNoiseGuard';
import { GameProvider } from '../src/game/GameProvider';

export default function RootLayout() {
  return <GameProvider><WebNoiseGuard /><StatusBar style="light" /><Stack screenOptions={{ headerShown: false }} /></GameProvider>;
}
