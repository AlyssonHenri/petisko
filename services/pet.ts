import axios from 'axios';
import { rootPet } from '@/interfaces/pet';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default async function registerPet(id, pet: rootPet) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${id}/add/`, {
            name: pet.name,
            birthdate: pet.birthdate,
            img1: pet.img1,
            img2: pet.img2,
            img3: pet.img3,
            img4: pet.img4,
            sexo: pet.sexo,
            raca: pet.raca,
            vacina: pet.vacina
        });

        if (response.ok) {
            return response
        }
    } catch (error) {
        console.error('Erro no cadastrar pet:', error);
        throw error; // Re-throw para que o componente possa tratar
    }
}