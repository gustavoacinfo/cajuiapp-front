import { RegistroDTO } from './../../models/registro.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';

@Injectable()
export class RegistroService{

    constructor(public http : HttpClient){

    }

    registrosPorOferta(id : String) : Observable <RegistroDTO[]> {
        return this.http.get<RegistroDTO[]>(`${API_CONFIG.baseUrl}/registro/oferta/${id}`)
    }



   



}