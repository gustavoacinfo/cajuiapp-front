import { StorageService } from './../../../services/storage.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { RegistroDTO } from './../../../models/registro.dto';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController, AlertController} from 'ionic-angular';
import { MatriculaDTO } from '../../../models/matricula.dto';
import { LogoutPage } from '../../login/login';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FaltaService } from '../../../services/domain/falta.service';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { FaltaDTO } from '../../../models/falta.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';

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

  itemsFilter : RegistroDTO[];

  iguais : RegistroDTO[];

  quantRegistros : number;

  faltas : FaltaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService,
    public modalCtrl : ModalController,
    public alertCtrl : AlertController,
    public loadingCtrl : LoadingController,
    public faltaService : FaltaService ) {

    this.oferta = navParams.data.obj;

  }

  ionViewDidLoad() {
    
    this.registroService.registrosPorOferta(this.oferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
      this.quantRegistros = this.items.length;
      this.initializeItems();
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

  initializeItems() {
    this.itemsFilter = this.items;
  }

  getItems(ev: any) {
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.itemsFilter = this.itemsFilter.filter((item) => {
        return (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  excluirRegistro(registro : Object, registroId : Number){
    
    let alert = this.alertCtrl.create({
      title: 'Atenção!',
      message: 'Tem certeza que deseja excluir este registro de aula? A exclusão desse registro também irá excluir todas as frequências lançadas!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: "Excluindo registro de aula e suas frequencias..."
            });
            loader.present();
            this.faltaService.faltasPorRegistro(registroId.toString())
            .subscribe(response => {
              this.faltas = response;


              if(this.faltas.length === 0){
                this.registroService.delete(registroId)
                      .subscribe(response => {
                        loader.dismiss();
                        this.showDeleteOk();
                      },
                      error => {
                        loader.dismiss();
                      });
                
              }else{

                for(let i=0; i<this.faltas.length; i++){
                  this.faltaService.delete(parseInt(this.faltas[i].id))
                  .subscribe(response => {
  
                    if(i == this.faltas.length-1){
                      this.registroService.delete(registroId)
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
      message: 'Registro de aula excluido com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.ionViewDidLoad();
          }
        }
      ]
    });
    alert.present();
  }

  lancarFrequencia(obj : Object){
    let modal = this.modalCtrl.create(LancarFrequenciaPage, {obj});
    modal.present();
  }

  adicionarRegistro(obj : Object) {
    let modal = this.modalCtrl.create(AdicionarRegistroPage, {obj});
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

  quantHorarioAnterior : number;

  horaInicial : string;

  usuario : UsuarioDTO;

  dataAtual : String;

  horaAtual : String;

  arrayId : Array<number>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public registroService : RegistroService,
    public professorofertaService : ProfessorOfertaService,
    public matriculaService : MatriculaService,
    public alertCtrl : AlertController,
    public loadingCtrl : LoadingController,
    public usuarioService : UsuarioService,
    public storage : StorageService) {
      
      this.registro = navParams.data.obj;

  }

  ionViewDidLoad() {

    this.arrayId = new Array();

    this.dataAtual = moment().format("YYYY-MM-DD");

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;
      },
      error => {});

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
      this.quantHorarioAnterior = this.quantHorarios;
      let array = [];
      for(let i=0; i<this.quantHorarios; i++){
        array.push(this.registros[i].horaInicio);
        this.arrayId.push(parseInt(this.registros[i].id));
      }

      this.arrayId.sort(this.compararNumeros);


      array.sort();


      this.horaInicial = array[0];

    },
    error => {});

    this.registro.data = (new Date(this.registro.data)).toISOString();
  }

  editarRegistro(quantHorarios : number, horaInicial : string){

    if(this.quantHorarioAnterior != quantHorarios){
      this.showInsertErro();
    }else{

    for(let i=0; i<quantHorarios; i++){
      
      this.registro.id = this.arrayId[0].toString();
      this.arrayId.splice(0, 1);
      this.registro.professorOfertaId.id = this.profOferta.id;
      let timestamp = Math.floor(Date.now() / 1000)
      this.registro.updatedAt = JSON.parse(timestamp.toString());
      this.registro.updatedBy = this.usuario.id;
      this.registro.horaInicio = horaInicial;
      var horaFim = this.adicionaMinutos(horaInicial, this.equivaleHorario);
      this.registro.horaFim = horaFim;
      this.registro.professorOfertaId.professorId.perfis = [1];

      const loader = this.loadingCtrl.create({
        content: "Atualizando "+ quantHorarios +" registros de aula..."
      });
  
      loader.present();
        this.registroService.changeDados(this.registro)
          .subscribe(response => {
             loader.dismiss();
             if(i == quantHorarios-1){
              this.showInsertOk();
           }
          },
         error => {
           loader.dismiss();
         });
  

      horaInicial = horaFim;

    }
  }
    
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Atualização realizada com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.paginaAnterior(this.profOferta);
          }
        }
      ]
    });
    alert.present();
  }

  showInsertErro(){
    let alert = this.alertCtrl.create({
      title: 'Erro no número de horários!',
      message: 'Não é possivel alterar a quantidade de horários. Exclua os registros e cadastre um novo com a quantidade desejada!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  paginaAnterior(obj : Object){
    this.navCtrl.setRoot('RegistroProfessorPage', {obj} )
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

  compararNumeros(a, b) {
    return a - b;
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

  professorOfertaId : ProfessorOfertaDTO;

  profOferta : ProfessorOfertaDTO;

  usuario : UsuarioDTO;

  registrosExistentes : RegistroDTO[];

  items : RegistroDTO[];

  quantRegistros : number;

  dataAtual : String;

  horaAtual : String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public registroService : RegistroService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    public professorofertaService : ProfessorOfertaService,
    public usuarioService : UsuarioService,
    public storage : StorageService
    ) {

    this.professorOfertaId = navParams.data.obj;
    
      
  }

  ionViewDidLoad() {

    this.dataAtual =  moment().format("YYYY-MM-DD");

    this.horaAtual = moment().format('HH:mm');

    this.horaInicial = moment().format('HH:mm');

    this.registro.data = moment().format("YYYY-MM-DD");

    this.quantHorarios = 1;

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

      },
      error => {});

    this.professorofertaService.findById(parseInt(this.professorOfertaId.id))
    .subscribe(response => {
      this.profOferta = response;
      this.equivaleHorario = this.profOferta.ofertaId.curriculoId.disciplinaId.equivalenciaMinutos;
     
      this.registroService.registrosPorOferta(this.profOferta.ofertaId.id)
    .subscribe(response => {
      this.items = response;
      this.quantRegistros = this.items.length;
    },
    error => {});

    },
    error => {});

    


    
     
  }

  salvarRegistro(quantHorarios : number, horaInicial : string){

    if(quantHorarios > (this.profOferta.ofertaId.curriculoId.disciplinaId.horaAula - this.quantRegistros) || quantHorarios <= 0){
      this.showInsertQuantRegistros();
    }else{

    for(let i=0; i<quantHorarios; i++){
      this.registro.professorOfertaId.id = this.profOferta.id;
      let timestamp = Math.floor(Date.now() / 1000)
      this.registro.createdAt = JSON.parse(timestamp.toString());
      this.registro.updatedAt = JSON.parse(timestamp.toString());
      this.registro.createdBy = JSON.parse(this.usuario.id);
      this.registro.updatedBy = JSON.parse(this.usuario.id);
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
             if(i == quantHorarios-1){
                this.showInsertOk();
             }
          },
         error => {
           loader.dismiss();
         });
  

      horaInicial = horaFim;

    }
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
            this.paginaAnterior(this.professorOfertaId);
          }
        }
      ]
    });
    alert.present();
  }

  showInsertErro(){
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      message: 'Já existe registro de aula nessa data e horário.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  showInsertQuantRegistros(){
    let alert = this.alertCtrl.create({
      title: 'Erro! Quantidade de horários inválida!',
      message: 'Não é possível salvar essa quantidade de registros.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  paginaAnterior(obj : Object){
    this.navCtrl.setRoot('RegistroProfessorPage', {obj} )
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

  formEdit : FormGroup;

  items : MatriculaDTO[];

  quantAlunos : number;

  frequenciasLancadas : FaltaDTO[];

  quantFrequencias : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public faltaService : FaltaService,
    public registroService : RegistroService,
    public matriculaService : MatriculaService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    private fb: FormBuilder,
    public usuarioService : UsuarioService,
    public storage : StorageService
    ) {

      this.registro = navParams.data.obj;

  }

  ngOnInit() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;
      },
      error => {});



    this.form = new FormGroup({
      frequencias: new FormArray([]),
    });

    this.formEdit = new FormGroup({
      frequenciasEdit: new FormArray([]),
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
      this.quantFrequencias = this.frequenciasLancadas.length;
      for(let i=0; i < this.frequenciasLancadas.length; i++){
        this.addFreqEdit(
          this.frequenciasLancadas[i].id,
          this.frequenciasLancadas[i].matriculaId.id,
          this.frequenciasLancadas[i].matriculaId.contratoId.alunoId.nome,
          this.frequenciasLancadas[i].presenca,
          this.frequenciasLancadas[i].createdBy,
          this.frequenciasLancadas[i].createdAt
        )
      }
    },
    error => {});

  }

  get frequencias() {
    return this.form.controls.frequencias as FormArray;
  }

  get frequenciasEdit() {
    return this.formEdit.controls.frequenciasEdit as FormArray;
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
      createdBy: new FormControl(this.usuario.id),
      updatedBy: new FormControl(this.usuario.id)
    }));
  }

  addFreqEdit(id, matricula, aluno, presenca, createdby, createdat) {
    let timestamp = Math.floor(Date.now() / 1000);
    const arrayfrequencias = this.formEdit.controls.frequenciasEdit as FormArray;
    arrayfrequencias.push(this.fb.group({
      id : new FormControl(id),
      matriculaId: new FormGroup({
        id: new FormControl(matricula)
      }),
      aluno : new FormControl(aluno),
      registroId : new FormGroup({
        id: new FormControl(this.registro.id)
      }),
      presenca: new FormControl(presenca),
      createdAt: new FormControl(createdat),
      updatedAt: new FormControl(JSON.parse(timestamp.toString())),
      createdBy: new FormControl(createdby),
      updatedBy: new FormControl(this.usuario.id) 
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

  editarFrequencias(){
    
    if(this.form.valid) {
    const loader = this.loadingCtrl.create({
      content: "Atualizando frequencias do registro..."
    });
    loader.present();
    this.faltaService.changeDados(this.formEdit.value.frequenciasEdit)
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

  showInsertOkEdit(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Frequencias atualizadas com sucesso.',
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
