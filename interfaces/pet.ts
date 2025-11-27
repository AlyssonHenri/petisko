export interface rootPet {
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

export interface Vacina {
    id: string
    nome: string,
}