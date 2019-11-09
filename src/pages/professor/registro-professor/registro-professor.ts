import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { RegistroDTO } from './../../../models/registro.dto';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController, AlertController} from 'ionic-angular';
import { MatriculaDTO } from '../../../models/matricula.dto';
import { LogoutPage } from '../../login/login';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FaltaService } from '../../../services/domain/falta.service';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { FaltaDTO } from '../../../models/falta.dto';

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

  quantRegistros : number;

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
      this.quantRegistros = this.items.length;
    },
    error => {});
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  editarRegistro(obj : Object){
    let modal = this.modalCtrl.create(EditarRegistroPage, {obj});
    modal.present();
  }

  lancarFrequencia(obj : Object){
    let modal = this.modalCtrl.create(LancarFrequenciaPage, {obj});
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
  templateUrl: 'editar-registro.html',
})
export class EditarRegistroPage {

  registro : RegistroDTO;

  registros : RegistroDTO[];

  profOferta : ProfessorOfertaDTO;

  equivaleHorario : string;

  quantHorarios : number;

  horaInicial : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public registroService : RegistroService,
    public professorofertaService : ProfessorOfertaService,
    public matriculaService : MatriculaService,
    public alertCtrl : AlertController,
    public loadingCtrl : LoadingController) {
      
      this.registro = navParams.data.obj;

  }

  ionViewDidLoad() {

    this.professorofertaService.findById(parseInt(this.registro.professorOfertaId.id))
    .subscribe(response => {
      this.profOferta = response;
      this.equivaleHorario = this.profOferta.ofertaId.curriculoId.disciplinaId.equivalenciaMinutos;
      
    },
    error => {});

    this.registroService.registrosMesmaData(this.registro.professorOfertaId.id, this.registro.data, this.registro.descricao )
    .subscribe(response => {
      this.registros = response;
      this.quantHorarios = this.registros.length;
      this.horaInicial = this.registros[0].horaInicio;
    },
    error => {});

    this.registro.data = (new Date(this.registro.data)).toISOString();

    console.log(this.registros);
  }

  editarRegistro(quantHorarios : number, horaInicial : string){

    for(let i=0; i<quantHorarios; i++){
      this.registro.id = this.registros[i].id;
      this.registro.professorOfertaId.id = this.profOferta.id;
      let timestamp = Math.floor(Date.now() / 1000)
      this.registro.updatedAt = JSON.parse(timestamp.toString());
      this.registro.updatedBy = JSON.parse('1');
      this.registro.horaInicio = horaInicial;
      var horaFim = this.adicionaMinutos(horaInicial, this.equivaleHorario);
      this.registro.horaFim = horaFim;

      const loader = this.loadingCtrl.create({
        content: "Cadastrando "+ quantHorarios +" registros de aula..."
      });
  
      loader.present();
        this.registroService.changeDados(this.registro)
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
          }
        }
      ]
    });
    alert.present();
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  adicionaMinutos(hora : string, minutos : string){
    const horario = moment(hora, "HH:mm").add(minutos,"minutes").toLocaleString().substring(16,24);
    return horario;
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
      this.registro.professorOfertaId.id = this.profOferta.id;
      let timestamp = Math.floor(Date.now() / 1000)
      this.registro.createdAt = JSON.parse(timestamp.toString());
      this.registro.updatedAt = JSON.parse(timestamp.toString());
      this.registro.createdBy = JSON.parse('1');
      this.registro.updatedBy = JSON.parse('1');
      this.registro.horaInicio = horaInicial;
      var horaFim = this.adicionaMinutos(horaInicial, this.equivaleHorario);
      this.registro.horaFim = horaFim;

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
          }
        }
      ]
    });
    alert.present();
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  adicionaMinutos(hora : string, minutos : string){
    const horario = moment(hora, "HH:mm").add(minutos,"minutes").toLocaleString().substring(16,24);
    return horario;
  }
 
}

@Component({
  selector: 'page-avaliacao-professor',
  templateUrl: 'lancar-frequencia.html',
})
export class LancarFrequenciaPage {

  registro : RegistroDTO;

  form: FormGroup;

  items : MatriculaDTO[];

  quantAlunos : number;

  frequenciasLancadas : FaltaDTO[];


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public faltaService : FaltaService,
    public registroService : RegistroService,
    public matriculaService : MatriculaService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    private fb: FormBuilder
    ) {

      this.registro = navParams.data.obj;

  }

  ngOnInit() {

    this.form = new FormGroup({
      frequencias: new FormArray([]),
    });

    this.matriculaService.matriculasPorOferta(this.registro.professorOfertaId.ofertaId.id)
    .subscribe(response => {
      this.items = response;
      this.quantAlunos = this.items.length;
      for(let i=0; i <  this.items.length; i++){
        this.addFreq(this.items[i].id)
      }
    },
    error => {});

    this.faltaService.faltasPorRegistro(this.registro.id)
    .subscribe(response => {
      this.frequenciasLancadas = response;
    },
    error => {});

  }

  get frequencias() {
    return this.form.controls.frequencias as FormArray;
  }

  addFreq(matricula) {
    let timestamp = Math.floor(Date.now() / 1000);
    const arrayfrequencias = this.form.controls.frequencias as FormArray;
    arrayfrequencias.push(this.fb.group({
      matriculaId: new FormGroup({
        id: new FormControl(matricula)
      }),
      registroId : new FormGroup({
        id: new FormControl(this.registro.id)
      }),
      presenca: new FormControl(true),
      createdAt: new FormControl(JSON.parse(timestamp.toString())),
      updatedAt: new FormControl(JSON.parse(timestamp.toString())),
      createdBy: new FormControl(1),
      updatedBy: new FormControl(1)
    }));
  }

  salvarFrequencias(){
    
    if(this.form.valid) {
    const loader = this.loadingCtrl.create({
      content: "Cadastrando frequencias do registro..."
    });
    loader.present();
    this.faltaService.insert(this.form.value.frequencias)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOk();
       },
      error => {
        loader.dismiss();
      });

    }
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Frequencias cadastradas com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }


  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
