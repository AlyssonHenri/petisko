import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getUser(){
    try{
        const bearerToken = await AsyncStorage.getItem('bearer');
        const response = await axios.get('http://127.0.0.1:8088/auth/users/me/', {
            headers: {
                Authorization: "Bearer " + bearerToken
            }
        })
        return response.data
    } catch{
        console.warn("Token de seção inválido")
    }
}