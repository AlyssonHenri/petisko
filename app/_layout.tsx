import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import CustomSplashScreen from '@/components/SplashScreen';

export {
  // Catch any errors thrown by the Layout component.r
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    PoppinsRegular: require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsExtraLight: require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    NunitoBlack: require('../assets/fonts/Nunito/Nunito-Black.ttf'),
    NunitoExtraLight: require('../assets/fonts/Nunito/Nunito-ExtraLight.ttf'),
    NunitoLight: require('../assets/fonts/Nunito/Nunito-Light.ttf'),
    NunitoBold: require('../assets/fonts/Nunito/Nunito-Bold.ttf'),
    NunitoMedium: require('../assets/fonts/Nunito/Nunito-Medium.ttf'),
    NunitoRegular: require('../assets/fonts/Nunito/Nunito-Regular.ttf'),

    ...FontAwesome.font,
  });

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    return () => sub.remove();
  }, []);

  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || showSplash) {
    return (
      <CustomSplashScreen
        onFinish={() => {
          console.log('Splash screen finished, loaded:', loaded);
          setTimeout(() => {
            setShowSplash(false);
          }, 100);
        }}
      />
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{
        gestureEnabled: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
