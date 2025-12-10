import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { IPet } from '@/interfaces/pet';
import getUser from '@/services/getUserInfo';
import { useFocusEffect } from 'expo-router';
import { API_BASE_URL } from '@/constants/ApiConfig';
import Colors from '@/constants/Colors';

export default function SelectionPet({ onIndexChange }: { onIndexChange?: (index: string) => void }) {
    const [petList, setPetList] = useState<IPet[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleSelectPet = (index: number) => {
        setCurrentIndex(index);
        onIndexChange?.(petList[index].id);
    }

    useFocusEffect(React.useCallback(() => {
        async function fetchPetsFromUser() {
            const res = await getUser();
            const petsList = res?.data?.petList;
            setPetList(petsList!);
        }
        fetchPetsFromUser();
    }, []));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Procurando love para:</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {petList.map((pet, index) => (
                    <TouchableOpacity
                        key={pet.id}
                        onPress={() => handleSelectPet(index)}
                        style={[
                            styles.petItem,
                            currentIndex === index && styles.petItemSelected
                        ]}
                    >
                        <Image
                            style={[
                                styles.petImage,
                                currentIndex === index && styles.petImageSelected
                            ]}
                            source={{ uri: `${API_BASE_URL}/${pet.img1}` }}
                        />
                        <Text style={[
                            styles.petName,
                            currentIndex === index && styles.petNameSelected
                        ]}>
                            {pet.name}
                        </Text>
                        {currentIndex === index && (
                            <View style={styles.indicator} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingTop: 25,
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 10,
    },
    title: {
        fontSize: 12,
        fontFamily: 'NunitoMedium',
        color: '#666',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    scrollContent: {
        paddingHorizontal: 15,
        gap: 15,
        alignItems: 'center',
    },
    petItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: 'transparent',
    },
    petItemSelected: {
        backgroundColor: Colors.laranjaVariado + '20',
    },
    petImage: {
        height: 55,
        width: 55,
        borderRadius: 27.5,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    petImageSelected: {
        borderWidth: 3,
        borderColor: Colors.laranja,
    },
    petName: {
        fontFamily: 'NunitoMedium',
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    petNameSelected: {
        fontFamily: 'NunitoBold',
        color: Colors.laranja,
    },
    indicator: {
        position: 'absolute',
        bottom: -2,
        width: 30,
        height: 3,
        backgroundColor: Colors.laranja,
        borderRadius: 2,
    },
});

