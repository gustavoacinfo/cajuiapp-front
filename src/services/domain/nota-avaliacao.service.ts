import { NotaAvaliacaoDTO } from './../../models/nota-avaliacao.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';

@Injectable()
export class NotaAvaliacaoService{

    constructor(public http : HttpClient){

    }

    avaliacoesPorOferta(id : String) : Observable <NotaAvaliacaoDTO[]> {
        return this.http.get<NotaAvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/notaavaliacao/oferta/${id}`)
    }

    pontosDistribuidos(id : String) : Observable <number> {
        return this.http.get<number>(`${API_CONFIG.baseUrl}/notaavaliacao/distribuidos/${id}`)
    }

    pontosObtidos(id : String) : Observable <number> {
        return this.http.get<number>(`${API_CONFIG.baseUrl}/notaavaliacao/obtidos/${id}`)
    }

    insert(obj : Array<Object>){
        return this.http.post(
            `${API_CONFIG.baseUrl}/notaavaliacao`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }


   


}