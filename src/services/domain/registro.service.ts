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

    registrosMesmaData(id : String, data : String, desc : String) : Observable <RegistroDTO[]> {
        return this.http.get<RegistroDTO[]>(`${API_CONFIG.baseUrl}/registro/oferta/${id}/data/${data}/desc/${desc}`)
    }

    insert(obj : Object){
        return this.http.post(
            `${API_CONFIG.baseUrl}/registro`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    changeDados(registro: Object) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/registro`,
            registro,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    delete(id : Number) : Observable <RegistroDTO> {
        return this.http.delete<RegistroDTO>(`${API_CONFIG.baseUrl}/registro/${id}`)
    }



   



}