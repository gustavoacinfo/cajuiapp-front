import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../../config/api.config';
import { OfertaDTO } from '../../models/oferta.dto';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OfertaService{

    constructor(public http : HttpClient){

    }

    ofertasAluno() : Observable <OfertaDTO[]>{
        return this.http.get<OfertaDTO[]>(`${API_CONFIG.baseUrl}/oferta/aluno/{id}/periodo/{periodo_id}`)
    }

}