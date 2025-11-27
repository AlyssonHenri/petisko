import axios from 'axios';
import { rootPet } from '@/interfaces/pet';
import { API_BASE_URL } from '@/constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function registerPet(id: number, pet: rootPet) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken,
        'Content-Type': 'multipart/form-data'

    };
    const formData = new FormData();

    formData.append("name", pet.name);
    formData.append("age", pet.age);
    formData.append("sexo", pet.sexo.toLocaleLowerCase());
    formData.append("raca", pet.raca);
    formData.append("vacinas", JSON.stringify(pet.vacinas));
    const imagens = [pet.img1, pet.img2, pet.img3, pet.img4];
    imagens.forEach((img, index) => {
        if (img) {
            formData.append(`img${index + 1}`, {
                uri: img,
                name: `img${index + 1}.jpg`,
                type: "image/jpeg"
            } as any);
        }
    });


    try {
        console.log("URL:", `${API_BASE_URL}/users/${id}/add/`);

        const response = await axios.post(`${API_BASE_URL}/users/${id}/add/`, formData, {
            headers: headers
        });

        if (response.data) {
            return response
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Headers:", error.response?.headers);
            console.log("Data:", error.response?.data);
        } else {
            console.log("Unexpected error:", error);
        }
        throw error; // Re-throw para que o componente possa tratar
    }
}
