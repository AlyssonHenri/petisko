import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, StatusBar, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface SplashScreen {
  onFinish: () => void
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function PetiskoSplashScreen({ onFinish }: SplashScreen) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const logoFadeAnim = useRef(new Animated.Value(0)).current
  const pawBounceAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(-1)).current

  useEffect(() => {
    Animated.sequence([

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(pawBounceAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
       
      Animated.delay(200),
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const bounceScale = pawBounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1],
  });

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const PawSVG = () => {
      const AnimatedImage = Animated.createAnimatedComponent(Image);
      
      return (
        <AnimatedImage
          style={[
            styles.svgLogo,
            {
              transform: [
                { scale: bounceScale },
                { rotate: spin },
              ],
            },
          ]}
          source={require('../assets/logo/logo.png')}
          resizeMode="contain"
        />
      );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoFadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View 
            style={{transform: [{ scale: bounceScale }]}} 
          />
          
          <PawSVG />
        </Animated.View>

        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              opacity: logoFadeAnim,
            }
          ]}
        >
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawBackground: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    borderRadius: 100,
    position: 'absolute',
    zIndex: -1,
  },
  svgLogo: {
    alignSelf: 'center',
    marginTop: 80,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  pawContainer: {
    marginBottom: 0,
  },
  pawPrint: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPad: {
    width: 65,
    height: 80,
    backgroundColor: '#FF6B35',
    borderRadius: 32.5,
    position: 'absolute',
    bottom: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  toe: {
    width: 26,
    height: 36,
    backgroundColor: '#FF6B35',
    borderRadius: 18,
    position: 'absolute',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toe1: {
    top: 8,
    left: 32,
    transform: [{ rotate: '-12deg' }],
  },
  toe2: {
    top: 18,
    left: 12,
    transform: [{ rotate: '-30deg' }],
  },
  toe3: {
    top: 18,
    right: 12,
    transform: [{ rotate: '30deg' }],
  },
  toe4: {
    top: 8,
    right: 32,
    transform: [{ rotate: '12deg' }],
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 107, 53, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#8B5A3C',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    marginHorizontal: 3,
    opacity: 0.6,
  },
});