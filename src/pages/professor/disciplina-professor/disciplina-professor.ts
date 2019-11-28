import { RegistroService } from './../../../services/domain/registro.service';
import { NotaAvaliacaoService } from './../../../services/domain/nota-avaliacao.service';
import { ProfessorOfertaDTO } from './../../../models/professoroferta.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RegistroDTO } from '../../../models/registro.dto';
import { AvaliacaoService } from '../../../services/domain/avaliacao.service';
import { LogoutPage } from '../../login/login';

/**
 * Generated class for the DisciplinaProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disciplina-professor',
  templateUrl: 'disciplina-professor.html',
})
export class DisciplinaProfessorPage {

  items : ProfessorOfertaDTO;

  pontosDistribuidos : number;

  registros : RegistroDTO[];

  quantRegistros : number;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaavaliacaoService : NotaAvaliacaoService,
    public registroService : RegistroService,
    public avaliacaoService : AvaliacaoService,
    public modalCtrl : ModalController) {

      this.items = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.registroService.registrosPorOferta(this.items.ofertaId.id)
    .subscribe(response => {
      this.registros = response;
      this.quantRegistros = this.registros.length * 100;
    },
    error => {});

    this.avaliacaoService.pontosDistribuidos(this.items.ofertaId.id, this.items.professorId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
      if(response[0] === null){
        this.pontosDistribuidos = 0;
      }else{
        this.pontosDistribuidos = response;
      }
    },
    error => {});
  }

  registrosDisciplina(obj : Object){;
    this.navCtrl.push('RegistroProfessorPage', {obj});
  }

  avaliacoesDisciplina(obj : Object){;
    this.navCtrl.push('AvaliacaoProfessorPage', {obj});
  }

  notasDisciplina(obj : Object){
    this.navCtrl.push('NotasPage', {obj});
  }

  relatorioFrequencia(obj : Object){
    this.navCtrl.push('RelatorioFrequenciaProfessorPage', {obj});
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }


}
