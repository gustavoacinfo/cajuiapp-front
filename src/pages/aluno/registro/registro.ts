import { RegistroService } from '../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { RegistroDTO } from '../../../models/registro.dto';
import { FaltaService } from '../../../services/domain/falta.service';
import { FaltaDTO } from '../../../models/falta.dto';
import { LogoutPage } from '../../login/login';

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

  faltas : FaltaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService,
    public faltaService : FaltaService,
    public modalCtrl : ModalController) {

      this.oferta = navParams.data.obj;

  }

  ionViewDidLoad() {
    this.registroService.registrosPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

    this.faltaService.faltasPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.faltas = response;
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
