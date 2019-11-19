import { RecuperacaoService } from './../../../services/domain/recuperacao.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { MatriculaDTO } from './../../../models/matricula.dto';
import { FaltaService } from './../../../services/domain/falta.service';
import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { NotaAvaliacaoService } from '../../../services/domain/nota-avaliacao.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { LogoutPage } from '../../login/login';
import { FaltaDTO } from '../../../models/falta.dto';
import { RecuperacaoDTO } from '../../../models/recuperacao.dto';

/**
 * Generated class for the AvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao',
  templateUrl: 'avaliacao.html',
})
export class AvaliacaoPage {

  oferta : ProfessorOfertaDTO;

  items : NotaAvaliacaoDTO[];

  pontosDistribuidos : number;

  pontosObtidos : number;

  quantAvaliacoes : number;

  usuario : UsuarioDTO;

  situacao : number;

  faltas : FaltaDTO[];

  numFaltas : number;

  quantFrequencia : number;

  freqAluno : number;

  matricula : MatriculaDTO;

  freqMinima : number;

  notaMinima : number;

  recuperacao : RecuperacaoDTO;

  existeRecuperacao : boolean;

  situacaoFinal : boolean;

  notaFinal : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public modalCtrl : ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public faltaService : FaltaService,
    public matriculaService : MatriculaService,
    public recuperacaoService : RecuperacaoService ) {

      this.oferta = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.notaavaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.items = response;
          this.quantAvaliacoes = this.items.length;
        },
        error => {});

        

        this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id, this.oferta.professorId.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }
          
        },
        error => {});

        this.notaavaliacaoService.pontosObtidos(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosObtidos = 0;
          }else{
            this.pontosObtidos = response;
          }
        },
        error => {});

        this.faltaService.faltasPorOferta(this.oferta.ofertaId.id, this.usuario.id)
      .subscribe(response => {
        this.faltas = response;
        this.quantFrequencia = this.faltas.length;
        let faltas = 0;
        for(let i=0; i<this.quantFrequencia; i++){
          if(this.faltas[i].presenca === false){
            faltas = faltas + 1;
          }
        }

        this.notaavaliacaoService.pontosObtidos(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosObtidos = 0;
          }else{
            this.pontosObtidos = response;
          }

          

          this.notaMinima = this.oferta.ofertaId.periodoLetivoId.notaMinima;

          this.numFaltas = faltas;

          this.freqAluno = (this.numFaltas * 100 )/ this.oferta.ofertaId.curriculoId.disciplinaId.horaAula;
          this.freqMinima = this.oferta.ofertaId.curriculoId.disciplinaId.horaAula - ((this.oferta.ofertaId.curriculoId.disciplinaId.horaAula * this.oferta.ofertaId.periodoLetivoId.frequenciaMinima) / 100);

          if(this.freqAluno > this.freqMinima){
            this.situacao = 0;
          }else if(this.freqAluno <= this.freqMinima && this.pontosObtidos < this.oferta.ofertaId.periodoLetivoId.notaLiberaRecuperacao){
            this.situacao = 1;
          }else if(this.pontosObtidos >= this.oferta.ofertaId.periodoLetivoId.notaLiberaRecuperacao && this.pontosObtidos < this.oferta.ofertaId.periodoLetivoId.notaMinima){
            this.situacao = 2;
          }else{
            this.situacao = 3;
          }

          this.matriculaService.matriculaDoAluno(this.oferta.ofertaId.id, this.usuario.id)
          .subscribe(response => {
            this.matricula = response;

            this.recuperacaoService.recuperacoesPorMatricula(this.matricula.id)
            .subscribe(response => {
              this.recuperacao = response;
              
              if(this.recuperacao === null){
                this.existeRecuperacao = false;
              }else{
                this.existeRecuperacao = true;
                this.notaFinal = (parseInt(this.pontosObtidos.toString()) + parseInt(this.recuperacao.nota.toString()))/2;
              
                if(this.notaFinal >= this.notaMinima){
                  this.situacaoFinal = true;
                }else{
                  this.situacaoFinal = false;
                }
              }

              
            },
            error => {});


          },
          error => {});

          
            
          
        },
        error => {});

        


      },
      error => {});


      },
      error => {});

      

    

  }

  home(){
    this.navCtrl.push('HomePage');
  }

  back(){
    this.navCtrl.push('DisciplinaPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}
