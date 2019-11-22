export interface UsuarioDTO{
    id : string;
    nome : string;
    username : string;
    email : string;
    status : string,
    authKey : string,
    createdAt : string,
    updatedAt : string,
    perfis: Array<any>;
}