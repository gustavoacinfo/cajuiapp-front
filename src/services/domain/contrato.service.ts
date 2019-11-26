import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { ContratoDTO } from '../../models/contrato.dto';

@Injectable()
export class ContratoService{

    constructor(public http : HttpClient){

    }


    contratoDoAluno(alunoId : string) : Observable <ContratoDTO> {
        return this.http.get<ContratoDTO>(`${API_CONFIG.baseUrl}/contrato/aluno/${alunoId}`)
    }

    



   



}