import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';

/**
 * Generated class for the RelatorioFrequenciaProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-frequencia-professor',
  templateUrl: 'relatorio-frequencia-professor.html',
})
export class RelatorioFrequenciaProfessorPage {

  profOferta : ProfessorOfertaDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl : ModalController) {

      this.profOferta = navParams.data.obj;
  }

  ionViewDidLoad() {
    
    console.log(this.profOferta);

    

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}
