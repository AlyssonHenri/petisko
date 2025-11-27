import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';

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