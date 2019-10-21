import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

      this.items = navParams.data.obj;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DisciplinaProfessorPage');
  }

}
