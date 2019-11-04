import { MatriculaDTO } from './../../../models/matricula.dto';
import { LogoutPage } from './../../login/login';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { NotaAvaliacaoService } from './../../../services/domain/nota-avaliacao.service';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { AvaliacaoDTO } from '../../../models/avaliacao.dto';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HomeProfessorPage } from '../home-professor/home-professor';

/**
 * Generated class for the AvaliacaoProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-professor',
  templateUrl: 'avaliacao-professor.html',
})
export class AvaliacaoProfessorPage {

  oferta : ProfessorOfertaDTO;

  items : AvaliacaoDTO[];

  pontosDistribuidos : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public avaliacaoService : AvaliacaoService,
    public modalCtrl : ModalController) {

      this.oferta = navParams.data.obj;
      
  }

  ionViewDidLoad() {

    this.avaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
    },
    error => {});

    this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.pontosDistribuidos = response;
    },
    error => {});

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  lancarNotas(obj : Object){
    let modal = this.modalCtrl.create(LancarNotasPage, {obj});
    modal.present();
  }

  adicionarAvaliacao(id : Number){
    let modal = this.modalCtrl.create(AdicionarAvaliacaoPage, {id});
    modal.present();
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}

@Component({
  selector: 'page-avaliacao-professor',
  templateUrl: 'lancar-notas.html',
})
export class LancarNotasPage {

  avaliacao : AvaliacaoDTO;

  form: FormGroup;
  
  notaavaliacao = {
    matriculaId : {
      id: ""
    },
    avaliacaoId : {
      id: ""
    },
    nota:"",
    createdAt:"",
    updatedAt:"",
    createdBy:"",
    updatedBy:""
  }

  items2 : MatriculaDTO[];

  quantAlunos : number;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public notaavaliacaoService : NotaAvaliacaoService,
    public matriculaService : MatriculaService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    private fb: FormBuilder
    ) {

      
  }

  ionViewDidLoad() {

  }

  ngOnInit() {

    this.avaliacao = this.navParams.data.obj;

    this.form = new FormGroup({
      notas: new FormArray([]),
    });

    this.matriculaService.matriculasPorOferta(this.avaliacao.ofertaId.id)
    .subscribe(response => {
      this.items2 = response;
      this.quantAlunos = this.items2.length;
      for(let i=0; i <  this.items2.length; i++){
        this.addCreds(this.items2[i].id)
      }
    },
    error => {});

  }

  get notas() {
    return this.form.controls.notas as FormArray;
  }

  addCreds(nota) {
    let timestamp = Math.floor(Date.now() / 1000)
    const arraynotas = this.form.controls.notas as FormArray;
    arraynotas.push(this.fb.group({
      matriculaId: new FormGroup({
        id: new FormControl(nota)
      }),
      avaliacaoId : new FormGroup({
        id: new FormControl(this.avaliacao.id)
      }),
      nota: new FormControl(null, { validators: [Validators.required, Validators.min(0), Validators.max(this.avaliacao.maxPontos)]}),
      createdAt: new FormControl(JSON.parse(timestamp.toString())),
      updatedAt: new FormControl(JSON.parse(timestamp.toString())),
      createdBy: new FormControl(1),
      updatedBy: new FormControl(1)
      
    }));
  }

  salvarNotas(){
    
    if(this.form.valid) {
      console.log(this.form.value);
    const loader = this.loadingCtrl.create({
      content: "Cadastrando avaliacão..."
    });
    loader.present();
     this.notaavaliacaoService.insert(this.form.value)
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
      message: 'Cadastro de notas com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
            this.navCtrl.push(HomeProfessorPage);
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

@Component({
  selector: 'page-avaliacao-professor',
  templateUrl: 'adicionar-avaliacao.html',
})
export class AdicionarAvaliacaoPage {

  avaliacao = {
    ofertaId : {
      id: ""
    },
    nome:"",
    dataAvaliacao:"",
    maxPontos:"",
    createdAt:"",
    updatedAt:"",
    createdBy:"",
    updatedBy:""
  }

  oferta : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public loadingCtrl : LoadingController,
    public avaliacaoService : AvaliacaoService,
    public alertCtrl : AlertController) {

      this.oferta = navParams.data.id;
      
  }

  ionViewDidLoad() {

    

  }

  salvarAvaliacao(){
    this.avaliacao.ofertaId.id = this.oferta;
    let timestamp = Math.floor(Date.now() / 1000)
    // let timestamp = new Date().getTime();
    this.avaliacao.createdAt = JSON.parse(timestamp.toString());
    this.avaliacao.updatedAt = JSON.parse(timestamp.toString());
    this.avaliacao.createdBy = JSON.parse('1');
    this.avaliacao.updatedBy = JSON.parse('1');
    const loader = this.loadingCtrl.create({
      content: "Cadastrando avaliacão..."
    });
    loader.present();
     this.avaliacaoService.insert(this.avaliacao)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOk();
       },
      error => {
        loader.dismiss();
      });
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
            this.navCtrl.push(AvaliacaoProfessorPage);
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

