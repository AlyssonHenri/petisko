import { View, Text, Dimensions, StyleSheet, TouchableOpacity, PanResponder, ActivityIndicator } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { getPets } from '@/services/pet';
import { useFocusEffect } from 'expo-router';
import getUser from '@/services/getUserInfo';
import { IPet, ReceivedPet } from '@/interfaces/pet';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import CardView from './CardView';
import { Easing, useSharedValue, withDecay, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { getBlocks, getMatches, sendMatch, sendUnmatch } from '@/services/matches';
import SelectionPet from './selectionPet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
const RESET_DURATION = 300;

export default function index() {
  const [cards, setCards] = useState<ReceivedPet[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const cardsRef = useRef<ReceivedPet[]>([]);

  const [petPrincipalId, setPetPrincipalId] = useState('')
  const petPrincipalIdRef = useRef(petPrincipalId);
  const initialized = useRef(false);

  async function getPetsForFeed(petId: string) {
    const petList = await getPets();
    const matchesObj = await getMatches(petId);
    const blocksObj = await getBlocks(petId);
    console.log(blocksObj?.data)

    const matches = Array.isArray(matchesObj?.data) ? matchesObj.data : []
    const blocks = Array.isArray(blocksObj?.data) ? blocksObj.data : []

    //console.log(matches)


    const res = await getUser();
    const user = res?.data?.user;
    const filteredPetList = petList?.data?.filter((pet) => pet.tutor !== user?.id && !matches.some(
      (petM: { 'id': string, petMatch: string, petPrincipal: string }) =>
        petM.petPrincipal === pet.id ||
        petM.petMatch === pet.id
    ) && !blocks.some(
      (petM: { 'id': string, petBlock: string, petPrincipal: string }) =>
        petM.petPrincipal === pet.id ||
        petM.petBlock === pet.id
    ))



    setCards(filteredPetList ?? [])
    setFeedLoaded(true)
    setLoading(false)

  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      async function fetchPetsFromUser() {
        const res = await getUser();
        if (res) {
          const petsList = res.data.petList ?? [];
          if (petsList?.length > 0) {
            if (!initialized.current) {

              setPetPrincipalId(petsList[0].id)
              petPrincipalIdRef.current = petsList[0].id
              await getPetsForFeed(petsList[0].id)
              initialized.current = true
            } else if (petPrincipalIdRef.current) {

              await getPetsForFeed(petPrincipalIdRef.current)
            }
          }
        }
      }
      fetchPetsFromUser();
      resetPosition()
    }, [])
  )


  async function changeFullId(index: string) {
    setPetPrincipalId(index);
    petPrincipalIdRef.current = index;
    setLoading(true)
    getPetsForFeed(index);
    setLoading(true)

  }



  const [feedLoaded, setFeedLoaded] = useState(false)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const dummyTranslate = useSharedValue(0)
  const nextCardScale = useSharedValue(0.9)

  React.useEffect(() => {
    petPrincipalIdRef.current = petPrincipalId;
    cardsRef.current = cards;
  }, [petPrincipalId, cards]);




  const resetPosition = useCallback(() => {
    translateX.value = withTiming(0, { duration: RESET_DURATION })
    translateY.value = withTiming(0, { duration: RESET_DURATION })
    nextCardScale.value = withTiming(0.9, { duration: RESET_DURATION })

  }, [])

  const onSwipeComplete = async (direction: 'right' | 'left' | 'up' | 'down') => {
    const action = direction === 'right' || direction === 'up' ? 'LIKED' : 'DISLIKED';
    const currentPetId = petPrincipalIdRef.current;

    if (cardsRef.current.length > 0 && cardsRef.current[0]) {
      if (action === 'LIKED') {
        console.log(currentPetId)
        sendMatch(currentPetId, cardsRef.current[0].id)
          .then(() => console.log('Match enviado com sucesso'))
          .catch(err => console.error('Erro ao enviar match:', err));
      } else {
        sendUnmatch(currentPetId, cardsRef.current[0].id)
          .then(() => console.log('Unmatch enviado com sucesso'))
          .catch(err => console.error('Erro ao enviar match:', err));
      }

      setCards(pre => pre.slice(1));
      translateX.value = 0
      translateY.value = 0
      nextCardScale.value = 0;
      nextCardScale.value = withDelay(
        100, withTiming(0.9, { duration: 400, easing: Easing.exp })
      )

    } else {
      resetPosition()
    }
  }

  const forceSwipe = useCallback((direction: 'right' | 'left' | 'up' | 'down') => {
    const swipeConfig = {
      right: { x: SCREEN_WIDTH * 1.5, y: 0 },
      left: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      up: { y: -SCREEN_HEIGHT * 1.5, x: 0 },
      down: { y: SCREEN_HEIGHT * 1.5, x: 0 },
    }

    translateX.value = withTiming(swipeConfig[direction].x,
      { duration: SWIPE_OUT_DURATION })
    translateY.value = withTiming(swipeConfig[direction].y,
      { duration: SWIPE_OUT_DURATION, }, () => scheduleOnRN((onSwipeComplete), (direction)))


  }, [onSwipeComplete])

  const handleLike = useCallback(() => forceSwipe('right'), [forceSwipe, feedLoaded])
  const handleDislike = useCallback(() => forceSwipe('left'), [forceSwipe, feedLoaded])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        translateX.value = gesture.dx
        translateY.value = gesture.dy
        const dragDistance = Math.sqrt(gesture.dx ** 2 + gesture.dy ** 2);
        const progress = Math.min(dragDistance / SWIPE_THRESHOLD, 1);
        nextCardScale.value = 0.9 + 0.1 * progress

      },
      onPanResponderRelease: (_, gesture) => {
        const absDx = Math.abs(gesture.dx)
        const absDy = Math.abs(gesture.dy)

        if (absDy > absDx) {
          if (gesture.dy < -SWIPE_THRESHOLD) {
            forceSwipe('up')

          } else if (gesture.dy > SWIPE_THRESHOLD) {
            forceSwipe('down')
          } else {
            resetPosition()
          }

        } else {

          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right')

          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left')

          } else {
            resetPosition()
          }
        }

      }
    })
  ).current
  const renderCard = useCallback(
    (card: ReceivedPet, index: number) => (
      <CardView
        key={card.id}
        card={card}
        index={index}
        totalCards={cards.length}
        panHandlers={index === 0 ? panResponder.panHandlers : {}}
        nextCardScale={index === 1 ? nextCardScale : dummyTranslate}
        translateX={index === 0 ? translateX : dummyTranslate}
        translateY={index === 0 ? translateY : dummyTranslate}
      />
    ), [cards.length, translateX, panResponder.panHandlers, translateY, nextCardScale])


  return (
    <View style={styles.container}>
      <SelectionPet onIndexChange={changeFullId} />


      {
        isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={Colors.laranja} />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          </View>
        ) : cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sem mais pets</Text>
          </View>
        ) : (
          <>
            <View style={styles.cardsWrapper}>
              {cards.map(renderCard).reverse()}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleDislike} style={styles.btn}>
                <Ionicons name="close" size={45} color={Colors.laranja} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLike} style={styles.btn}>
                <Ionicons name="heart-outline" size={45} color={Colors.laranja} />
              </TouchableOpacity>
            </View>
          </>
        )
      }




    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingBottom: 40,
  },
  cardsWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    zIndex: 10,
  },
  btn: {
    backgroundColor: '#fff',
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  emptyText: {
    fontSize: 20,
    color: '#999'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  loadingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'NunitoBold',
    color: Colors.laranja,
  },
});