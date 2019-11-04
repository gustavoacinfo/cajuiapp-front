import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { RegistroDTO } from './../../../models/registro.dto';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController, AlertController} from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { MatriculaDTO } from '../../../models/matricula.dto';
import { LogoutPage } from '../../login/login';
import * as moment from 'moment';

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

  iguais : RegistroDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService,
    public modalCtrl : ModalController) {

    this.oferta = this.navParams.data.obj;

  }

  ionViewDidLoad() {
    
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

  adicionarRegistro(id : Number) {
    let modal = this.modalCtrl.create(AdicionarRegistroPage, {id});
    modal.present();
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}

@Component({
  selector: 'page-registro-professor',
  templateUrl: 'visualizar-registro.html',
})
export class VisualizarRegistroPage {

  registro : RegistroDTO;

  registros : RegistroDTO[];

  items : MatriculaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public registroService : RegistroService,
    public matriculaService : MatriculaService) {
      this.registro = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.registroService.registrosPorOferta(this.registro.professorOfertaId.ofertaId.id)
    .subscribe(response => {
      this.registros = response;
    },
    error => {});

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
    professorOfertaId : {
      id: ""
    },
    descricao: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    createdAt:"",
    updatedAt:"",
    createdBy:"",
    updatedBy:""
  }

  equivaleHorario : string;

  quantHorarios : number;

  horaInicial : string;

  professorOfertaId : string;

  profOferta : ProfessorOfertaDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public registroService : RegistroService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    public professorofertaService : ProfessorOfertaService
    ) {

    this.professorOfertaId = this.navParams.data.id;
    
      
  }

  ionViewDidLoad() {

    this.professorofertaService.findById(parseInt(this.professorOfertaId))
    .subscribe(response => {
      this.profOferta = response;
      this.equivaleHorario = this.profOferta.ofertaId.curriculoId.disciplinaId.equivalenciaMinutos;
      
    },
    error => {});

    
     
  }

  salvarRegistro(quantHorarios : number, horaInicial : string){

    for(let i=0; i<quantHorarios; i++){
      console.log(horaInicial);
      this.registro.professorOfertaId.id = this.profOferta.id;
      let timestamp = Math.floor(Date.now() / 1000)
      this.registro.createdAt = JSON.parse(timestamp.toString());
      this.registro.updatedAt = JSON.parse(timestamp.toString());
      this.registro.createdBy = JSON.parse('1');
      this.registro.updatedBy = JSON.parse('1');
      this.registro.horaInicio = horaInicial;
      var horaFim = this.adicionaMinutos(horaInicial, this.equivaleHorario);
      this.registro.horaFim = horaFim;

      console.log(this.registro);

      const loader = this.loadingCtrl.create({
        content: "Cadastrando "+ quantHorarios +" registros de aula..."
      });
  
      loader.present();
        this.registroService.insert(this.registro)
          .subscribe(response => {
             loader.dismiss();
          },
         error => {
           loader.dismiss();
         });
  

      horaInicial = horaFim;

    }
    
    this.showInsertOk();

    

  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
            this.registrosDisciplina(this.profOferta.ofertaId);
          }
        }
      ]
    });
    alert.present();
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  registrosDisciplina(obj : Object){;
    this.navCtrl.push(RegistroProfessorPage, {obj});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  adicionaMinutos(hora : string, minutos : string){
    const horario = moment(hora, "HH:mm").add(minutos,"minutes").toLocaleString().substring(16,24);
    return horario;
  }
 
}
