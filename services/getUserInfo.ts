import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default async function getUser() {
  try {
    const bearerToken = await AsyncStorage.getItem('bearer');
    const response = await axios.get(`${API_BASE_URL}/auth/users/me/`, {
      headers: {
        Authorization: "Bearer " + bearerToken
      }
    });
    return response.data;
  } catch (error) {
    console.warn("Token de seção inválido", error);
    throw error; // Re-throw para tratamento superior
  }
}