
export type UserLogin = Pick<IUser, 'username' | 'password'>

export interface IUser {
    name: string,
    username: string,
    password: string,
    cpf: string,
    state: string,
    city: string
}