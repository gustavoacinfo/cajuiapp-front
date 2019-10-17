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

    somaPontosDistribuidos(notaAvaliacao : NotaAvaliacaoDTO[], quant : number){
        let soma = 0;
        for(var i=0; i<quant; i++){
            soma += notaAvaliacao[i].avaliacaoId.maxPontos;
        }
        return soma;
    }

    somaPontosObtidos(notaAvaliacao : NotaAvaliacaoDTO[], quant : number){
        let soma = 0;
        for(var i=0; i<quant; i++){
            soma += notaAvaliacao[i].nota;
        }
        return soma;
    }

   


}