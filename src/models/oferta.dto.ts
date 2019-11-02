export interface OfertaDTO{
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
            frequenciaMinima : string;
            notaMinima : string;
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
}


