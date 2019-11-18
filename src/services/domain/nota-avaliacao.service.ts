import { NotaAvaliacaoDTO } from './../../models/nota-avaliacao.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';

@Injectable()
export class NotaAvaliacaoService{

    constructor(public http : HttpClient){

    }

    avaliacoesPorOferta(id : String, aid : String) : Observable <NotaAvaliacaoDTO[]> {
        return this.http.get<NotaAvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/notaavaliacao/oferta/${id}/aluno/${aid}`)
    }

    notasPorAvaliacao(id : String) : Observable <NotaAvaliacaoDTO[]> {
        return this.http.get<NotaAvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/notaavaliacao/avaliacao/${id}`)
    }

    pontosObtidos(id : String, aid : String) : Observable <number> {
        return this.http.get<number>(`${API_CONFIG.baseUrl}/notaavaliacao/obtidos/${id}/aluno/${aid}`)
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

    changeDados(nota: Array<Object>) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/notaavaliacao`,
            nota,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    delete(id : Number) : Observable <NotaAvaliacaoDTO[]> {
        return this.http.delete<NotaAvaliacaoDTO[]>(`${API_CONFIG.baseUrl}/notaavaliacao/${id}`)
    }


   


}