import { UsuarioDTO } from './../../models/usuario.dto';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { API_CONFIG } from '../../config/api.config';
import { StorageService } from '../storage.service';

@Injectable()
export class UsuarioService{

    constructor(
        public http : HttpClient,
        public storage : StorageService){

    }

    findByUsername(username : string) : Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario/${username}`);
    }

    changeDados(usuario: Object) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/usuario`,
            usuario,
            {
                observe: 'response',
                responseType: 'text'
            });
    }



}