import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';
import { MatriculaDTO } from '../../models/matricula.dto';

@Injectable()
export class MatriculaService{

    constructor(public http : HttpClient){

    }

    matriculasPorOferta(id : String) : Observable <MatriculaDTO[]> {
        return this.http.get<MatriculaDTO[]>(`${API_CONFIG.baseUrl}/matricula/oferta/${id}`)
    }

    matriculaDoAluno(ofertaId : string, alunoId : string) : Observable <MatriculaDTO> {
        return this.http.get<MatriculaDTO>(`${API_CONFIG.baseUrl}/matricula/oferta/${ofertaId}/aluno/${alunoId}`)
    }

    



   



}