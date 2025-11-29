import { API_BASE_URL } from "@/constants/ApiConfig";
import Colors from "@/constants/Colors";
import { IPet } from "@/interfaces/pet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CardPet({pet, avaliable, canEdit, onPressEdit}: {pet: IPet, avaliable: boolean, canEdit: boolean, onPressEdit?: () => void}){
    if(!pet){
        return null
    }

    const imagePet = pet.img1 ? { uri: `${API_BASE_URL}/${pet.img1}` } : require('../assets/images/mockdog.png') 

    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.card}>

                {avaliable && (
                    <View style={{position: 'absolute', paddingHorizontal: 5, borderRadius: 10, right: 10, top: 10, backgroundColor: '#FF4E26'}}>
                        <Text style={{color: 'white', fontFamily: 'NunitoBold', fontSize: 10}}>
                            PROCURANDO ROMANCE 
                            <FontAwesome name="heart" size={10} color="white" />
                        </Text>
                    </View>
                )}

                <Image style={{width: 90, height: 90, borderRadius: 90/2}}source={imagePet}></Image>
                
                <View style={{justifyContent: 'center', marginBottom: 10}} >
                    <Text style={{color: 'white', fontFamily: 'NunitoBlack', fontSize: 20}}>{pet.name}</Text>
                    <Text style={{color: 'white', fontFamily: 'NunitoBold', fontSize: 14, marginTop: -5}}>{pet.raca}</Text>
                </View>

                <View style={{position: 'absolute', bottom: 10, right: 10}}>
                    {canEdit && (
                        <TouchableOpacity onPress={onPressEdit}  style={styles.editarPerfil}>
                            <Text style={{textAlign: 'center', fontFamily: 'NunitoBold', fontSize: 16, color: Colors.laranjaVariado}}>
                                Editar 
                                <FontAwesome name="edit" size={20} color={Colors.laranjaVariado} />
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.laranjaVariado,
        width: '100%',
        flexDirection: 'row',
        borderRadius: 20,
        padding: 5,
        position: 'relative',
        gap: 10
    },
    editarPerfil: {
        backgroundColor: 'white', 
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 20
    },
})