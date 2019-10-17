import { RegistroService } from './../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';
import { RegistroDTO } from '../../models/registro.dto';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  oferta : ProfessorOfertaDTO;

  items : RegistroDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService) {

      this.oferta = navParams.data.obj;

  }

  ionViewDidLoad() {
    this.registroService.registrosPorOferta(this.oferta.id)
    .subscribe(response => {
      this.items = response;
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
