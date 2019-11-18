import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { RecuperacaoDTO } from '../../models/recuperacao.dto';

@Injectable()
export class RecuperacaoService{

    constructor(public http : HttpClient){

    }

    recuperacoesPorMatricula(id : String) : Observable <RecuperacaoDTO> {
        return this.http.get<RecuperacaoDTO>(`${API_CONFIG.baseUrl}/recuperacao/matricula/${id}`)
    }

    insert(obj : Object){
        return this.http.post(
            `${API_CONFIG.baseUrl}/recuperacao`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    changeDados(recuperacao: Object) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/recuperacao`,
            recuperacao,
            {
                observe: 'response',
                responseType: 'text'
            });
    }


    delete(id : Number) : Observable <RecuperacaoDTO> {
        return this.http.delete<RecuperacaoDTO>(`${API_CONFIG.baseUrl}/recuperacao/${id}`)
    }


}