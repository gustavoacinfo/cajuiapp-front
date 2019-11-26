export interface ContratoDTO{
    id : string;
    alunoId : {
        id : string;
        username : string;
        apelido : string;
        email : string;
        emailAlternativo : string;
        nome : string;
        sexo : string;
        estadoCivil : string;
        dataNascimento : string;
        cpf : string;
    },
    ocorrenciaCursoId : {
        id : string;
        cursoId : {
            id : string;
            nome : string;
            sigla : string;
            
        }
    },
    turmaId : {
        id : string;
        nome : string;
    }
    formaIngresso : string;
    
}