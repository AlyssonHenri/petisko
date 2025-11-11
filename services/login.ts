import axios from 'axios';
import { UserLogin } from '@/interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function saveBearerToken(token: string){
    try {
        await AsyncStorage.setItem('bearer', token)
    } catch (e) {
        console.log('foi nao')
  }
} 

export default async function loginUser(user: UserLogin){
    const response = await axios.post('http://127.0.0.1:8088/auth/jwt/create/', {username: user.username, password: user.password})
    
    saveBearerToken(response.data.access)
    return response.data.access;
}

