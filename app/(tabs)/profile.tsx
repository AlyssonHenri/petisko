import CardPet from "@/components/card-pet";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { RootUser } from "@/interfaces/user";
import getUser from "@/services/getUserInfo";
import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { image } from "@/constants/bg";
import { AddButton } from "@/components/addButton";
import { IPet, RootPet } from "@/interfaces/pet";

export default function ProfileScreen() {
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);
    const [petList, setPetList] = useState<IPet[]>([]);


    useFocusEffect(React.useCallback(() => {
        async function fetchUser() {
            const res = await getUser();
            const user = res?.data?.user;

            const petsList = res?.data?.petList;
            setPetList(petsList!)

            setUserInfo(user!);
        }
        fetchUser();
    }, [])
    );

    if (userInfo && userInfo.name) {
        return (
            <ImageBackground source={image} style={styles.imageBackground}>
                <View style={{flex: 1}}>
                <View style={{flex: 0.8}}>
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
                        <View style={{paddingHorizontal: 10}}>

                            <AddButton
                                title="Novo Pet"
                                onPress={() => router.push("/createPet")}
                            />
                        </View>

                        

                </View>

                <View style={{flex: 0.6}}>

                <FlatList contentContainerStyle={{ paddingHorizontal: 10, gap: 15}}
                            data={petList}
                            renderItem={({item}) => <CardPet name={item.name} imageSrc={item.img1} typePet={item.raca} avaliable={true} canEdit={true} />}
                            keyExtractor={item => item.id}
                        />
                </View>
                </View>

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