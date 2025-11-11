import CardPet from "@/components/card-pet";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";


export default function ProfileScreen() {
    const image = require('../../assets/images/background.png');
    const profilePic = require('../../assets/images/mock.png');


    return (

    <ImageBackground source={image} style={styles.imageBackground}>
        <ScrollView style={styles.overlayContent}>
            <View style={styles.topPage}>
                <Image style={styles.profilePic} source={profilePic}></Image>
                <View style={styles.metaText}>
                    <Text style={styles.name}>Rafael</Text>
                    <Text style={styles.username}>@rafabaladeira</Text>
                </View>
                <TouchableOpacity onPress={() => {}}  style={styles.editarPerfil}>
                    <Text style={{textAlign: 'center', fontFamily: 'NunitoMedium', fontSize: 16, color: Colors.creme}}>
                        Editar Perfil  
                        <FontAwesome name="edit" size={20} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{fontFamily: 'NunitoExtraLight', fontSize: 32, textAlign: 'center', marginTop: 20}}>Meus Pets</Text>    
            
            <ScrollView style={{padding: 20}}>
                <CardPet name={'Robert'} imageSrc={'../../assets/images/mockdog.png'} typePet={'Caramelo'} avaliable={true} canEdit={true} ></CardPet>
            </ScrollView>
      
        </ScrollView>
    </ImageBackground>
     
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1, 
        resizeMode: 'repeat', 
        justifyContent: 'center', 
        alignItems: 'stretch',
        backgroundColor: 'blue',
    },

    overlayContent: {
        marginTop: 50,
        flex: 1,
    },
    topPage: {
        flex: 1,
        alignItems: 'center',
        gap: 0,
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
        textAlign: 'center'


    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,

    },
    metaText: {
        flex: 1,
    },
    editarPerfil: {
        backgroundColor: Colors.laranjaVariado, 
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 20
  },
    details: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center'
    }


})