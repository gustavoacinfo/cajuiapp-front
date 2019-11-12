import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { MatriculaDTO } from './../../../models/matricula.dto';
import { NotaAvaliacaoService } from './../../../services/domain/nota-avaliacao.service';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { ProfessorOfertaDTO } from './../../../models/professoroferta.dto';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the NotasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notas',
  templateUrl: 'notas.html',
})
export class NotasPage {

  profOferta : ProfessorOfertaDTO;

  matriculas : MatriculaDTO[];

  quantAlunos : number;

  form: FormGroup;

  usuario : UsuarioDTO;

  pontosObtidos : number;

  pontosDistribuidos : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl : ModalController,
    public matriculaService : MatriculaService,
    private fb: FormBuilder,
    public notaAvaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public usuarioService : UsuarioService,
    public storage : StorageService) {


  }

  ngOnInit() {

    this.profOferta = this.navParams.data.obj;

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.avaliacaoService.pontosDistribuidos(this.profOferta.ofertaId.id, this.usuario.id)
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

    this.form = new FormGroup({
      notas: new FormArray([]),
    });

    this.matriculaService.matriculasPorOferta(this.profOferta.ofertaId.id)
    .subscribe(response => {
      this.matriculas = response;
      this.quantAlunos = this.matriculas.length;
      for(let i=0; i <  this.matriculas.length; i++){
        this.notaAvaliacaoService.pontosObtidos(this.profOferta.ofertaId.id, this.matriculas[i].contratoId.alunoId.id)
        .subscribe(response => {
          
          if(response[0] === null){
            this.pontosObtidos = 0;
          }else{
            this.pontosObtidos = response;
          }

          this.addCreds(this.matriculas[i].id, this.pontosObtidos)
        },
        error => {});

        
      }
    },
    error => {});
  }

  get notas() {
    return this.form.controls.notas as FormArray;
  }

  addCreds(matricula, pontosobtidos) {
    let timestamp = Math.floor(Date.now() / 1000);
    const arraynotas = this.form.controls.notas as FormArray;
    arraynotas.push(this.fb.group({
      matriculaId: new FormGroup({
        id: new FormControl(matricula)
      }),
      pontosParcial: new FormControl(pontosobtidos),
      nota: new FormControl({value: null, disabled: true}, { validators: [Validators.required, Validators.min(0), Validators.max(100)]}),
      createdAt: new FormControl(JSON.parse(timestamp.toString())),
      updatedAt: new FormControl(JSON.parse(timestamp.toString())),
      createdBy: new FormControl(this.usuario.id),
      updatedBy: new FormControl(this.usuario.id) 
      
    }));
  }

  salvarRecuperacao(){
    console.log(this.form.value.notas);
  }

  

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}
