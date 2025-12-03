import { image } from "@/constants/bg";
import Colors from "@/constants/Colors";
import { RootUser } from "@/interfaces/user";
import getUser from "@/services/getUserInfo";
import updateUser, { updateUserImage } from "@/services/updateUserInfo";
import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import { Icon } from 'react-native-paper';
import { Header } from "@/components/header";
import CustomInput from "@/components/generic_input";
import PopupModal from "@/components/PopupModal";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    View,
    KeyboardAvoidingView,
    Platform
} from "react-native";

export default function EditProfileScreen() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [imageType, setImageType] = useState('');
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [stateList, setStateList] = useState<{ label: string; value: string }[]>([]);
    const [cityList, setCityList] = useState<{ label: string; value: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '', type: 'error' as 'success' | 'error' });

    useFocusEffect(useCallback(() => {
        setUserInfo(null);
        setName('');
        setUsername('');
        setState('');
        setCity('');
        setProfileImage('');

        async function loadData() {
            try {
                const data = await getUser();
                
                if (!data) {
                    setLoading(false);
                    setModalInfo({ title: 'Erro', message: 'Não foi possível carregar os dados do perfil.', type: 'error' });
                    setModalVisible(true);
                    return;
                }
                const user = data.data.user!;
                setUserInfo(user);
                setName(user.name || '');
                setUsername(user.username || '');
                setProfileImage(user.img || '');

                const userStateName = user.state || '';
                const userCityName = user.city || '';

                const statesApi = await getStates();
                const formattedStates = statesApi.map(state => ({
                    label: state.name,
                    value: state.state_code,
                }));
                setStateList(formattedStates);
                
                const initialState = formattedStates.find(s => s.label === userStateName);

                if (initialState) {
                    setState(initialState.value);
                    const formattedCities = await getCities(initialState.label);
                    const initialCity = formattedCities.find(c => c.value === userCityName);

                    if (initialCity) {
                        setCity(initialCity.value);
                    }
                }
            } catch (error) {
                console.error("Falha ao carregar dados:", error);
                setModalInfo({ title: 'Erro', message: 'Não foi possível carregar os dados do perfil.', type: 'error' });
                setModalVisible(true);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []));

    const pickImage = async () => {
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
            setProfileImage(result.assets[0].uri);
        }
    };

    async function getCities(value: string) {
        const citiesList = await getCitiesFromState(value);
        const formatted = citiesList.map(city => ({
            label: city,
            value: city
        }));
        setCityList(formatted);
        return formatted;
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const selectedState = stateList.find(s => s.value === state);
            const stateName = selectedState ? selectedState.label : state;

            const changes: Partial<RootUser> = {};
            if (name !== (userInfo?.name || '')) changes.name = name;
            if (username !== (userInfo?.username || '')) changes.username = username;
            if (stateName !== (userInfo?.state || '')) changes.state = stateName;
            if (city !== (userInfo?.city || '')) changes.city = city;

            const imageChanged = profileImage !== (userInfo?.img || '');

            if (Object.keys(changes).length === 0 && !imageChanged) {
                setModalInfo({ title: 'Aviso', message: 'Nenhuma alteração foi feita.', type: 'error' });
                setModalVisible(true);
                setSaving(false);
                return;
            }

            if (!userInfo) {
                setModalInfo({ title: 'Erro', message: 'Informações do usuário não carregadas.', type: 'error' });
                setModalVisible(true);
                return;
            }

            let result;
            if (imageChanged) {
                result = await updateUserImage(profileImage);
            }
            result = await updateUser(changes, undefined, imageType);

            if (result.success) {
                setModalInfo({ title: 'Sucesso', message: result.message, type: 'success' });
                setModalVisible(true);
            } else {
                setModalInfo({ title: 'Erro', message: result.message, type: 'error' });
                setModalVisible(true);
            }
        } catch (error) {
            setModalInfo({ title: 'Erro', message: 'Não foi possível salvar as alterações.', type: 'error' });
            setModalVisible(true);
        } finally {
            setSaving(false);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalInfo.type === 'success') {
            router.push('/profile');
        }
    };

    if (loading) {
        return (
            <ImageBackground source={image} style={styles.imageBackground}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.laranja} />
                </View>
            </ImageBackground>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground source={image} style={styles.imageBackground}>
                
                <Header 
                    title="Editar Perfil" 
                    onBackPress={() => router.push('/profile')} 
                />

                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.topPage}>
                        <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
                            <View style={styles.profilePicWrapper}>
                                <Image
                                    style={styles.profilePic}
                                    source={profileImage
                                        ? { uri: profileImage }
                                        : { uri: "https://img.freepik.com/vetores-premium/icone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana_157943-15752.jpg?semt=ais_hybrid&w=740&q=80" }
                                    }
                                />
                                <View style={styles.cameraIconContainer}>
                                    <Icon source="camera" size={20} color={Colors.creme} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Alterar foto</Text>
                    </View>

                    <View style={styles.formContainer}>
                        
                        <CustomInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Nome Completo"
                            iconName="account"
                        />

                        <CustomInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Nome de Usuário"
                            iconName="at"
                            autoCapitalize="none"
                        />

                        <View style={styles.dropdownWrapper}>
                            <View style={styles.iconContainer}>
                                <Icon source="map-marker" size={24} color="#555" />
                            </View>
                            <View style={{flex: 1}}>
                                <DropDownPicker
                                    open={openState}
                                    value={state}
                                    items={stateList}
                                    setOpen={setOpenState}
                                    setValue={setState}
                                    setItems={setStateList}
                                    style={styles.dropdownStyle}
                                    textStyle={styles.dropdownText}
                                    placeholder="Selecione seu estado"
                                    listMode="MODAL"
                                    onChangeValue={(value) => {
                                        if (value) {
                                            const selectedState = stateList.find(item => item.value === value);
                                            const stateName = selectedState!.label;
                                            setCity('');
                                            getCities(stateName);
                                        }
                                    }}
                                />
                            </View>
                        </View>

                        <View style={[styles.dropdownWrapper, { zIndex: -1 }]}>
                            <View style={styles.iconContainer}>
                                <Icon source="city" size={24} color="#555" />
                            </View>
                            <View style={{flex: 1}}>
                                <DropDownPicker
                                    open={openCity}
                                    value={city}
                                    items={cityList}
                                    setOpen={setOpenCity}
                                    setValue={setCity}
                                    setItems={setCityList}
                                    style={styles.dropdownStyle}
                                    textStyle={styles.dropdownText}
                                    placeholder="Selecione sua cidade"
                                    listMode="MODAL"
                                    disabled={!state}
                                />
                            </View>
                        </View>

                        <View style={{ height: 20 }} />

                        <TouchableOpacity
                            onPress={handleSave}
                            style={styles.saveButton}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    topPage: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    profilePicContainer: {
        marginBottom: 10,
    },
    profilePicWrapper: {
        width: 140,
        height: 140,
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
    },
    profilePic: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.laranjaVariado,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        elevation: 4,
    },
    changePhotoText: {
        fontFamily: 'NunitoBold',
        fontSize: 14,
        color: Colors.preto,
        opacity: 0.6,
    },
    formContainer: {
        flex: 1,
    },
    dropdownWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 15,
        marginBottom: 10,
        minHeight: 56,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 5,
                shadowColor: '#000',
            },
        }),
    },
    dropdownStyle: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    dropdownText: {
        fontFamily: 'NunitoMedium',
        fontSize: 16,
        color: '#333',
    },
    iconContainer: {
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: Colors.laranja,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    saveButtonText: {
        fontFamily: 'NunitoBold',
        fontSize: 18,
        color: 'white',
    },
});