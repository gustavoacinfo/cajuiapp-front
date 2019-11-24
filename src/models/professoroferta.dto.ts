export interface ProfessorOfertaDTO{
    id : string;
    ofertaId : {
        id : string;
        periodoLetivoId : {
            id : string;
            ano : string;
            semestre : string;
            ocorrenciaCursoId : {
                id : string;
                cursoId : {
                    id : string;
                    nome : string;
                    sigla : string;
                    dataInicio : string;
                    areaConhecimentoId : string;
                    tipoCurso : string;  
                };
                unidadeId : {
                    id : string;
                    nome : string;
                }
            }
            dataInicio : string;
            dataFim : string;
            frequenciaMinima : number;
            notaMinima : number;
            notaLiberaRecuperacao : number;
        };
        curriculoId : {
            id : string;
            disciplinaId : {
                id : string;
                nome : string;
                sigla : string;
                horaAula : number;
                equivalenciaMinutos : string;
            }
        };
        turmaId : {
            id : string;
            nome : string;
            turno : string;
        }
    };
    professorId : {
        id : string;
            username : string;
            apelido :  string;
            email : string;
            unidadeId : {
                id : string;
                nome : string;
            }
            nome : String;
            
    }
}

