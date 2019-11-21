export interface FaltaDTO{
    matriculaId : {
        id : string;
        ofertaId : {
            id : string;
            periodoLetivoId : {
                id : string;
                ano : string;
                semestre : string;
                dataInicio : string;
                dataFim : string;
                frequenciaMinima : string;
                notaMinima : string;
                notaLiberaRecuperacao : string;
                fechado : string;
            }
        };
        contratoId : {
            id : string;
            alunoId : {
                id : string;
                username : string;
                apelido : string;
                status : string;
                email : string;
                nome : string;
            }
        }
        dataInicio : string;
        estadoMatricula : string;
        tipoMatricula : string;
    };
    registroId : {
        id : string;
        professorOfertaId : {
            id : string;
        ofertaId : {
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
                    horaAula : string;
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
    data : string;
    horaInicio : string;
    horaFim : string;
    descricao : string;
    }
    id : string;
    presenca : boolean;
    createdAt : string;
    updatedAt : string;
    createdBy : string;
    updatedBy : string;
}