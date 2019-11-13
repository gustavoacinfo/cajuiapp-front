export interface MatriculaDTO{
    id : string;
    ofertaId : {
        id : string;
        periodoLetivoId : {
            id : string;
            ano : string;
            semestre : string;
            dataInicio : string;
            dataFim : string;
            frequenciaMinima : number;
            notaMinima : number;
            notaLiberaRecuperacao : number;
            fechado : string;
        }
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