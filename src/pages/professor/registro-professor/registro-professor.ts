import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { RegistroDTO } from '../../../models/registro.dto';

/**
 * Generated class for the RegistroProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-professor',
  templateUrl: 'registro-professor.html',
})
export class RegistroProfessorPage {

  oferta : ProfessorOfertaDTO;

  items : RegistroDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService) {

      this.oferta = this.navParams.data.obj;

  }

  ionViewDidLoad() {
    
    this.registroService.registrosPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

  }

 
}
