import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { AvaliacaoService } from '../../../services/domain/avaliacao.service';
import { AvaliacaoDTO } from '../../../models/avaliacao.dto';

/**
 * Generated class for the AvaliacaoProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-professor',
  templateUrl: 'avaliacao-professor.html',
})
export class AvaliacaoProfessorPage {

  oferta : ProfessorOfertaDTO;

  items : AvaliacaoDTO[];

  pontosDistribuidos : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public avaliacaoService : AvaliacaoService) {

      this.oferta = navParams.data.obj;
      
  }

  ionViewDidLoad() {

    this.avaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

    this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
    },
    error => {});

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

}
