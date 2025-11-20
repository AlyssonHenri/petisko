import axios from 'axios';
import { RootUser, UserRegister } from '@/interfaces/user';
import { API_BASE_URL } from '@/constants/ApiConfig';


export default async function registerUser(user: UserRegister): Promise<{ success: boolean; data: RootUser | any }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/users/`, user);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, data: error.response.data };
  }
}