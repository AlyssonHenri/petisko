import axios from 'axios';
import { IUser } from '@/interfaces/user';
export default async function registerUser(user: IUser): Promise<void> {
    const response = await axios.post('http://127.0.0.1:8088/auth/users/',
        user);
    //return response.data.data;
}

