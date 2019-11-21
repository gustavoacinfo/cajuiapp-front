import { RecuperacaoService } from './../../../services/domain/recuperacao.service';
import { FaltaDTO } from './../../../models/falta.dto';
import { FaltaService } from './../../../services/domain/falta.service';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { MatriculaDTO } from './../../../models/matricula.dto';
import { NotaAvaliacaoService } from './../../../services/domain/nota-avaliacao.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { ProfessorOfertaDTO } from './../../../models/professoroferta.dto';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { RecuperacaoDTO } from '../../../models/recuperacao.dto';

/**
 * Generated class for the NotasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notas',
  templateUrl: 'notas.html',
})
export class NotasPage {

  profOferta : ProfessorOfertaDTO;

  matriculas : MatriculaDTO[];

  quantAlunos : number;

  usuario : UsuarioDTO;

  pontosDistribuidos : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl : ModalController,
    public matriculaService : MatriculaService,
    public notaAvaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public usuarioService : UsuarioService,
    public storage : StorageService) {


  }

  ngOnInit() {

    this.profOferta = this.navParams.data.obj;

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.avaliacaoService.pontosDistribuidos(this.profOferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.pontosDistribuidos = response;
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }
        },
        error => {});
    
      },
      error => {});


    this.matriculaService.matriculasPorOferta(this.profOferta.ofertaId.id)
    .subscribe(response => {
      this.matriculas = response;
      this.quantAlunos = this.matriculas.length;
    },
    error => {});
  }

  verAluno(obj : Object){
    let modal = this.modalCtrl.create(NotaAlunoPage, {obj});
    modal.present();
  }

  
  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}

@Component({
  selector: 'page-notas',
  templateUrl: 'nota-aluno.html',
})
export class NotaAlunoPage {

  aluno : MatriculaDTO;

  items : NotaAvaliacaoDTO[];

  quantAvaliacoes : number;

  usuario : UsuarioDTO;

  pontosDistribuidos : number;

  pontosObtidos : number;

  situacao : number;

  faltas : FaltaDTO[];

  numFaltas : number;

  quantFrequencia : number;

  freqAluno : number;

  freqMinima : number;

  recuperacao = {
    id : "",
    matriculaId : {
      id: ""
    },
    nota:"",
    createdAt:"",
    updatedAt:"",
    createdBy:"",
    updatedBy:""
  }

  editrecuperacao : RecuperacaoDTO;

  existeRecuperacao : boolean;

  notaMinima : number;

  notaSemestre : number;

  notaFinal : number;

  situacaoFinal : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public faltaService : FaltaService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    public recuperacaoService : RecuperacaoService ) {
    
      this.aluno = navParams.data.obj;

      this.notaavaliacaoService.pontosObtidos(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
          .subscribe(response => {
            if(response[0] === null){
              this.pontosObtidos = 0;
            }else{
              this.pontosObtidos = response;
            }
          },
          error => {});

  }

  ionViewDidLoad() {

    this.notaMinima = this.aluno.ofertaId.periodoLetivoId.notaMinima;

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.avaliacaoService.pontosDistribuidos(this.aluno.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.pontosDistribuidos = response;
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }


          this.notaavaliacaoService.avaliacoesPorOferta(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
        .subscribe(response => {
          this.items = response;
          this.quantAvaliacoes = this.items.length;
        },
        error => {});


        this.faltaService.faltasPorOferta(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
        .subscribe(response => {
          this.faltas = response;
          this.quantFrequencia = this.faltas.length;
          let faltas = 0;
          for(let i=0; i<this.quantFrequencia; i++){
            if(this.faltas[i].presenca === false){
              faltas = faltas + 1;
            }
          }

          this.notaavaliacaoService.pontosObtidos(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
          .subscribe(response => {
            if(response[0] === null){
              this.pontosObtidos = 0;
            }else{
              this.pontosObtidos = response;
            }

            this.numFaltas = faltas;

            this.freqAluno = (this.numFaltas * 100 )/ this.aluno.curriculoId.disciplinaId.horaAula;
            this.freqMinima = this.aluno.curriculoId.disciplinaId.horaAula - ((this.aluno.curriculoId.disciplinaId.horaAula * this.aluno.ofertaId.periodoLetivoId.frequenciaMinima) / 100);

            if(this.freqAluno > this.freqMinima){
              this.situacao = 0;
            }else if(this.freqAluno <= this.freqMinima && this.pontosObtidos < this.aluno.ofertaId.periodoLetivoId.notaLiberaRecuperacao){
              this.situacao = 1;
            }else if(this.pontosObtidos >= this.aluno.ofertaId.periodoLetivoId.notaLiberaRecuperacao && this.pontosObtidos < this.aluno.ofertaId.periodoLetivoId.notaMinima){
              this.situacao = 2;
            }else{
              this.situacao = 3;
            }

            if(this.pontosDistribuidos == 100 && this.aluno != null){
              this.recuperacaoService.recuperacoesPorMatricula(this.aluno.id)
            .subscribe(response => {
              this.editrecuperacao = response;
              if(this.editrecuperacao == null){
                this.existeRecuperacao = false;
              }else if(this.editrecuperacao.nota >= 0){
                this.existeRecuperacao = true;
                
                this.recuperacao.nota = this.editrecuperacao.nota.toString();
                this.recuperacao.id = this.editrecuperacao.id;
                this.recuperacao.matriculaId.id = this.editrecuperacao.matriculaId.id;
                this.recuperacao.createdAt = this.editrecuperacao.createdAt;
                this.recuperacao.createdBy = this.editrecuperacao.createdBy;
                this.notaSemestre = this.editrecuperacao.nota;

                this.notaFinal = (parseInt(this.pontosObtidos.toString()) + parseInt(this.recuperacao.nota.toString()))/2;
               
                if(this.notaFinal >= this.notaMinima){
                  this.situacaoFinal = true;
                }else{
                  this.situacaoFinal = false;
                }
              }
            },
            error => {});
            }

          },
          error => {});

          


        },
        error => {});

          

         


        },
        error => {});

      },
      error => {});


    

        
      

  }

  salvarRecuperacao(){
    if(parseInt(this.recuperacao.nota) < 0 || parseInt(this.recuperacao.nota) > 100 ){
      this.showInsertNotaInvalida();
    }else{

    this.recuperacao.matriculaId.id = this.aluno.id;
    let timestamp = Math.floor(Date.now() / 1000)
    this.recuperacao.createdAt = JSON.parse(timestamp.toString());
    this.recuperacao.updatedAt = JSON.parse(timestamp.toString());
    this.recuperacao.createdBy = JSON.parse(this.usuario.id); 
    this.recuperacao.updatedBy = JSON.parse(this.usuario.id); 
    const loader = this.loadingCtrl.create({
      content: "Cadastrando nota da recuperacao..."
    });
    loader.present();
     this.recuperacaoService.insert(this.recuperacao)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOk();
       },
      error => {
        loader.dismiss();
      });
    }


  }

  editarRecuperacao(){
    if(parseInt(this.recuperacao.nota) < 0 || parseInt(this.recuperacao.nota) > 100 ){
      this.showInsertNotaInvalida();
    }else{
    
    let timestamp = Math.floor(Date.now() / 1000);
    this.recuperacao.updatedAt = JSON.parse(timestamp.toString());
    this.recuperacao.updatedBy = JSON.parse(this.usuario.id); 
    const loader = this.loadingCtrl.create({
      content: "Atualizando nota da recuperacao..."
    });
    loader.present();
     this.recuperacaoService.changeDados(this.recuperacao)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOk2();
       },
      error => {
        loader.dismiss();
      });
    }


  }

  excluirRecuperacao(){
    
    let alert = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Tem certeza que deseja excluir a nota da recuperação?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: "Excluindo nota da recuperação..."
            });
            loader.present();

            if(this.existeRecuperacao == true){
              this.recuperacaoService.delete(parseInt(this.recuperacao.id))
              .subscribe(response => {
                loader.dismiss();
                this.showDeleteOk();
              },
              error => {
                loader.dismiss();
              });
            }
            
            
          }
        },
        {
          text: 'Não',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

  showDeleteOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Recuperação excluida com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  showInsertOk2(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Atualização efetuada com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  showInsertNotaInvalida(){
    let alert = this.alertCtrl.create({
      title: 'Erro! Nota de recuperação inválida!',
      message: 'Nota da recuperação deve ser entre 0 e 100.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }



  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

 
}
