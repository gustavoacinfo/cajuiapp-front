import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  home(){
    this.navCtrl.setRoot('HomePage');
  }

  registrosDisciplina(){;
    this.navCtrl.setRoot('RegistroPage');
  }

  avaliacoesDisciplina(){;
    this.navCtrl.setRoot('AvaliacaoPage');
  }

}
