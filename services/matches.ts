import { API_BASE_URL } from "@/constants/ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export async function sendMatch(petPrincipal: string, petMatch: string) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    console.log(petMatch)
    console.log(petPrincipal)
    let headers = {
        Authorization: "Bearer " + bearerToken
    };


    try {

        const response = await axios.post(`${API_BASE_URL}/pets/${petPrincipal}/matches/`, { petPrincipal: petPrincipal, petMatch: petMatch }, {
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



export async function sendUnmatch(petPrincipal: string, petMatch: string) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    console.log(petMatch)
    console.log(petPrincipal)
    let headers = {
        Authorization: "Bearer " + bearerToken
    };


    try {

        const response = await axios.post(`${API_BASE_URL}/pets/${petPrincipal}/blocked/`, { petPrincipal: petPrincipal, petBlock: petMatch }, {
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


export async function getMatches(petPrincipal: string) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken
    };


    try {

        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipal}/matches/`, {
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

export async function getBlocks(petPrincipal: string) {
    const bearerToken = await AsyncStorage.getItem('bearer');
    let headers = {
        Authorization: "Bearer " + bearerToken
    };


    try {

        const response = await axios.get(`${API_BASE_URL}/pets/${petPrincipal}/blocked/`, {
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