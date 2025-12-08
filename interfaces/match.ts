import { ReceivedPet } from "./pet";

export interface IMatch {
    id: number;
    petPrincipal: number;
    petMatch: number;
    created_at?: string;
}

export interface IMatchWithPetDetails {
    id: number;
    petPrincipal: ReceivedPet;
    petMatch: ReceivedPet;
    created_at?: string;
    isReciprocal?: boolean; // Se os dois pets deram match um no outro
}

export interface IBlockedPet {
    id: number;
    petPrincipal: number;
    petBlock: number;
    created_at?: string;
}

export interface IBlockedPetWithDetails {
    id: number;
    petPrincipal: ReceivedPet;
    petBlock: ReceivedPet;
    created_at?: string;
}
