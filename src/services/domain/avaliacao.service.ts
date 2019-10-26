import { NotaAvaliacaoDTO } from './../../models/nota-avaliacao.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { AvaliacaoDTO } from '../../models/avaliacao.dto';

@Injectable()
export class AvaliacaoService{

    constructor(public http : HttpClient){

    }

    avaliacoesPorOferta(id : String) : Observable <AvaliacaoDTO[]> {
        return this.http.get<AvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/avaliacao/oferta/${id}`)
    }

    pontosDistribuidos(id : String) : Observable <number> {
        return this.http.get<number>(`${API_CONFIG.baseUrl}/avaliacao/distribuidos/${id}`)
    }

    insert(obj : Object){
        return this.http.post(
            `${API_CONFIG.baseUrl}/avaliacao`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }


}