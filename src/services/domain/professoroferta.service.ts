import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';

@Injectable()
export class ProfessorOfertaService{

    constructor(public http : HttpClient){

    }

    ofertasAluno(id : string) : Observable <ProfessorOfertaDTO[]>{
        return this.http.get<ProfessorOfertaDTO[]>(`${API_CONFIG.baseUrl}/professoroferta/aluno/${id}`)
    }

    findById(id : number) : Observable <ProfessorOfertaDTO> {
        return this.http.get<ProfessorOfertaDTO>(`${API_CONFIG.baseUrl}/professoroferta/${id}`)
    }

    ofertasProfessor(id : string) : Observable <ProfessorOfertaDTO[]>{
        return this.http.get<ProfessorOfertaDTO[]>(`${API_CONFIG.baseUrl}/professoroferta/professor/${id}`)
    }



}