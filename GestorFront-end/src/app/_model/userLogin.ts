export type Roles = 'AGENTE' | 'ADMIN' ;


export interface User {
    usuario: string;
    clave:   string
}

export interface UserResponse {
    message: string;
    token: string;
    userId: string;
    id_rol: Roles;

}