import { NotaAvaliacaoService } from '../../../services/domain/nota-avaliacao.service';
import { FaltaService } from '../../../services/domain/falta.service';
import { RegistroService } from '../../../services/domain/registro.service';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { RegistroDTO } from '../../../models/registro.dto';
import { FaltaDTO } from '../../../models/falta.dto';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { LogoutPage } from '../../login/login';

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

  avaliacoes : NotaAvaliacaoDTO[];

  quantRegistros : number;

  quantFaltas : number;

  quantAvaliacoes : number;

  pontosDistribuidos : number;

  pontosObtidos : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public registroService : RegistroService,
    public faltaService : FaltaService,
    public notaavaliacaoService : NotaAvaliacaoService,
    public modalCtrl : ModalController) {

    this.items = navParams.data.obj;
  }

  ionViewDidLoad(){

    this.registroService.registrosPorOferta(this.items.ofertaId.id)
    .subscribe(response => {
      this.registros = response;
      this.quantRegistros = this.registros.length;
    },
    error => {});

    this.faltaService.faltasPorOferta(this.items.ofertaId.id)
    .subscribe(response => {
      this.faltas = response;
      this.quantFaltas = this.faltas.length;
    },
    error => {});

    this.notaavaliacaoService.avaliacoesPorOferta(this.items.ofertaId.id)
    .subscribe(response => {
      this.avaliacoes = response;
      this.quantAvaliacoes = this.avaliacoes.length;
    },
    error => {});

    this.notaavaliacaoService.pontosDistribuidos(this.items.ofertaId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
    },
    error => {});

    this.notaavaliacaoService.pontosObtidos(this.items.ofertaId.id)
    .subscribe(response => {
      this.pontosObtidos = response;
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
