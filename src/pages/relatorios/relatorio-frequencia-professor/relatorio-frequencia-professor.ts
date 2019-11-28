import { FaltaService } from './../../../services/domain/falta.service';
import { MatriculaDTO } from './../../../models/matricula.dto';
import { MatriculaService } from './../../../services/domain/matricula.service';
import { RegistroDTO } from './../../../models/registro.dto';
import { RegistroService } from './../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { FaltaDTO } from '../../../models/falta.dto';

/**
 * Generated class for the RelatorioFrequenciaProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-frequencia-professor',
  templateUrl: 'relatorio-frequencia-professor.html',
})
export class RelatorioFrequenciaProfessorPage {

  profOferta : ProfessorOfertaDTO;

  registros : RegistroDTO[];

  quantRegistros : number;

  alunoId : MatriculaDTO;

  matriculas : MatriculaDTO[];

  quantAlunos : number;

  faltas : FaltaDTO[];

  quantFrequencia : number;

  numFaltas : number;

  taxaFrequencia : number;

  datasFaltas : FaltaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl : ModalController,
    public registroService : RegistroService,
    public matriculaService : MatriculaService,
    public faltaService : FaltaService) {

      this.profOferta = navParams.data.obj;

  }

  ngOnInit() {
    
    this.datasFaltas = new Array();

    this.registroService.registrosPorOferta(this.profOferta.ofertaId.id)
    .subscribe(response => {
      this.registros = response;
      this.quantRegistros = this.registros.length;
    },
    error => {});

    this.matriculaService.matriculasPorOferta(this.profOferta.ofertaId.id)
    .subscribe(response => {
      this.matriculas = response;
      this.quantAlunos = this.matriculas.length;
      if(this.quantAlunos > 0){
        this.alunoId = this.matriculas[0];
        this.relatorioFrequencia();
      }
    },
    error => {});

  }

  relatorioFrequencia(){

    if(this.quantAlunos > 0){

      this.datasFaltas.length = 0;

      this.faltaService.faltasPorOferta(this.profOferta.ofertaId.id, this.alunoId.contratoId.alunoId.id)
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
    
   

  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  adicionaFaltas(falta : FaltaDTO){
    this.datasFaltas.push(falta);
  }

}
