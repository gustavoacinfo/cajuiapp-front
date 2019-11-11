
import { HttpClient } from '@angular/common/http';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../config/api.config';
import { StorageService } from './storage.service';
import { LocalUser } from '../models/local_user';
import { JwtHelper } from 'angular2-jwt';
import { UsuarioService } from './domain/usuario.service';
import { Role } from '../models/role';


@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage : StorageService,
        public usuarioService: UsuarioService){

    }

    authentication(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds,
            {
                observe: 'response',
                responseType: 'text'
            })
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {}, 
            {
                observe: 'response',
                responseType: 'text'
            })
    }

    successfulllogin(authorizationValue : string){
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token : tok,
            username: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
        let localUser = this.storage.getLocalUser();
        if(localUser && localUser.username) {
            this.pegarRole(localUser.username);
        }
    }

    pegarRole(username: string) {
        this.usuarioService.findByUsername(username)
            .subscribe(response => {
                let role : Role = {
                    perfil : response.perfis[0]
                };
                this.storage.setRole(role);
        });
    }

    logout(){
        this.storage.setLocalUser(null);
        this.storage.setRole(null);
    }


}