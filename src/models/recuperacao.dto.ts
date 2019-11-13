export interface RecuperacaoDTO{
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
    }
    nota : number;
    id : string;
    createdAt : string;
    updatedAt : string;
    createdBy : string;
    updatedBy : string;
}