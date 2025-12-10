import axios from 'axios';
import { UserLogin } from '@/interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';

export async function saveBearerToken(token: string) {
  try {
    await AsyncStorage.setItem('bearer', token);
  } catch (e) {
    console.log('Erro ao salvar token:', e);
  }
}

export default async function loginUser(user: UserLogin) {
  console.log(user)
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/jwt/create/`, {
      username: user.username,
      password: user.password
    });

    await saveBearerToken(response.data.access);
    return { success: true, data: response.data.access };
  } catch (error: any) {
    return { success: false, data: error.response?.data }; // Re-throw para que o componente possa tratar
  }
}

