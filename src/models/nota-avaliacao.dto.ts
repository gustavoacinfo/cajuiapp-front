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
        maxPontos : string;
        nome : string;
        createdAt : string;
        updatedAt : string;
        createdBy : string;
        updatedBy : string;
    }
}