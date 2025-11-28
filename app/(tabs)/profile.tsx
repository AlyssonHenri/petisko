import CardPet from "@/components/card-pet";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { RootUser } from "@/interfaces/user";
import getUser from "@/services/getUserInfo";
import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { image } from "@/constants/bg";
import { AddButton } from "@/components/addButton";

export default function ProfileScreen() {
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);

    useFocusEffect(React.useCallback(() => {
        async function fetchUser() {
            const user = await getUser();
            setUserInfo(user);
        }
        fetchUser();
    }, [])
    );

    if (userInfo && userInfo.name) {
        return (
            <ImageBackground source={image} style={styles.imageBackground}>
                <ScrollView style={styles.overlayContent}>
                    <View style={styles.topPage}>
                        <Image
                            style={styles.profilePic}
                            source={userInfo?.img
                                ? { uri: userInfo.img }
                                : { uri: "https://img.freepik.com/vetores-premium/icone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana_157943-15752.jpg?semt=ais_hybrid&w=740&q=80" }
                            }
                        />
                        <View style={styles.metaText}>
                            <Text style={styles.name}>{userInfo?.name || '-'}</Text>
                            <Text style={styles.username}>@{userInfo?.username || "Dumb"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.editarPerfil}>
                            <Text style={styles.buttonText}>
                                Editar Perfil 
                            </Text>
                            <FontAwesome style={{ marginLeft: 10}} name="edit" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Meus Pets</Text>

                    <ScrollView style={styles.petsContainer}>
                        <AddButton
                            title="Novo Pet"
                            onPress={() => router.push("/createPet")}
                        />
                        {/* <CardPet name={'Robert'} imageSrc={'../../assets/images/mockdog.png'} typePet={'Caramelo'} avaliable={true} canEdit={true} /> */}
                    </ScrollView>

                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    overlayContent: {
        marginTop: 50,
        flex: 1,
        backgroundColor: 'transparent'
    },
    topPage: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'transparent'
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: Colors.laranjaVariado,
        marginBottom: 10,
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
        backgroundColor: Colors.laranjaVariado,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    buttonText: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'NunitoMedium',
        gap: 20,
        fontSize: 16,
        color: Colors.creme,
        marginRight: 0
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