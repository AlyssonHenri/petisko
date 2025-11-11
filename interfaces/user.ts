
export interface RootUser {
    name: string,
    username: string,
    password: string,
    cpf: string,
    state: string,
    city: string,
    img: string
}

export type UserLogin = Pick<RootUser, 'username' | 'password'>

export type UserRegister = Pick<RootUser, 'name' | 'username' | 'password' | 'cpf' | 'state' | 'city'>