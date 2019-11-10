
import { HttpClient } from '@angular/common/http';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../config/api.config';
import { StorageService } from './storage.service';
import { LocalUser } from '../models/local_user';


@Injectable()
export class AuthService {

    constructor(
        public http: HttpClient, 
        public storage : StorageService){

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

    successfulllogin(authorizationValue : string){
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token : tok,
            // email: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
        // let localUser = this.storage.getLocalUser();
        // if(localUser && localUser.email) {
        //     this.pegarRole(user.email);
        // }
    }

    logout(){
        this.storage.setLocalUser(null);
        //this.storage.setRole(null);
    }


}