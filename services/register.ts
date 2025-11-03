import axios from 'axios';
import { IUser } from '@/interfaces/user';
export default async function registerUser(user: IUser): Promise<void> {
    const response = await axios.post('http://127.0.0.1:8000/users/',
        user);
    console.log(response)
    //return response.data.data;
}