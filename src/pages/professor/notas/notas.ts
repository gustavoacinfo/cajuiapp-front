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
import { NavController, NavParams, ModalController, IonicPage, ViewController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public faltaService : FaltaService) {
    
      this.aluno = navParams.data.obj;

  }

  ionViewDidLoad() {

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
        },
        error => {});

      },
      error => {});


    this.notaavaliacaoService.avaliacoesPorOferta(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
        .subscribe(response => {
          this.items = response;
          this.quantAvaliacoes = this.items.length;
        },
        error => {});

        this.notaavaliacaoService.pontosObtidos(this.aluno.ofertaId.id, this.aluno.contratoId.alunoId.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosObtidos = 0;
          }else{
            this.pontosObtidos = response;
          }
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

        },
        error => {});


        

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

 
}
