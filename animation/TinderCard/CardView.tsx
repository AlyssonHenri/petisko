import { View, Text, Dimensions, StyleSheet, Image } from 'react-native'
import React, { FC, useEffect } from 'react'
import { ReceivedPet } from '@/interfaces/pet'
import Animated, { Easing, Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Colors from '@/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export interface CardViewProps {
    card: ReceivedPet,
    index: number,
    totalCards: number,
    panHandlers: any,
    translateY: SharedValue<number>,
    translateX: SharedValue<number>,
    nextCardScale: SharedValue<number>

}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const ROTATION_RANGE = 15
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;





const CardView: FC<CardViewProps> = ({
    card,
    index,
    totalCards,
    panHandlers,
    translateX,
    translateY,
    nextCardScale }) => {
    const getVacinas = () => {
        let vacinasList: string[] = []
        card.vacinas.map((vacina) => vacinasList = [...vacinasList, vacina.nome.trim()]);
        return vacinasList.join(', ')
    }

    const isTopCard = index === 0;
    const isSecondCard = index === 1;
    const leftOffset = useSharedValue(0);
    const cardScale = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);
    const cardOpacity = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);

    useEffect(() => {
        const targetOffset = isTopCard ? 10 : -25
        leftOffset.value = withTiming(targetOffset, {
            duration: 300,
            easing: Easing.out(Easing.quad)
        })
    }, [index, isTopCard])


    useEffect(() => {
        const targetScale = isTopCard ? 1 : isSecondCard ? 0.8 : 0.7;
        cardScale.value = withTiming(targetScale, {
            duration: 300,
            easing: Easing.out(Easing.quad)
        })
        const targetOpacity = isTopCard ? 1 : isSecondCard ? 0.8 : 0.7;
        cardOpacity.value = withTiming(targetOpacity, {
            duration: 300,
            easing: Easing.out(Easing.quad)
        })

    }, [index, isTopCard, isSecondCard])


    const backgroundColorStyle = useAnimatedStyle(() => {
        let bgColor = 'white';

        if (isTopCard) {
            if (translateX.value > 0) {
                const progress = Math.min(translateX.value / SWIPE_THRESHOLD, 1);
                bgColor = `rgba(221, 66, 87, ${progress * 0.5})`; // vermeio
            } else if (translateX.value < 0) {
                const progress = Math.min(-translateX.value / SWIPE_THRESHOLD, 1);
                bgColor = `rgba(255, 255, 255, ${progress * 0.5})`; // preto
            }
        }

        return { backgroundColor: bgColor };
    });

    const heartStyle = useAnimatedStyle(() => {
        if (!isTopCard) return { opacity: 0 };

        const progress = Math.min(Math.max(translateX.value / SWIPE_THRESHOLD, 0), 1);
        return {
            opacity: progress,
            transform: [{ scale: 0.5 + 0.5 * progress }],
        };
    });

    const closeStyle = useAnimatedStyle(() => {
        if (!isTopCard) return { opacity: 0 };

        const progress = Math.min(Math.max(-translateX.value / SWIPE_THRESHOLD, 0), 1);
        return {
            opacity: progress,
            transform: [{ scale: 0.5 + 0.5 * progress }],
        };
    });


    const animationStyle = useAnimatedStyle(() => {
        const currentX = isTopCard ? translateX.value : 0;
        const currentY = isTopCard ? translateY.value : 0;
        const rotate = interpolate(
            currentX,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-ROTATION_RANGE, 0, ROTATION_RANGE],
            Extrapolation.CLAMP)
        const opacity = interpolate(
            Math.sqrt(currentX ** 2 + currentY ** 2),
            [0, SCREEN_WIDTH * 0.5],
            [1, 0],
            Extrapolation.CLAMP)

        const scale = isTopCard ? 1 : isSecondCard ? nextCardScale.value : 0.8
        return {
            transform: [
                { translateX: currentX + leftOffset.value },
                { translateY: currentY },
                { rotate: `${rotate}deg` },
                { scale }
            ],
            opacity: isTopCard ? opacity : cardOpacity.value,
            zIndex: totalCards - index
        };
    })

    return (
        <Animated.View style={[styles.card, animationStyle, backgroundColorStyle]} {...panHandlers}>
            <View style={styles.cardImage}>
                <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={{ uri: card.img1 }} />

            </View>
            <Animated.View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }, heartStyle]}>
                <FontAwesome name="heart" size={120} color="white" />
            </Animated.View>

            <Animated.View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }, closeStyle]}>
                <FontAwesome name="close" size={120} color="white" />
            </Animated.View>
            <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -10 }}>
                    <Text style={styles.name}>{card.name}, {card.age} | </Text>
                    <Text style={styles.raca}>{card.raca.charAt(0).toUpperCase() + card.raca.slice(1)}, {card.sexo.toUpperCase()}</Text>

                </View>
                <Text style={styles.bio}>Vacinas: {getVacinas()}.</Text>
            </View>
        </Animated.View >
    )
}

export default CardView;

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.6,
        backgroundColor: '#fff',
        borderRadius: 15,
        position: 'absolute',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 8.3,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden'

    },
    cardImage: {
        width: '100%',
        height: '75%'
    },
    cardFooter: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 20,
        fontFamily: 'NunitoBold'
    },
    raca: {
        fontSize: 15,
        fontFamily: 'NunitoMedium'

    },
    bio: {
        fontSize: 13,
        color: '#666',
        flex: 1,
        fontFamily: 'NunitoMedium',
        textAlign: 'center',
        marginTop: 0
    }


})