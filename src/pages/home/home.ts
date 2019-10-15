import { OfertaService } from './../../services/domain/oferta.service';
import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController, 
    public NavParams: NavParams,
    public ofertaService: OfertaService ) {

  }

  ionViewDidLoad(){
    this.ofertaService.ofertasAluno()
      .subscribe(response => {
        console.log(response);
      },
      error => {
        console.log(error);
      });
  }

  informacoesDisciplina(){
    this.navCtrl.setRoot('DisciplinaPage');
  }

}
