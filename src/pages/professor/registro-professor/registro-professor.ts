import { MatriculaService } from './../../../services/domain/matricula.service';
import { RegistroDTO } from './../../../models/registro.dto';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { MatriculaDTO } from '../../../models/matricula.dto';

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
    public registroService : RegistroService,
    public modalCtrl : ModalController) {

      this.oferta = this.navParams.data.obj;

  }

  ionViewDidLoad() {

    this.oferta = this.navParams.data.obj;
    
    this.registroService.registrosPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  visualizarRegistro(obj : Object){
    let modal = this.modalCtrl.create(VisualizarRegistroPage, {obj});
    modal.present();
  }

  adicionarRegistro() {
    let modal = this.modalCtrl.create(AdicionarRegistroPage);
    modal.present();
  }

}

@Component({
  selector: 'page-registro-professor',
  templateUrl: 'visualizar-registro.html',
})
export class VisualizarRegistroPage {

  registro : RegistroDTO;

  items : MatriculaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public matriculaService : MatriculaService) {
      this.registro = navParams.data.obj;
  }

  ionViewDidLoad() {
    
    this.matriculaService.matriculasPorOferta(this.registro.professorOfertaId.ofertaId.id)
    .subscribe(response => {
      this.items = response;
      console.log(this.items);
    },
    error => {});

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


 
}

@Component({
  selector: 'page-registro-professor',
  templateUrl: 'adicionar-registro.html',
})
export class AdicionarRegistroPage {

  registro = {
    descricao: "",
    data: "",
    horaInicio: "",
    horaFim: ""
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController
    ) {
      
  }

  ionViewDidLoad() {
     
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


 
}
