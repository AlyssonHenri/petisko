import { image } from "@/constants/bg";
import Colors from "@/constants/Colors";
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState, useMemo, useCallback } from "react";
import CustomInput from "@/components/generic_input";
import { Icon } from 'react-native-paper';
import { rootPet, Vacina } from '@/interfaces/pet';
import { RootUser } from "@/interfaces/user";
import { useFocusEffect } from "@react-navigation/native";
import getUser from "@/services/getUserInfo";
import registerPet from "@/services/pet";
import { SelectSwitch } from "@/components/select-switch";
import { useRouter } from "expo-router";
import { Header } from "@/components/header";
import { AddButton } from "@/components/addButton"

export default function CreatePet() {
    const router = useRouter();
    
    const [nomePet, setNomePet] = useState('');
    const [idadePet, setIdadePet] = useState('');
    const [raca, setRaca] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const [nomeTouched, setNomeTouched] = useState(false);
    const [idadeTouched, setIdadeTouched] = useState(false);
    const [racaTouched, setRacaTouched] = useState(false);
    
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);

    const resetForm = () => {
        setNomePet('');
        setIdadePet('');
        setRaca('');
        setSexo('macho');
        setVacinas([]);
        setImages([]);
        setNomeTouched(false);
        setIdadeTouched(false);
        setRacaTouched(false);
    };

    useFocusEffect(
        useCallback(() => {
            resetForm();
            async function fetchUser() {
                const user = await getUser();
                setUserInfo(user);
            }
            fetchUser();
            return () => {};
        }, [])
    );

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
        }
    };

    function addInput(): void {
        const novaVacina = {
            nome: '',
            id: Date.now().toString()
        };
        setVacinas(prev => [...prev, novaVacina]);
    }

    function handleCadPet(pet: rootPet): void {
        registerPet(userInfo?.id!, pet);
    }

    const validateField = (field: string, value: string, touched: boolean) => {
        if (!touched) return { isValid: false, message: '' };
        switch (field) {
            case 'nome':
                if (!value.trim()) return { isValid: false, message: 'Nome é obrigatório' };
                if (value.trim().length < 2) return { isValid: false, message: 'Mínimo 2 caracteres' };
                break;
            case 'idade':
                if (!value.trim()) return { isValid: false, message: 'Idade é obrigatória' };
                break;
            case 'raca':
                if (!value.trim()) return { isValid: false, message: 'Raça é obrigatória' };
                break;
        }
        return { isValid: true, message: '' };
    };

    const nameError = useMemo(() => validateField('nome', nomePet, nomeTouched), [nomePet, nomeTouched]);
    const idadeError = useMemo(() => validateField('idade', idadePet, idadeTouched), [idadePet, idadeTouched]);
    const racaError = useMemo(() => validateField('raca', raca, racaTouched), [raca, racaTouched]);

    const isFormValid = useMemo(() =>
        (nameError.isValid || !nomeTouched) &&
        (idadeError.isValid || !idadeTouched) &&
        (racaError.isValid || !racaTouched) &&
        nomePet.length > 0 && raca.length > 0 && idadePet.length > 0
        , [nameError, idadeError, racaError, nomePet, raca, idadePet]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground source={image} style={styles.imageBackground}>

                <Header
                    title="Novo Pet"
                    onBackPress={() => router.push('/profile')}
                />
                <ScrollView 
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.imagesContainer}>
                        <ScrollView 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.imagesHorizontalScroll}
                        >
                            {[0, 1, 2, 3].map((index) => {
                                const isMain = index === 0;
                                const picStyle = [
                                    styles.pictureBase, 
                                    isMain ? styles.pictureMain : styles.pictureSecondary
                                ];
                                
                                return (
                                    <TouchableOpacity key={index} onPress={() => pickImage(index)} style={styles.imageWrapper}>
                                        <View style={picStyle}>
                                            {images[index] ? (
                                                <Image source={{ uri: images[index] }} style={styles.imgFill} />
                                            ) : (
                                                <Icon 
                                                    source={isMain ? 'camera-plus' : 'plus'} 
                                                    size={isMain ? 32 : 24} 
                                                    color="white" 
                                                />
                                            )}
                                        </View>
                                        {isMain && <Text style={styles.mainLabel}>Principal</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.switchWrapper}>
                            <SelectSwitch
                                field_1='macho'
                                field_2='femea'
                                selected={sexo}
                                onSelect={setSexo}
                            />
                        </View>

                        <CustomInput
                            onChangeText={setNomePet}
                            onFocus={() => setNomeTouched(true)}
                            placeholder='Nome do Pet'
                            errorMessage={!nameError.isValid ? nameError.message : ''}
                            iconName='paw'
                            value={nomePet}
                        />

                        <View style={styles.rowInputs}>
                            <View style={{ flex: 0.4 }}>
                                <CustomInput
                                    onChangeText={setIdadePet}
                                    onFocus={() => setIdadeTouched(true)}
                                    placeholder='Idade'
                                    errorMessage={!idadeError.isValid ? idadeError.message : ''}
                                    iconName='calendar'
                                    keyboardType="numeric"
                                    value={idadePet}
                                />
                            </View>
                            <View style={{ flex: 0.58 }}>
                                <CustomInput
                                    onChangeText={setRaca}
                                    onFocus={() => setRacaTouched(true)}
                                    placeholder='Raça'
                                    errorMessage={!racaError.isValid ? racaError.message : ''}
                                    iconName='dog'
                                    value={raca}
                                />
                            </View>
                        </View>

                        <Text style={styles.vacinaTitle}>Carteira de Vacinação</Text>

                        <View style={styles.vaccineContainer}>
                            <ScrollView
                                style={styles.vaccineScrollView}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                            >
                                {vacinas.map((item, index) => (
                                    <View key={item.id} style={{ marginBottom: 10 }}>
                                        <CustomInput
                                            onChangeText={(valor) => {
                                                setVacinas(prev =>
                                                    prev.map((vacina, i) =>
                                                        i === index ? { ...vacina, nome: valor } : vacina
                                                    )
                                                );
                                            }}
                                            placeholder={`Nome da vacina ${index + 1}`}
                                            iconName='needle'
                                            value={item.nome}
                                        />
                                    </View>
                                ))}
                                {vacinas.length === 0 && (
                                    <Text style={styles.emptyText}>Nenhuma vacina adicionada.</Text>
                                )}
                            </ScrollView>
                        </View>

                        <AddButton
                            title='Adicionar Vacina'
                            onPress={addInput}
                        />

                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                !isFormValid && styles.registerButtonDisabled
                            ]}
                            onPress={() => handleCadPet({
                                name: nomePet,
                                age: idadePet,
                                img1: images[0],
                                img2: images[1],
                                img3: images[2],
                                img4: images[3],
                                sexo: sexo,
                                raca: raca,
                                vacinas: vacinas
                            })}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.registerButtonText}>Cadastrar Pet</Text>
                        </TouchableOpacity>

                        <View style={{ height: 40 }} />
                    </View>
                </ScrollView> 

            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'NunitoBold',
        color: Colors.preto,
        fontWeight: 'bold',
    },
    content: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    imagesContainer: {
        marginBottom: 25,
        height: 110,
    },
    imagesHorizontalScroll: {
        alignItems: 'center',
        paddingHorizontal: 5,
        gap: 15,
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictureBase: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    pictureMain: {
        width: 85,
        height: 85,
        backgroundColor: '#fd7f36c2',
    },
    pictureSecondary: {
        width: 75,
        height: 75,
        backgroundColor: '#fd7f3690',
    },
    imgFill: {
        width: "100%",
        height: "100%",
        borderRadius: 18,
    },
    mainLabel: {
        marginTop: 4,
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    formContainer: {
        flex: 1,
    },
    switchWrapper: {
        marginTop: -10,
        marginBottom: 10,
        alignItems: 'center',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    vacinaTitle: {
        fontSize: 22,
        fontFamily: 'NunitoBold',
        color: Colors.laranjaVariado || '#E4A985',
        marginBottom: 15, 
        marginTop: 10,    
        textAlign: 'center',
    },
    vaccineContainer: {
        marginBottom: 0,
    },
    vaccineScrollView: {
        maxHeight: 250,
        width: '100%',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    registerButton: {
        backgroundColor: Colors.laranja,
        paddingVertical: 18, 
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    registerButtonDisabled: {
        backgroundColor: '#A0A0A0',
        elevation: 0,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});