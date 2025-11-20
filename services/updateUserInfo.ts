import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';
import { RootUser } from '@/interfaces/user';

export default async function updateUser(userData: Partial<RootUser>, imageUri?: string, imageType?: string): Promise<{ success: boolean; message: string }> {
    try {
        const bearerToken = await AsyncStorage.getItem('bearer');
        let data: any = userData;
        let headers = {
            Authorization: "Bearer " + bearerToken
        };

        if (imageUri) {
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                formData.append(key, (userData as any)[key]);
            });
            formData.append('img', {
                uri: imageUri,
                type: imageType || 'image/jpeg',
                name: 'profile.jpg'
            } as any);
            data = formData;
            (headers as any)['Content-Type'] = 'multipart/form-data';
        }

        const response = await axios.patch(`${API_BASE_URL}/users/update_me/`, data, {
            headers
        });
        return {
            success: true,
            message: 'Perfil atualizado com sucesso!'
        };
    } catch (error: any) {
        console.error('Erro ao atualizar usuário:', error);
        console.error('Response data:', error.response?.data);
        const message = error.response?.data?.detail || error.response?.data?.message || 'Não foi possível atualizar o perfil. Tente novamente.';
        return {
            success: false,
            message
        };
    }
}

export async function updateUserImage(imageUri: string): Promise<{ success: boolean; message: string }> {
    try {
        const bearerToken = await AsyncStorage.getItem('bearer');
        const formData = new FormData();
        formData.append('img', {
            uri: imageUri,
            type: 'image/jpeg', // ou o tipo correto
            name: 'profile.jpg' // nome do arquivo
        } as any);

        const response = await axios.patch(`${API_BASE_URL}/users/update_me/`, formData, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return {
            success: true,
            message: 'Imagem atualizada com sucesso!'
        };
    } catch (error: any) {
        console.error('Erro ao atualizar imagem:', error);
        const message = error.response?.data?.img?.[0] || error.response?.data?.detail || 'Erro ao atualizar imagem.';
        return {
            success: false,
            message
        };
    }
}