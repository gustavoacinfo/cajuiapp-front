import { ProfessorOfertaDTO } from './../../../models/professoroferta.dto';
import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomeProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-professor',
  templateUrl: 'home-professor.html',
})
export class HomeProfessorPage {

  items : ProfessorOfertaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService : ProfessorOfertaService,
    ) {

      
  }

  ionViewDidLoad() {
    this.professorofertaService.ofertasProfessor()
      .subscribe(response => {
        this.items = response;
      },
      error => {});
  }

  acessarDisciplina(obj : Object){
    this.navCtrl.push('DisciplinaProfessorPage', {obj});
  }


}
