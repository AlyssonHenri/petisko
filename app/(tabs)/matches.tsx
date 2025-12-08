import { View } from "@/components/Themed"
import Colors from "@/constants/Colors"
import React, { useState, useRef } from 'react'
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useFocusEffect } from '@react-navigation/native'
import { image } from "@/constants/bg"
import { useNavbarStore } from "./_layout"
import { IMatchWithPetDetails, IBlockedPetWithDetails } from "@/interfaces/match"
import { getMatchesWithDetails, deleteMatch, getBlocksWithDetails, deleteBlock } from "@/services/matches"
import { IPet } from "@/interfaces/pet"
import getUser from "@/services/getUserInfo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { API_BASE_URL } from "@/constants/ApiConfig"
import ConfirmationModal from "@/components/ConfirmationModal"

export default function MatchesScreen() {
    const [petList, setPetList] = useState<IPet[]>([])
    const [selectedPet, setSelectedPet] = useState<IPet | null>(null)
    const [matches, setMatches] = useState<IMatchWithPetDetails[]>([])
    const [blockedPets, setBlockedPets] = useState<IBlockedPetWithDetails[]>([])
    const [activeTab, setActiveTab] = useState<'matches' | 'blocked'>('matches')
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const initialized = useRef(false)
    const selectedPetRef = useRef<IPet | null>(null)

    async function fetchUserPets() {
        const res = await getUser()
        const petsList = res?.data?.petList
        setPetList(petsList!)
        
        if (petsList && petsList.length > 0 && !initialized.current) {
            const firstPet = petsList[0]
            setSelectedPet(firstPet)
            selectedPetRef.current = firstPet
            await fetchMatches(firstPet.id)
            initialized.current = true
        }
    }

    async function fetchMatches(petId: string) {
        setLoading(true)
        try {
            const [matchesResponse, blocksResponse] = await Promise.all([
                getMatchesWithDetails(petId),
                getBlocksWithDetails(petId)
            ])
            
            if (matchesResponse?.success) {
                setMatches(matchesResponse.data || [])
            }
            if (blocksResponse?.success) {
                setBlockedPets(blocksResponse.data || [])
            }
        } catch (error) {
            console.log("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(React.useCallback(() => {
        useNavbarStore.getState().setActive(true)
        
        if (!initialized.current) {
            fetchUserPets()
        } else if (selectedPetRef.current) {
            fetchMatches(selectedPetRef.current.id)
        }
        
        return () => { }
    }, []))

    const handlePetChange = async (pet: IPet) => {
        if (selectedPet?.id === pet.id) return
        setSelectedPet(pet)
        selectedPetRef.current = pet
        await fetchMatches(pet.id)
    }

    const handleDelete = async () => {
        if (itemToDelete) {
            const response = activeTab === 'matches' 
                ? await deleteMatch(itemToDelete)
                : await deleteBlock(itemToDelete)
            
            if (response.success) {
                if (selectedPet) {
                    await fetchMatches(selectedPet.id)
                }
            }
        }
        setModalVisible(false)
        setItemToDelete(null)
    }

    const confirmDelete = (itemId: number) => {
        setItemToDelete(itemId)
        setModalVisible(true)
    }

    const renderMatchCard = ({ item }: { item: IMatchWithPetDetails }) => {
        const displayPet = item.petPrincipal.id === selectedPet?.id 
            ? item.petMatch 
            : item.petPrincipal
        
        const imagePet = displayPet.img1 
            ? { uri: `${displayPet.img1}` } 
            : require('../../assets/images/mockdog.png')

        return (
            <View style={styles.matchCard}>
                <View style={styles.matchContent}>
                    <Image style={styles.petImage} source={imagePet} />
                    
                    <View style={styles.petInfo}>
                        <Text style={styles.petName}>{displayPet.name}</Text>
                        <Text style={styles.petRace}>{displayPet.raca}</Text>
                        <Text style={styles.petAge}>{displayPet.age} anos • {displayPet.sexo === 'm' ? 'Macho' : 'Fêmea'}</Text>
                        
                        {item.isReciprocal && (
                            <View style={styles.reciprocalBadge}>
                                <FontAwesome name="heart" size={12} color="white" />
                                <Text style={styles.reciprocalText}>Match Recíproco!</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity 
                        onPress={() => confirmDelete(item.id)}
                        style={styles.deleteButton}
                    >
                        <FontAwesome name="trash" size={20} color="#FF4E26" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderBlockedCard = ({ item }: { item: IBlockedPetWithDetails }) => {
        const displayPet = item.petPrincipal.id === selectedPet?.id 
            ? item.petBlock 
            : item.petPrincipal
        
        const imagePet = displayPet.img1 
            ? { uri: `${displayPet.img1}` } 
            : require('../../assets/images/mockdog.png')

        return (
            <View style={styles.matchCard}>
                <View style={styles.matchContent}>
                    <Image style={styles.petImage} source={imagePet} />
                    
                    <View style={styles.petInfo}>
                        <Text style={styles.petName}>{displayPet.name}</Text>
                        <Text style={styles.petRace}>{displayPet.raca}</Text>
                        <Text style={styles.petAge}>{displayPet.age} anos • {displayPet.sexo === 'm' ? 'Macho' : 'Fêmea'}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => confirmDelete(item.id)}
                        style={styles.deleteButton}
                    >
                        <FontAwesome name="unlock" size={20} color={Colors.laranja} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderPetSelector = ({ item }: { item: IPet }) => {
        const isSelected = selectedPet?.id === item.id
        const imagePet = item.img1 
            ? { uri: `${API_BASE_URL}/${item.img1}` } 
            : require('../../assets/images/mockdog.png')

        return (
            <TouchableOpacity 
                onPress={() => handlePetChange(item)}
                style={[styles.petSelectorItem, isSelected && styles.petSelectorItemSelected]}
            >
                <Image style={styles.petSelectorImage} source={imagePet} />
                <Text style={[styles.petSelectorName, isSelected && styles.petSelectorNameSelected]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <ImageBackground source={image} style={styles.imageBackground}>
            <View style={styles.container}>

                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'matches' && styles.tabActive]}
                            onPress={() => setActiveTab('matches')}
                        >
                            <FontAwesome name="heart" size={16} color={activeTab === 'matches' ? 'white' : Colors.laranja} />
                            <Text style={[styles.tabText, activeTab === 'matches' && styles.tabTextActive]}>
                                Matches ({matches.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'blocked' && styles.tabActive]}
                            onPress={() => setActiveTab('blocked')}
                        >
                            <FontAwesome name="ban" size={16} color={activeTab === 'blocked' ? 'white' : '#999'} />
                            <Text style={[styles.tabText, activeTab === 'blocked' && styles.tabTextActive]}>
                                Bloqueados ({blockedPets.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {petList.length > 0 && (
                    <View style={styles.petSelectorWrapper}>
                        <View style={styles.petSelectorContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={petList}
                                renderItem={renderPetSelector}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.petSelectorList}
                            />
                        </View>
                    </View>
                )}

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color={Colors.laranja} />
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    </View>
                ) : activeTab === 'matches' ? (
                    matches.length > 0 ? (
                        <FlatList
                            data={matches}
                            renderItem={renderMatchCard}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.matchList}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyBox}>
                                <FontAwesome name="heart-o" size={60} color={Colors.laranja} />
                                <Text style={styles.emptyText}>
                                    {selectedPet?.name} ainda não tem matches
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    Continue explorando no feed para encontrar novos amores!
                                </Text>
                            </View>
                        </View>
                    )
                ) : (
                    blockedPets.length > 0 ? (
                        <FlatList
                            data={blockedPets}
                            renderItem={renderBlockedCard}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.matchList}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyBox}>
                                <FontAwesome name="ban" size={60} color="#999" />
                                <Text style={styles.emptyText}>
                                    {selectedPet?.name} não bloqueou ninguém
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    Pets bloqueados aparecerão aqui
                                </Text>
                            </View>
                        </View>
                    )
                )}
            </View>

            <ConfirmationModal
                visible={isModalVisible}
                title={""}
                message={activeTab === 'matches' 
                    ? "Tem certeza que deseja desfazer este match?"
                    : "Tem certeza que deseja desbloquear este pet?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setModalVisible(false)
                    setItemToDelete(null)
                } } 
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontFamily: 'NunitoBlack',
        color: Colors.laranja,
        textAlign: 'center',
    },
    petSelectorWrapper: {
        marginBottom: 20,
        marginHorizontal: 15,
        backgroundColor: 'transparent',
    },
    petSelectorContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    petSelectorList: {
        paddingHorizontal: 15,
        gap: 10,
    },
    petSelectorItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        minWidth: 90,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    petSelectorItemSelected: {
        backgroundColor: Colors.laranja,
        borderColor: Colors.laranja,
    },
    petSelectorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
    },
    petSelectorName: {
        fontFamily: 'NunitoBold',
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    petSelectorNameSelected: {
        color: 'white',
    },
    matchList: {
        paddingHorizontal: 15,
        paddingBottom: 100,
        gap: 10,
    },
    matchCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    matchContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 20,
        fontFamily: 'NunitoBlack',
        color: Colors.laranja,
    },
    petRace: {
        fontSize: 14,
        fontFamily: 'NunitoBold',
        color: '#666',
        marginTop: 2,
    },
    petAge: {
        fontSize: 12,
        fontFamily: 'Nunito',
        color: '#999',
        marginTop: 2,
    },
    reciprocalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 5,
        alignSelf: 'flex-start',
        gap: 5,
    },
    reciprocalText: {
        fontSize: 10,
        fontFamily: 'NunitoBold',
        color: 'white',
    },
    blockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 5,
        alignSelf: 'flex-start',
        gap: 5,
    },
    blockedText: {
        fontSize: 10,
        fontFamily: 'NunitoBold',
        color: 'white',
    },
    deleteButton: {
        padding: 10,
    },
    tabsWrapper: {
        marginBottom: 20,
        marginHorizontal: 15,
        backgroundColor: 'transparent',
    },
    tabsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        flexDirection: 'row',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        gap: 8,
    },
    tabActive: {
        backgroundColor: Colors.laranja,
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'NunitoBold',
        color: Colors.laranja,
    },
    tabTextActive: {
        color: 'white',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
    },
    emptyBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignItems: 'center',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'NunitoBlack',
        color: Colors.laranja,
        textAlign: 'center',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Nunito',
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
})
