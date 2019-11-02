import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx';
import { OfertaDTO } from '../../models/oferta.dto';

@Injectable()
export class OfertaService{

    constructor(public http : HttpClient){

    }

    findById(id : number) : Observable <OfertaDTO[]> {
        return this.http.get<OfertaDTO[]>(`${API_CONFIG.baseUrl}/oferta/${id}`)
    }




}