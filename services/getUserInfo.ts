import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default async function getUser() {
  const maxTry = 3
  let aTry = 1
  while (aTry != maxTry) {
    try {
      const bearerToken = await AsyncStorage.getItem('bearer');
      const response = await axios.get(`${API_BASE_URL}/auth/users/me/`, {
        headers: {
          Authorization: "Bearer " + bearerToken
        }
      });
      return response.data;
    } catch (error) {
      aTry++
      console.log('Tentativa: ', aTry)
      if (aTry >= maxTry) {
        console.warn("Falhou após 3 tentativas");
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 500));


    }

  }

}