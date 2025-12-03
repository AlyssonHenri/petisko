import { image } from "@/constants/bg";
import Colors from "@/constants/Colors";
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Button, } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState, useMemo, useCallback } from "react";
import CustomInput from "@/components/generic_input";
import { Icon } from 'react-native-paper';
import { IPet, Vacina } from '@/interfaces/pet';
import { RootUser } from "@/interfaces/user";
import { useFocusEffect } from "@react-navigation/native";
import getUser from "@/services/getUserInfo";
import { editPet } from "@/services/pet";
import { SelectSwitch } from "@/components/select-switch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/components/header";
import { AddButton } from "@/components/addButton"
import { API_BASE_URL } from '@/constants/ApiConfig';
import PopupModal from "@/components/PopupModal";

export default function CreatePet() {
    const router = useRouter();
    const [idPet, setIdPet] = useState('');
    const [nomePet, setNomePet] = useState('');
    const [idadePet, setIdadePet] = useState('');
    const [raca, setRaca] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [imagesInit, setImagesInit] = useState<string[]>([]);
    const [nomeTouched, setNomeTouched] = useState(false);
    const [idadeTouched, setIdadeTouched] = useState(false);
    const [racaTouched, setRacaTouched] = useState(false);
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '', type: 'error' as 'success' | 'error' });
    const params = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            setIdPet('')
            setNomePet('')
            setIdadePet('')
            setRaca('')
            setSexo('m')
            setVacinas([])
            setImages([])
            setImagesInit([])
            setNomeTouched(false);
            setIdadeTouched(false);
            setRacaTouched(false);

            const petData: IPet = params.data ? JSON.parse(params.data as string) : null;
            
            if (!petData) {
                setModalInfo({ title: 'Erro', message: 'Nenhum dado de pet encontrado.', type: 'error' });
                setModalVisible(true);
                return;
            }

            async function fetchUser() {
                const res = await getUser();
                const user = res?.data?.user;
                setUserInfo(user!);
            }
            fetchUser();

            setIdPet(petData.id)
            setNomePet(petData.name)
            setIdadePet(String(petData.age))
            setRaca(petData.raca)
            setSexo(petData.sexo === 'm' ? 'macho' : 'femea')
            setVacinas(petData.vacinas || [])
            setImages([petData.img1, petData.img2, petData.img3, petData.img4])
            setImagesInit([petData.img1, petData.img2, petData.img3, petData.img4])
            setNomeTouched(false);
            setIdadeTouched(false);
            setRacaTouched(false);
            
            return () => {};
        }, [params.data])
    );

    if (!params.data) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Erro: Nenhum dado de pet encontrado.</Text>
                <Button title="Voltar" onPress={() => router.back()} />
                <PopupModal
                    visible={modalVisible}
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onClose={() => {
                        setModalVisible(false);
                        router.back();
                    }}
                    type={modalInfo.type}
                />
            </View>
        );
    }

    const pickImage = async (index: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setModalInfo({ title: 'Permissão necessária', message: 'Precisamos de permissão para acessar suas fotos!', type: 'error' });
            setModalVisible(true);
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

    function removeVacina(id: string): void {
        setVacinas(prev => prev.filter(vacina => vacina.id !== id));
    }

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalInfo.type === 'success') {
            router.push('/profile');
        }
    };

    async function handleSave(pet: IPet): Promise<void> {
        try {
            const res: any = await editPet(pet);
            if (res.success){
                setModalInfo({ title: 'Sucesso', message: 'Pet editado com sucesso!', type: 'success' });
                setModalVisible(true);
            } else {
                setModalInfo({ title: 'Erro', message: res.message || 'Não foi possível editar o pet.', type: 'error' });
                setModalVisible(true);
            }
        } catch (error) {
            setModalInfo({ title: 'Erro', message: 'Ocorreu um erro ao salvar as alterações.', type: 'error' });
            setModalVisible(true);
        }
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
            style={{ flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground source={image} style={styles.imageBackground}>

                <Header
                    title="Editar Pet"
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
                                                <Image source={{ uri: `${API_BASE_URL}${images[index]}` }} style={styles.imgFill} />
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
                                    <View key={item.id} style={styles.vaccineInputContainer}>
                                        <View style={{flex: 1}}>
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
                                        <TouchableOpacity onPress={() => removeVacina(item.id)} style={styles.deleteButton}>
                                            <Icon source="trash-can-outline" size={24} color={Colors.vermelho} />
                                        </TouchableOpacity>
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
                            onPress={() => handleSave({
                                id: idPet,
                                name: nomePet,
                                age: idadePet,
                                img1: images[0] === imagesInit[0] ? '' : images[0] ,
                                img2: images[1] === imagesInit[1] ? '' : images[1],
                                img3: images[2] === imagesInit[2] ? '' : images[2],
                                img4: images[3] === imagesInit[3] ? '' : images[3],
                                sexo: sexo,
                                raca: raca,
                                vacinas: vacinas
                            })}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.registerButtonText}>Editar Pet</Text>
                        </TouchableOpacity>

                        <View style={{ height: 40 }} />
                    </View>
                </ScrollView> 
                <PopupModal
                    visible={modalVisible}
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onClose={handleModalClose}
                    type={modalInfo.type}
                />
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
    vaccineInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5
    },
    deleteButton: {
        padding: 8,
        borderRadius: 20,
        marginLeft: 8,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});