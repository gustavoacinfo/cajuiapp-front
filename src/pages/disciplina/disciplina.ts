import { ProfessorOfertaService } from './../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService: ProfessorOfertaService) {

      this.items = navParams.data.obj;
      
  }

  ionViewDidLoad(){

    console.log(this.items);
  }

  home(){
    this.navCtrl.push('HomePage');
  }

  registrosDisciplina(){;
    this.navCtrl.push('RegistroPage');
  }

  avaliacoesDisciplina(){;
    this.navCtrl.setRoot('AvaliacaoPage');
  }

  

  

}
