import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { FaltaDTO } from '../../models/falta.dto';

@Injectable()
export class FaltaService{

    constructor(public http : HttpClient){

    }

    faltasPorOferta(id : String) : Observable <FaltaDTO[]> {
        return this.http.get<FaltaDTO[]>(`${API_CONFIG.baseUrl}/falta/oferta/${id}`)
    }

    insert(obj : Object){
        return this.http.post(
            `${API_CONFIG.baseUrl}/falta`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }


}