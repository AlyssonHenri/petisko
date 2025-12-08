import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { IPet } from '@/interfaces/pet';
import getUser from '@/services/getUserInfo';
import { useFocusEffect } from 'expo-router';
import { API_BASE_URL } from '@/constants/ApiConfig';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';







export default function SelectionPet({ onIndexChange }: { onIndexChange?: (index: string) => void }) {
    const [petList, setPetList] = useState<IPet[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);


    const handleIndex = (() => {
        setCurrentIndex((prev) => {
            const next = prev + 1 >= petList.length ? 0 : prev + 1;
            onIndexChange?.(petList[next].id)
            return next
        }
        )


    })

    useFocusEffect(React.useCallback(() => {
        async function fetchPetsFromUser() {
            const res = await getUser();
            const petsList = res?.data?.petList;
            setPetList(petsList!)
        }
        fetchPetsFromUser();
    }, []));


    return (
        (<View style={{ position: 'absolute', top: 30, width: '90%', height: 85, backgroundColor: Colors.laranjaVariado, alignItems: 'flex-start', borderRadius: 100 }}>
            {petList.length > 0 &&

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 10, marginLeft: -10 }}>
                    <Image style={{ height: 80, width: 80, borderRadius: 100 }} source={{ uri: `${API_BASE_URL}/${petList[currentIndex].img1}` }}></Image>
                    <View>
                        <Text style={{ fontFamily: 'NunitoLight', color: 'white' }}>Procurando love para...</Text>
                        <Text style={{ fontFamily: 'NunitoBold', color: 'white', fontSize: 15 }}>{petList[currentIndex].name}</Text>
                    </View>
                    <TouchableOpacity onPress={handleIndex}>
                        <FontAwesome style={{ marginTop: 2 }} name="chevron-circle-right" size={50} color="white" />

                    </TouchableOpacity>
                </View>
            }

        </View>)

    )
}

