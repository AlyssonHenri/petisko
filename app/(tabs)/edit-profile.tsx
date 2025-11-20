import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { RootUser } from "@/interfaces/user";
import getUser from "@/services/getUserInfo";
import updateUser, { updateUserImage } from "@/services/updateUserInfo";
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from "react-native";

export default function EditProfileScreen() {
    const image = require('../../assets/images/background.png');
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<RootUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados para os campos editáveis
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [imageType, setImageType] = useState('');

    // Estados para dropdowns
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [stateList, setStateList] = useState<{ label: string; value: string }[]>([]);
    const [cityList, setCityList] = useState<{ label: string; value: string }[]>([]);

 
    useEffect(() => {
        async function loadData() {
            try {
                const user = await getUser();
                if (!user) {
                    setLoading(false);
                    return;
                }

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
                Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const pickImage = async () => {
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
            setProfileImage(result.assets[0].uri);
            setImageType(result.assets[0].type || 'image/jpeg');
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
                Alert.alert('Aviso', 'Nenhuma alteração foi feita.');
                setSaving(false);
                return;
            }

            if (!userInfo) {
                Alert.alert('Erro', 'Informações do usuário não carregadas.');
                return;
            }

            let result;
            if (Object.keys(changes).length === 0 && imageChanged) {
                result = await updateUserImage(profileImage);
            } else {
                result = await updateUser(changes, imageChanged ? profileImage : undefined, imageType);
            }

            if (result.success) {
                Alert.alert('Sucesso', result.message, [
                    {
                        text: 'OK',
                        onPress: () => router.push('/profile')
                    }
                ]);
            } else {
                Alert.alert('Erro', result.message);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ImageBackground source={image} style={styles.imageBackground}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.laranjaVariado} />
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground source={image} style={styles.imageBackground}>
            <ScrollView style={styles.overlayContent}>
                <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color={Colors.preto} />
                </TouchableOpacity>

                <View style={styles.topPage}>
                    <Text style={styles.title}>Editar Perfil</Text>

                    <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
                        <Image
                            style={styles.profilePic}
                            source={profileImage
                                ? { uri: profileImage }
                                : {
                                    uri: "https://img.freepik.com/vetores-premium/icone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
                                }
                            }
                        />
                        <View style={styles.cameraIconContainer}>
                            <FontAwesome name="camera" size={20} color={Colors.creme} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.changePhotoText}>Toque para alterar a foto</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Digite seu nome"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome de usuário</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Digite seu username"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Estado</Text>
                        <DropDownPicker
                            open={openState}
                            value={state}
                            items={stateList}
                            setOpen={setOpenState}
                            setValue={setState}
                            setItems={setStateList}
                            style={styles.input}
                            textStyle={styles.pickerInput}
                            listMode="MODAL"
                            placeholder="Selecione seu estado"
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cidade</Text>
                        <DropDownPicker
                            open={openCity}
                            value={city}
                            items={cityList}
                            setOpen={setOpenCity}
                            setValue={setCity}
                            setItems={setCityList}
                            style={styles.input}
                            textStyle={styles.pickerInput}
                            listMode="MODAL"
                            disabled={!state}
                            placeholder="Selecione sua cidade"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.button, styles.saveButton]}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color={Colors.creme} />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Salvar Alterações
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
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
        backgroundColor: 'transparent',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    topPage: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontFamily: 'NunitoBlack',
        fontSize: 32,
        color: Colors.preto,
        marginBottom: 20,
    },
    profilePicContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: Colors.laranjaVariado,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Colors.laranjaVariado,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.creme,
    },
    changePhotoText: {
        fontFamily: 'NunitoMedium',
        fontSize: 14,
        color: Colors.preto,
        opacity: 0.7,
    },
    formContainer: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        backgroundColor: 'transparent',
    },
    inputGroup: {
        marginBottom: 20,
        backgroundColor: 'transparent',
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
    pickerInput: {
        fontFamily: 'NunitoMedium',
        fontSize: 16,
        color: Colors.preto,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 15,
        backgroundColor: 'transparent',
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    saveButton: {
        backgroundColor: Colors.laranjaVariado,
    },
    buttonText: {
        fontFamily: 'NunitoBold',
        fontSize: 18,
        color: Colors.creme,
    },
});
