import axios from 'axios';
import { UserLogin } from '@/interfaces/user';
export default async function loginUser(user: UserLogin){
    console.log(user)
    const response = await axios.post('http://127.0.0.1:8088/auth/jwt/create/', {username: user.username, password: user.password})
    console.log(response.data)
    return response.data.access;
}