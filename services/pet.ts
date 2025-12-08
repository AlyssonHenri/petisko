import axios from 'axios';
import { IPet, ReceivedPet, RootPet } from '@/interfaces/pet';
import { API_BASE_URL } from '@/constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerPet(id: number, pet: RootPet) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken,
        'Content-Type': 'multipart/form-data'

    };
    const formData = new FormData();

    if (pet.sexo === 'macho') {
        pet.sexo = 'm'
    } else {
        pet.sexo = 'f'
    }

    formData.append("name", pet.name);
    formData.append("age", pet.age);
    formData.append("sexo", pet.sexo.toLocaleLowerCase());
    formData.append("raca", pet.raca);
    console.log(pet.vacinas)
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

    console.log(formData)


    try {

        const response = await axios.post(`${API_BASE_URL}/users/${id}/add/`, formData, {
            headers: headers
        });

        if (response.data) {
            return { success: true }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Headers:", error.response?.headers);
            console.log("Data:", error.response?.data);
        } else {
            console.log("Unexpected error:", error);
        }
        return { success: false, data: error.response?.data }

        throw error; // Re-throw para que o componente possa tratar
    }
}

export async function deletePet(idPet: string) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken,
        'Content-Type': 'multipart/form-data'
    };

    try {
        const response = await axios.delete(`${API_BASE_URL}/pets/${idPet}/`, {
            headers: headers
        });

        if (response.data) {
            return { success: true }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Headers:", error.response?.headers);
            console.log("Data:", error.response?.data);
        } else {
            console.log("Unexpected error:", error);
        }
        return { success: false, data: error.response?.data }

        throw error; // Re-throw para que o componente possa tratar
    }

}

export async function editPet(pet: IPet) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken,
        'Content-Type': 'multipart/form-data'

    };
    const formData = new FormData();

    if (pet.sexo === 'macho') {
        pet.sexo = 'm'
    } else {
        pet.sexo = 'f'
    }

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
    console.log(formData)

    try {
        const response = await axios.patch(`${API_BASE_URL}/pets/${pet.id}/`, formData, {
            headers: headers
        });

        if (response.data) {
            return { success: true }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Headers:", error.response?.headers);
            console.log("Data:", error.response?.data);
        } else {
            console.log("Unexpected error:", error);
        }
        return { success: false, data: error.response?.data }

        throw error; // Re-throw para que o componente possa tratar
    }
}



export async function getPets(): Promise<{ success: boolean, data?: ReceivedPet[] } | undefined> {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken
    };


    try {

        const response = await axios.get(`${API_BASE_URL}/pets/`, {
            headers: headers
        });
        if (response.data) {
            return { success: true, data: response.data }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Headers:", error.response?.headers);
            console.log("Data:", error.response?.data);
        } else {
            console.log("Unexpected error:", error);
        }
        return { success: false, data: error.response?.data }
    }
}


