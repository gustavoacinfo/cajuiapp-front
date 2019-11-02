import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';

@Injectable()
export class ProfessorOfertaService{

    constructor(public http : HttpClient){

    }

    ofertasAluno() : Observable <ProfessorOfertaDTO[]>{
        return this.http.get<ProfessorOfertaDTO[]>(`${API_CONFIG.baseUrl}/professoroferta/aluno`)
    }

    findById(id : number) : Observable <ProfessorOfertaDTO[]> {
        return this.http.get<ProfessorOfertaDTO[]>(`${API_CONFIG.baseUrl}/professoroferta/${id}`)
    }

    ofertasProfessor() : Observable <ProfessorOfertaDTO[]>{
        return this.http.get<ProfessorOfertaDTO[]>(`${API_CONFIG.baseUrl}/professoroferta/professor`)
    }



}