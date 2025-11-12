import axios from 'axios';
import { UserRegister } from '@/interfaces/user';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default async function registerUser(user: UserRegister): Promise<void> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/users/`, user);
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
}