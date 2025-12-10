import CardPet from "@/components/card-pet";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { RootUser } from "@/interfaces/user";
import getUser from "@/services/getUserInfo";
import React, { useState } from 'react';
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { image } from "@/constants/bg";
import { AddButton } from "@/components/addButton";
import { IPet, RootPet } from "@/interfaces/pet";
import { deletePet } from '@/services/pet'
import { useNavbarStore } from "./_layout";
import PopupModal from "@/components/PopupModal";

export default function ProfileScreen() {
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);
    const [petList, setPetList] = useState<IPet[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    type ModalType = 'error' | 'success' | 'conf';

    const [modalInfo, setModalInfo] = useState<{ title: string, message: string, type: ModalType }>({
        title: '',
        message: '',
        type: 'error',
    });

    async function fetchUser() {
        const res = await getUser();
        const user = res?.data?.user;

        const petsList = res?.data?.petList;
        setPetList(petsList!)

        setUserInfo(user!);
    }

    useFocusEffect(React.useCallback(() => {
        useNavbarStore.getState().setActive(true);

        fetchUser();
    }, []));

    const handlePetSelect = (pet: IPet) => {
        router.push({
            pathname: '/edit-pet',
            params: {
                data: JSON.stringify(pet)
            }
        })
    }

    const handlePetDelete = (pet: IPet) => {
        deletePet(pet.id)
        fetchUser();
    }

    const handleConfirmation = () => {
        setModalInfo({ title: 'Logout', message: 'Deseja mesmo realizar logout?', type: 'conf' });
        setModalVisible(true);
    }
    const handleModalClose = () => {
        setModalVisible(false);
    };
    const handleLogout = () => {
        router.replace('/(tabs)')
        setModalVisible(false);

    }

    if (userInfo && userInfo.name) {
        return (
            <ImageBackground source={image} style={styles.imageBackground}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.topPage}>
                        <TouchableOpacity onPress={handleConfirmation} style={{ position: 'absolute', left: 15, top: 30, padding: 5 }}>
                            <FontAwesome name="sign-out" size={35} color="black" />
                        </TouchableOpacity>

                        <View style={styles.profilePicWrapper}>
                            <Image
                                style={styles.profilePic}
                                source={userInfo?.img
                                    ? { uri: userInfo.img }
                                    : { uri: "https://img.freepik.com/vetores-premium/icone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana_157943-15752.jpg?semt=ais_hybrid&w=740&q=80" }
                                }
                            />
                        </View>
                        <View style={styles.metaText}>
                            <Text style={styles.name}>{userInfo?.name || '-'}</Text>
                            <Text style={styles.username}>@{userInfo?.username || "Dumb"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.editarPerfil}>
                            <Text style={styles.buttonText}>
                                Editar Perfil
                            </Text>
                            <FontAwesome style={{ marginTop: 2 }} name="edit" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Meus Pets</Text>
                    <View style={{ paddingHorizontal: 10, marginBottom: 15 }}>
                        <AddButton
                            title="Novo Pet"
                            onPress={() => router.push("/createPet")}
                        />
                    </View>

                    <FlatList
                        contentContainerStyle={{ paddingHorizontal: 10, gap: 15, paddingBottom: 20 }}
                        data={petList}
                        renderItem={({ item }) => <CardPet pet={item} avaliable={true} canEdit={true} onPressEdit={() => handlePetSelect(item)} onPressDelete={() => handlePetDelete(item)} />}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
                <PopupModal
                    visible={modalVisible}
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onClose={handleModalClose}
                    onConfirm={handleLogout}
                    type={modalInfo.type}
                />
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlayContent: {
        marginTop: 50,
        flex: 1,
        backgroundColor: 'transparent'
    },
    topPage: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: 'transparent'
    },
    profilePicWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
    },
    profilePic: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    metaText: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent'
    },
    name: {
        fontFamily: 'NunitoBlack',
        fontSize: 40,
        color: Colors.preto,
    },
    username: {
        fontFamily: 'NunitoBold',
        fontSize: 15,
        color: Colors.preto,
        marginTop: -10,
    },
    editarPerfil: {
        backgroundColor: Colors.laranja,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        fontFamily: 'NunitoBold',
        fontSize: 18,
        color: 'white',
        marginRight: 10
    },
    sectionTitle: {
        fontFamily: 'NunitoExtraLight',
        fontSize: 32,
        textAlign: 'center',
        color: Colors.preto,
    },
    petsContainer: {
        paddingTop: 0,
        padding: 20,
    },
});