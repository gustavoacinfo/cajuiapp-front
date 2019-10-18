import { NotaAvaliacaoService } from './../../services/domain/nota-avaliacao.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';
import { NotaAvaliacaoDTO } from '../../models/nota-avaliacao.dto';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaavaliacaoService : NotaAvaliacaoService) {

      this.oferta = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.notaavaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

    this.notaavaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id)
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

}
