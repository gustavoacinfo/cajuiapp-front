import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ProfessorOfertaService } from '../../services/domain/professoroferta.service';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items : ProfessorOfertaDTO[];

  constructor(
    public navCtrl: NavController, 
    public NavParams: NavParams,
    public professorofertaService: ProfessorOfertaService ) {

  }

  ionViewDidLoad(){
    this.professorofertaService.ofertasAluno()
      .subscribe(response => {
        this.items = response;
      },
      error => {});
  }

  informacoesDisciplina(obj : Object){
    this.navCtrl.push('DisciplinaPage', {obj});
  }

}



