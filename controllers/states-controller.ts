import { useEffect, useState } from "react";
import axios from 'axios';
import { IStatesResponse, IState } from "@/interfaces/country";


export default async function getStates(): Promise<IState[]> {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states',
        { country: 'Brazil' });
    return response.data.data.states;
}

export async function getCitiesFromState(state: string): Promise<string[]> {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities',
        { country: 'Brazil', 'state': state });
    return response.data.data;
}