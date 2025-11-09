import Colors from "@/constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

export default function CardPet({name, imageSrc, typePet, avaliable, canEdit}: {name: string, imageSrc: string, typePet: string, avaliable: boolean, canEdit: boolean}){
    const imagePet = require('../assets/images/mockdog.png')
    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.card}>
                <Image style={{width: 90, height: 90, borderRadius: 90/2}}source={imagePet}></Image>
                <View style={{justifyContent: 'center', marginBottom: 10}} >
                    <Text style={{color: 'white', fontFamily: 'NunitoBlack', fontSize: 20}}>{name}</Text>
                    <Text style={{color: 'white', fontFamily: 'NunitoBold', fontSize: 14, marginTop: -5}}>{typePet}</Text>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.laranja,
        width: '100%',
        flexDirection: 'row',
        borderRadius: 20,
        padding: 5,
        gap: 10
    }
})