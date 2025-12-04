
export interface UserRegister {
    name: string,
    username: string,
    password?: string,
    cpf: string,
    state: string,
    city: string,
    img?: string
}

export interface RootUser {
    id: number,
    name: string,
    username: string,
    password?: string,
    cpf: string,
    state: string,
    city: string,
    img: string
}

export type UserLogin = Pick<RootUser, 'username' | 'password'>
