import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { AvaliacaoDTO } from '../../models/avaliacao.dto';

@Injectable()
export class AvaliacaoService{

    constructor(public http : HttpClient){

    }

    avaliacoesPorOferta(id : String, pId : String) : Observable <AvaliacaoDTO[]> {
        return this.http.get<AvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/avaliacao/oferta/${id}/prof/${pId}`)
    }

    pontosDistribuidos(id : String, pId : String) : Observable <number> {
        return this.http.get<number>(`${API_CONFIG.baseUrl}/avaliacao/distribuidos/${id}/prof/${pId}`)
    }

    insert(obj : Object){
        console.log(obj);
        return this.http.post(
            `${API_CONFIG.baseUrl}/avaliacao`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    changeDados(avaliacao: Object) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/avaliacao`,
            avaliacao,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    delete(id : Number) : Observable <AvaliacaoDTO> {
        return this.http.delete<AvaliacaoDTO>(`${API_CONFIG.baseUrl}/avaliacao/${id}`)
    }

    


}