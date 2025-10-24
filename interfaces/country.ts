// Representa um estado individual
export interface IState {
    name: string;
    state_code: string;
}

export interface ICountryData {
    iso2: string;
    iso3: string;
    name: string;
    states: IState[];
}


export interface IStatesResponse {
    data: ICountryData;
    error: boolean;
    msg: string;
}


