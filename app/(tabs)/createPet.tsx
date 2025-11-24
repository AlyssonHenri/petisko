import { image } from "@/constants/bg";
import Colors from "@/constants/Colors";
import { Alert, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { SetStateAction, useState } from "react";
import CustomInput from "@/components/generic_input";
import { Icon } from 'react-native-paper';
import { useMemo } from "react";

export default function createPet(){
    const [nomePet, setNomePet] = useState('');
    const [idadePet, setIdadePet] = useState('');
    const [raca, setRaca] = useState('');
    const [vacinas, setVacinas] = useState<{nome: string, id: string}[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const [nomeTouched, setNomeTouched] = useState(false);
    const [idadeTouched, setIdadeTouched] = useState(false);
    const [racaTouched, setRacaTouched] = useState(false);


    const pickImage = async (index: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });


        if (!result.canceled && result.assets[0]) {

            setImages(prev => {
                const newArr = [...prev];
                newArr[index] = result.assets[0].uri; 
                return newArr;
            });
            //setImageType(result.assets[0].type || 'image/jpeg');
        }
    };
    
    function addInput(): void{
        const novaVacina = {
            nome: '',
            id: Date.now().toString()
        }

        setVacinas(prev => [...prev, novaVacina])
    }
    
    const validateField = (field: string, value: string, touched: boolean) => {
        if (!touched) {
            return { isValid: true, message: '' };
        }

        switch (field) {
            case 'nome':
                if (!value.trim()) return { isValid: false, message: 'Nome do pet é obrigatório' };
                if (value.trim().length < 0) return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
                if (value.trim().length > 500) return { isValid: false, message: 'Nome deve ter no máximo 500 caracteres' };
                break;
            case 'idade':
                if (!value.trim()) return { isValid: false, message: 'Idade é obrigatória' };
                break;
            case 'raca':
                if (!value.trim()) return { isValid: false, message: 'Raça é obrigatória' };
                if (value.trim().length < 0) return { isValid: false, message: 'Raça deve ter pelo menos 2 caracteres' };
                if (value.trim().length > 500) return { isValid: false, message: 'Raça deve ter no máximo 500 caracteres' };
                break;
            default:
                break;
        }
        return { isValid: true, message: '' };
    };

    const nameError = useMemo(() => validateField('nome', nomePet, nomeTouched), [nomePet, nomeTouched]);
    const idadeError = useMemo(() => validateField('idade', idadePet, idadeTouched), [idadePet, idadeTouched]);
    const racaError = useMemo(() => validateField('raca', raca, racaTouched), [raca, racaTouched]);
    
    return (
           <ImageBackground source={image} style={styles.imageBackground}>
                    <View style={styles.imagesPet}>
                        <TouchableOpacity onPress={() => pickImage(0)}>
                            <View style={styles.profilePic}>
                               {images[0] ? (
                                    <Image 
                                        source={{ uri: images[0] }} 
                                        style={{ width: "100%", height: "100%", borderRadius: 75 }}
                                    />
                                ) : (
                                    <Icon source='plus' size={50} color="white"/>
                                )}
                            </View>
                        </TouchableOpacity>

                         <TouchableOpacity onPress={()=> pickImage(1)}>
                            <View style={styles.picture}>
                                {images[1] ? (
                                    <Image 
                                        source={{ uri: images[1] }} 
                                        style={{ width: "100%", height: "100%", borderRadius: 75 }}
                                    />
                                ) : (<Icon source='plus' size={30} color="white"/>)}
                                
                            </View>
                        </TouchableOpacity>
                         <TouchableOpacity onPress={()=> pickImage(2)}>
                            <View style={styles.picture}> 
                                {images[2] ? (
                                    <Image 
                                        source={{ uri: images[2] }} 
                                        style={{ width: "100%", height: "100%", borderRadius: 75 }}
                                    /> ): 
                                (<Icon source='plus' size={30} color="white"/>)}
                            </View>
                        </TouchableOpacity>

                         <TouchableOpacity onPress={()=> pickImage(3)}>
                            <View style={styles.picture}> 
                                {images[3] ? (
                                    <Image 
                                        source={{ uri: images[3] }} 
                                        style={{ width: "100%", height: "100%", borderRadius: 75 }}
                                    /> ): 
                                (<Icon source='plus' size={30} color="white"/>)}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex: 1, flexGrow: 3}}>

                    <View style={styles.inputGroup}>
                        <CustomInput
                            onChangeText={(dado: SetStateAction<string>) => setNomePet(dado)}
                            onFocus={() => setNomeTouched(true)}
                            placeholder='Nome'
                            errorMessage={!nameError.isValid ? nameError.message : ''}
                            iconName='alphabet-latin'
                            value={nomePet}
                        />
                        <CustomInput
                            onChangeText={(dado: SetStateAction<string>) => setIdadePet(dado)}
                            onFocus={() => setIdadeTouched(true)}
                            placeholder='Idade'
                            errorMessage={!idadeError.isValid ? idadeError.message : ''}
                            iconName='numeric-1'
                            keyboardType="numeric"
                            value={idadePet}
                        />
                        <CustomInput
                            onChangeText={(dado: SetStateAction<string>) => setRaca(dado)}
                            onFocus={() => setRacaTouched(true)}
                            placeholder='Raça'
                            errorMessage={!racaError.isValid ? racaError.message : ''}
                            iconName='paw'
                            value={raca}
                        />

                            <Text style={styles.vacinaTitle}>Vacinas</Text>
                           

                            <FlatList
                                data={vacinas}
                                style={{flex: 1 }}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <CustomInput
                                        onChangeText={(valor) => {
                                            setVacinas(prev => 
                                                prev.map((vacina, i) => 
                                                    i === index ? { ...vacina, nome: valor } : vacina
                                                )
                                            );
                                        }}
                                        placeholder={`Vacina ${index + 1}`}
                                        iconName='medical-bag'
                                        value={item.nome}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={addInput} style={{backgroundColor: Colors.laranja, borderRadius: 5, alignItems: 'center', marginBottom: 40}}>
                                <View>
                                    <Icon source='plus' size={50} color="white"/>
                                </View>
                            </TouchableOpacity>
                            </View>
                    </View>
            </ImageBackground>
    )
}


const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
        padding: 10
    },
    imagesPet: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        flexGrow: 1,
        alignItems: 'center'
    },
    profilePic: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 75,
        backgroundColor: '#fd7f36c2'
    },

    picture: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fd7f365b'
    },
    inputGroup: {
        flex: 1
    },

    
    label: {
        fontFamily: 'NunitoBold',
        fontSize: 16,
        color: Colors.preto,
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.amarelo,
        paddingLeft: 20,
        height: 50,
        backgroundColor: 'white',
        fontFamily: 'NunitoMedium',
        fontSize: 16,
        color: Colors.preto,
    },
    vacinaTitle: {

        fontSize: 32,
        fontFamily: 'NunitoBold',
        color: Colors.laranjaVariado
    }
 
});