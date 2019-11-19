import { UsuarioService } from './../../../services/domain/usuario.service';
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
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { StorageService } from '../../../services/storage.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import moment from 'moment';

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

  notas : NotaAvaliacaoDTO[];

  quantAvaliacoes : number;

  pontosDistribuidos : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public avaliacaoService : AvaliacaoService,
    public notaAvaliacaoService : NotaAvaliacaoService,
    public modalCtrl : ModalController,
    public alertCtrl : AlertController,
    public loadingCtrl : LoadingController,
    public storage : StorageService,
    public usuarioService : UsuarioService) {

      this.oferta = navParams.data.obj;
      
  }

  ionViewDidLoad() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.avaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.items = response;
          this.quantAvaliacoes = this.items.length;
        },
        error => {});

        this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.pontosDistribuidos = response;
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }
        },
        error => {});

      },
      error => {});

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  editarAvaliacao(obj : Object) {
    let modal = this.modalCtrl.create(EditarAvaliacaoPage, {obj});
    modal.present();
  }

  excluirAvaliacao(avaliacao : Object, avaliacaoId : Number){
    
    let alert = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Tem certeza que deseja excluir esta avaliação? A exclusão dessa avaliação também irá excluir todos seus registros de notas!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: "Excluindo avaliação e seus registros de notas..."
            });
            loader.present();
            this.notaAvaliacaoService.notasPorAvaliacao(avaliacaoId.toString())
            .subscribe(response => {
              this.notas = response;

              console.log(this.notas);

              if(this.notas.length === 0){
                this.avaliacaoService.delete(avaliacaoId)
                      .subscribe(response => {
                        loader.dismiss();
                        this.showDeleteOk();
                      },
                      error => {
                        loader.dismiss();
                      });
                
              }else{

                for(let i=0; i<this.notas.length; i++){
                  this.notaAvaliacaoService.delete(parseInt(this.notas[i].id))
                  .subscribe(response => {

                    if(i == this.notas.length-1){
                      this.avaliacaoService.delete(avaliacaoId)
                      .subscribe(response => {
                        loader.dismiss();
                        this.showDeleteOk();
                      },
                      error => {
                        loader.dismiss();
                      });
                    }
                    
                      
                    
                  },
                  error => {});
                }

              }
             
            },
            error => {});
            
          }
        },
        {
          text: 'Não',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

  showDeleteOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Avaliação excluida com sucesso.',
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

  formEdit : FormGroup;

  items2 : MatriculaDTO[];

  quantAlunos : number;

  notasLancadas : NotaAvaliacaoDTO[];

  quantNotas : number;

  usuario : UsuarioDTO;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public notaavaliacaoService : NotaAvaliacaoService,
    public matriculaService : MatriculaService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    private fb: FormBuilder,
    private fbedit : FormBuilder,
    public usuarioService : UsuarioService,
    public storage : StorageService
    ) {

      
  }

  ionViewDidLoad() {

  }

  ngOnInit() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;
    
      },
      error => {});

    this.avaliacao = this.navParams.data.obj;

    this.form = new FormGroup({
      notas: new FormArray([]),
    });

    this.formEdit = new FormGroup({
      notasEdit : new FormArray([]),
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

    this.notaavaliacaoService.notasPorAvaliacao(this.avaliacao.id)
      .subscribe(response => {
        this.notasLancadas = response;
        this.quantNotas = this.notasLancadas.length;
        for(let i=0; i < this.notasLancadas.length; i++){
          this.addCredsEdit(
            this.notasLancadas[i].id,
            this.notasLancadas[i].matriculaId.id,
            this.notasLancadas[i].avaliacaoId.id,
            this.notasLancadas[i].nota,
            this.notasLancadas[i].createdAt,
            this.notasLancadas[i].createdBy,)
        }
      },
      error => {});

  }

  get notas() {
    return this.form.controls.notas as FormArray;
  }

  get notasEdit() {
    return this.formEdit.controls.notasEdit as FormArray;
  }

  addCredsEdit(id, matricula, avaliacao, nota, createdat, createdby) {
    let timestamp = Math.floor(Date.now() / 1000);
    const arraynotasEdit = this.formEdit.controls.notasEdit as FormArray;
    arraynotasEdit.push(this.fbedit.group({
      id: new FormControl(id),
      matriculaId: new FormGroup({
        id: new FormControl(matricula)
      }),
      avaliacaoId : new FormGroup({
        id: new FormControl(avaliacao)
      }),
      nota: new FormControl(nota, { validators: [Validators.required, Validators.min(0), Validators.max(this.avaliacao.maxPontos)]}),
      createdAt: new FormControl(createdat),
      updatedAt: new FormControl(JSON.parse(timestamp.toString())),
      createdBy: new FormControl(createdby),
      updatedBy: new FormControl(this.usuario.id) 
      
    }));
  }

  addCreds(nota) {
    let timestamp = Math.floor(Date.now() / 1000);
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
      createdBy: new FormControl(this.usuario.id),
      updatedBy: new FormControl(this.usuario.id) 
      
    }));
  }



  salvarNotas(){
    
    if(this.form.valid) {
    const loader = this.loadingCtrl.create({
      content: "Cadastrando notas da avaliação..."
    });
    loader.present();
     this.notaavaliacaoService.insert(this.form.value.notas)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOk();
       },
      error => {
        loader.dismiss();
      });
    }

  }

  editarNotas(){
    
    if(this.formEdit.valid) {
    const loader = this.loadingCtrl.create({
      content: "Atualizando notas da avaliação..."
    });
    loader.present();
     this.notaavaliacaoService.changeDados(this.formEdit.value.notasEdit)
       .subscribe(response => {
          loader.dismiss();
          this.showInsertOkEdit();
       },
      error => {
        loader.dismiss();
      });
    }

  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Notas salvas com sucesso.',
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

  showInsertOkEdit(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Notas atualizadas com sucesso.',
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

  pontosDistribuidos : number;

  alunos : MatriculaDTO[];

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public loadingCtrl : LoadingController,
    public avaliacaoService : AvaliacaoService,
    public alertCtrl : AlertController,
    public modalCtrl : ModalController,
    public storage : StorageService,
    public usuarioService : UsuarioService) {

      this.oferta = navParams.data.id;
      
  }

  ionViewDidLoad() {

    this.avaliacao.dataAvaliacao = moment().format("YYYY-MM-DD");

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.avaliacaoService.pontosDistribuidos(this.oferta, this.usuario.id)
        .subscribe(response => {
          this.pontosDistribuidos = response;
        },
        error => {});

      },
      error => {});

  }

  salvarAvaliacao(){
    if(parseInt(this.avaliacao.maxPontos) > (100 - this.pontosDistribuidos)){
      this.showInsertNotaMaior();
    }else{

    this.avaliacao.ofertaId.id = this.oferta;
    let timestamp = Math.floor(Date.now() / 1000)
    this.avaliacao.createdAt = JSON.parse(timestamp.toString());
    this.avaliacao.updatedAt = JSON.parse(timestamp.toString());
    this.avaliacao.createdBy = JSON.parse(this.usuario.id); 
    this.avaliacao.updatedBy = JSON.parse(this.usuario.id); 
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

  showInsertNotaMaior(){
    let alert = this.alertCtrl.create({
      title: 'Erro! Valor de avaliação inválido!',
      message: 'Não é possível salvar a avaliação com nota máxima acima da quantidade de pontos restantes.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
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
  templateUrl: 'editar-avaliacao.html',
})
export class EditarAvaliacaoPage {

  avaliacao : AvaliacaoDTO;

  pontosDistribuidos : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public loadingCtrl : LoadingController,
    public avaliacaoService : AvaliacaoService,
    public alertCtrl : AlertController,
    public modalCtrl : ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService) {

      this.avaliacao = navParams.data.obj;

  }

  ionViewDidLoad() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
    .subscribe(response => {
      this.usuario = response;

      this.avaliacaoService.pontosDistribuidos(this.avaliacao.ofertaId.id, this.usuario.id)
      .subscribe(response => {
        this.pontosDistribuidos = response;
      },
      error => {});

    },
    error => {});

    
  }

  editarAvaliacao() {
    const loader = this.loadingCtrl.create({
      content: "Alterando avaliacão..."
    });
    loader.present();
    let timestamp = Math.floor(Date.now() / 1000)
    this.avaliacao.updatedAt = JSON.parse(timestamp.toString());
    this.avaliacao.updatedBy = JSON.parse(this.usuario.id); 
    this.avaliacaoService.changeDados(this.avaliacao)
      .subscribe(response => {
        loader.dismiss();
        switch(response.status) {
          case 200:
              this.handle200();
            break;
        }
      }, 
      error => {
        loader.dismiss();
      });
  }

  handle200() {
    let alert = this.alertCtrl.create({
        title: 'Dados alterados',
        message: 'Dados da avaliação foram alterados com sucesso!',
        enableBackdropDismiss: false,
        buttons: [
            {
                text: 'Ok',
                handler: () => {
                  this.dismiss();
                }
            }
        ]
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

}

