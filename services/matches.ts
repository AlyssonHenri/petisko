import { API_BASE_URL } from "@/constants/ApiConfig"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { IMatch, IMatchWithPetDetails } from "@/interfaces/match"
import { ReceivedPet } from "@/interfaces/pet"

export async function sendMatch(petPrincipal: string, petMatch: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    console.log(petMatch)
    console.log(petPrincipal)
    let headers = {
        Authorization: "Bearer " + bearerToken
    }


    try {

        const response = await axios.post(`${API_BASE_URL}/pets/${petPrincipal}/matches/`, { petPrincipal: petPrincipal, petMatch: petMatch }, {
            headers: headers
        })
        if (response.data) {
            return { success: true, data: response.data }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}



export async function sendUnmatch(petPrincipal: string, petMatch: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    console.log(petMatch)
    console.log(petPrincipal)
    let headers = {
        Authorization: "Bearer " + bearerToken
    }


    try {

        const response = await axios.post(`${API_BASE_URL}/pets/${petPrincipal}/blocked/`, { petPrincipal: petPrincipal, petBlock: petMatch }, {
            headers: headers
        })
        if (response.data) {
            return { success: true, data: response.data }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}


export async function getMatches(petPrincipal: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }


    try {

        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipal}/matches/`, {
            headers: headers
        })
        if (response.data) {
            return { success: true, data: response.data }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}

export async function getBlocks(petPrincipal: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }


    try {

        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipal}/blocked/`, {
            headers: headers
        })
        if (response.data) {
            return { success: true, data: response.data }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}

async function getPetDetails(petId: number): Promise<ReceivedPet | null> {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/pets/${petId}/`, {
            headers: headers
        })
        if (response.data) {
            return response.data
        }
        return null
    } catch (error: any) {
        console.log("Error fetching pet details:", error)
        return null
    }
}

export async function getMatchesWithDetails(petPrincipalId: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }

    try {
        // Buscar todos os matches
        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipalId}/matches/`, {
            headers: headers
        })
        
        if (response.data) {
            const matches: IMatch[] = response.data
            
            // Buscar detalhes de todos os pets envolvidos
            const matchesWithDetails: IMatchWithPetDetails[] = await Promise.all(
                matches.map(async (match) => {
                    const petPrincipalDetails = await getPetDetails(match.petPrincipal)
                    const petMatchDetails = await getPetDetails(match.petMatch)
                    
                    // Verificar se é um match recíproco
                    const isReciprocal = matches.some(
                        m => m.petPrincipal === match.petMatch && m.petMatch === match.petPrincipal
                    )
                    
                    return {
                        id: match.id,
                        petPrincipal: petPrincipalDetails!,
                        petMatch: petMatchDetails!,
                        created_at: match.created_at,
                        isReciprocal: isReciprocal
                    }
                })
            )
            
            return { success: true, data: matchesWithDetails }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}

export async function deleteMatch(matchId: number) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/matches/${matchId}/`, {
            headers: headers
        })
        return { success: true, data: response.data }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}

export async function getBlocksWithDetails(petPrincipalId: string) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipalId}/blocked/`, {
            headers: headers
        })
        
        if (response.data) {
            const blocks: any[] = response.data
            
            // Buscar detalhes de todos os pets envolvidos
            const blocksWithDetails = await Promise.all(
                blocks.map(async (block) => {
                    const petPrincipalDetails = await getPetDetails(block.petPrincipal)
                    const petBlockDetails = await getPetDetails(block.petBlock)
                    
                    return {
                        id: block.id,
                        petPrincipal: petPrincipalDetails!,
                        petBlock: petBlockDetails!,
                        created_at: block.created_at,
                    }
                })
            )
            
            return { success: true, data: blocksWithDetails }
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}

// Deletar um bloqueio específico
export async function deleteBlock(blockId: number) {
    const bearerToken = await AsyncStorage.getItem('bearer')
    let headers = {
        Authorization: "Bearer " + bearerToken
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/blocked/${blockId}/`, {
            headers: headers
        })
        return { success: true, data: response.data }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status)
            console.log("Headers:", error.response?.headers)
            console.log("Data:", error.response?.data)
        } else {
            console.log("Unexpected error:", error)
        }
        return { success: false, data: error.response?.data }
    }
}