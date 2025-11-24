import axios from 'axios';
import { UserLogin } from '@/interfaces/user';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default async function registerPet(id, pet: petRegister) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/`{ id }`/add/`, {
            username: user.username,
            password: user.password
        });

        await saveBearerToken(response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error; // Re-throw para que o componente possa tratar
    }
}