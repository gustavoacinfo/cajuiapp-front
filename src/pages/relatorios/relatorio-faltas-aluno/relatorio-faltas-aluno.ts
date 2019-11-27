import { RegistroDTO } from './../../../models/registro.dto';
import { FaltaService } from './../../../services/domain/falta.service';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { StorageService } from '../../../services/storage.service';
import { ContratoService } from '../../../services/domain/contrato.service';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { ContratoDTO } from '../../../models/contrato.dto';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { FaltaDTO } from '../../../models/falta.dto';

/**
 * Generated class for the RelatorioFaltasAlunoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-faltas-aluno',
  templateUrl: 'relatorio-faltas-aluno.html',
})
export class RelatorioFaltasAlunoPage {

  usuario : UsuarioDTO;

  contrato : ContratoDTO;

  items : ProfessorOfertaDTO[];

  profOfertaId : ProfessorOfertaDTO;

  registros : RegistroDTO[];

  faltas : FaltaDTO[];

  datasFaltas : Array<FaltaDTO>;

  quantRegistros : number;

  quantFrequencia : number;

  numFaltas : number;

  taxaFrequencia : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public contratoService : ContratoService,
    public professorOfertaService : ProfessorOfertaService,
    public registroService : RegistroService,
    public faltaService : FaltaService) {
  }

  ngOnInit() {

    this.datasFaltas = new Array();

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.contratoService.contratoDoAluno(this.usuario.id)
        .subscribe(response => {
          this.contrato = response;
        },
        error => {});

        this.professorOfertaService.ofertasAluno(this.usuario.id)
        .subscribe(response => {
          this.items = response;
          this.profOfertaId = this.items[0];
          this.relatorioFaltas();
        },
        error => {});

      },
      error => {});
  }

  relatorioFaltas(){

    this.faltaService.faltasPorOferta(this.profOfertaId.ofertaId.id, this.usuario.id)
    .subscribe(response => {
      this.faltas = response;
      this.quantFrequencia = this.faltas.length;
      let falta = 0;
      for(let i=0; i<this.quantFrequencia; i++){
        if(this.faltas[i].presenca === false){
          falta = falta + 1;
          this.adicionaFaltas(this.faltas[i]);
        }
      }

      if(this.quantFrequencia > 0){
        this.numFaltas = falta;
        this.taxaFrequencia = (this.numFaltas * 100) / this.quantFrequencia;
      }else{
        this.taxaFrequencia = 0;
      }
      
    },
    error => {});

  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  home(){
    this.navCtrl.push('HomePage');
  }

  adicionaFaltas(falta : FaltaDTO){
    this.datasFaltas.push(falta);
  }


}
