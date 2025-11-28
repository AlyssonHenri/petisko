import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';
import { RootUser } from '@/interfaces/user';
import { IPet, RootPet } from '@/interfaces/pet';

export async function getUserPets(bt: string | null, userId: number): Promise<IPet[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/pets`, {
      headers: {
        Authorization: "Bearer " + bt
      }
    }
    );
    return response.data

  } catch (error: any) {
    console.log(error.response)
    throw error;
  }

}

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
      const petList: IPet[] = await getUserPets(bearerToken, response.data.id)
      const user: RootUser = response.data;


      return { success: true, data: { user, petList } };

    } catch (error) {
      aTry++
      console.log('Tentativa: ', aTry)
      if (aTry >= maxTry) {
        console.warn("Falhou após 3 tentativas");
        return { success: false, data: {} };

        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 500));


    }

  }

}