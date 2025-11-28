export interface IPet {
    id: string
    name: string,
    age: string,
    img1: string,
    img2: string,
    img3: string,
    img4: string,
    sexo: string,
    raca: string,
    vacinas: Vacina[]
}
export type RootPet = Omit<IPet, 'id'>

export interface Vacina {
    id: string
    nome: string,
}