import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { NotaAvaliacaoService } from '../../../services/domain/nota-avaliacao.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { LogoutPage } from '../../login/login';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public modalCtrl : ModalController) {

      this.oferta = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.notaavaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
      this.quantAvaliacoes = this.items.length;
    },
    error => {});

    this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id, this.oferta.professorId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
    },
    error => {});

    this.notaavaliacaoService.pontosObtidos(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.pontosObtidos = response;
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
