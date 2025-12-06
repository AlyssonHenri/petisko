import { View, Text, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { CardPet } from '@/interfaces/cardPet';
import { getPets } from '@/services/pet';
import { useFocusEffect } from 'expo-router';
import getUser from '@/services/getUserInfo';
import { ReceivedPet } from '@/interfaces/pet';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
const RESET_DURATION = 300; 

export default function index() {
  useFocusEffect(() => {
    getPetsForFeed()
  })
  
  async function getPetsForFeed() {
    const petList = await getPets();
       async function fetchUser() {
        const res = await getUser();
        return res?.data?.user;
    }
    const user = await fetchUser(); 
    const filteredPetList = petList?.data?.filter((pet)=> pet.tutor !== user?.id)
    setCard(filteredPetList ?? [])
    
  }
  
  const [card, setCard] = useState<ReceivedPet[]>([]);
  return (
    <View>
      <Text>
        Ooiiiiiiiiiiiiiiiiiiii
      </Text>
    </View>
  )
}

