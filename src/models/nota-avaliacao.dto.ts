export interface NotaAvaliacaoDTO{
    matriculaId : {
        id : string;
    };
    avaliacaoId : {
        id : string;
        ofertaId :{
            id : string;
        }
        dataAvaliacao : string;
        maxPontos : number;
        nome : string;
    }
    nota : number;
    id : string;
    createdAt : string;
    updatedAt : string;
    createdBy : string;
    updatedBy : string;
}