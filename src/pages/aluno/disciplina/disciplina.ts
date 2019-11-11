import { UsuarioDTO } from './../../../models/usuario.dto';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { NotaAvaliacaoService } from '../../../services/domain/nota-avaliacao.service';
import { FaltaService } from '../../../services/domain/falta.service';
import { RegistroService } from '../../../services/domain/registro.service';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { RegistroDTO } from '../../../models/registro.dto';
import { FaltaDTO } from '../../../models/falta.dto';
import { LogoutPage } from '../../login/login';
import { AvaliacaoDTO } from '../../../models/avaliacao.dto';
import { StorageService } from '../../../services/storage.service';

/**
 * Generated class for the DisciplinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disciplina',
  templateUrl: 'disciplina.html',
})
export class DisciplinaPage {

  items : ProfessorOfertaDTO;

  registros : RegistroDTO[];

  faltas : FaltaDTO[];

  avaliacoes : AvaliacaoDTO[];

  quantRegistros : number;

  quantFrequencia : number;

  numFaltas : number;

  quantAvaliacoes : number;

  pontosDistribuidos : number;

  pontosObtidos : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public registroService : RegistroService,
    public avaliacaoService : AvaliacaoService,
    public faltaService : FaltaService,
    public notaavaliacaoService : NotaAvaliacaoService,
    public modalCtrl : ModalController,
    public storage : StorageService,
    public alertCtrl : AlertController,
    public usuarioService : UsuarioService) {

    this.items = navParams.data.obj;
  }

  ionViewDidLoad(){

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.registroService.registrosPorOferta(this.items.ofertaId.id)
    .subscribe(response => {
      this.registros = response;
      this.quantRegistros = this.registros.length;
    },
    error => {});

    this.faltaService.faltasPorOferta(this.items.ofertaId.id, this.usuario.id)
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
    },
    error => {});

    this.avaliacaoService.avaliacoesPorOferta(this.items.ofertaId.id, this.items.professorId.id)
    .subscribe(response => {
      this.avaliacoes = response;
      this.quantAvaliacoes = this.avaliacoes.length;
    },
    error => {});

    this.avaliacaoService.pontosDistribuidos(this.items.ofertaId.id, this.items.professorId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
    },
    error => {});

    this.notaavaliacaoService.pontosObtidos(this.items.ofertaId.id)
    .subscribe(response => {
      if(response == null){
        this.pontosObtidos = 0;
      }else{
        this.pontosObtidos = response;
      }
      
    },
    error => {});

      },
      error => {});

    
  }

  home(){
    this.navCtrl.push('HomePage');
  }

  registrosDisciplina(obj : Object){;
    this.navCtrl.push('RegistroPage', {obj});
  }

  avaliacoesDisciplina(obj : Object){;
    this.navCtrl.push('AvaliacaoPage', {obj});
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  

}
