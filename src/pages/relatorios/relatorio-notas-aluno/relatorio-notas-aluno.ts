import { NotaAvaliacaoDTO } from './../../../models/nota-avaliacao.dto';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { NotaAvaliacaoService } from './../../../services/domain/nota-avaliacao.service';
import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { ContratoService } from './../../../services/domain/contrato.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { ContratoDTO } from '../../../models/contrato.dto';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';

/**
 * Generated class for the RelatorioNotasAlunoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-notas-aluno',
  templateUrl: 'relatorio-notas-aluno.html',
})
export class RelatorioNotasAlunoPage {

  usuario : UsuarioDTO;

  contrato : ContratoDTO;

  items : ProfessorOfertaDTO[];

  profOfertaId : ProfessorOfertaDTO;

  notas : NotaAvaliacaoDTO[];

  pontosObtidos : number;

  pontosDistribuidos : number;

  quantAvaliacoes : number;

  aproveitamento : number;

  maiorNota : number;

  menorNota : number;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public contratoService : ContratoService,
    public professorOfertaService : ProfessorOfertaService,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService) {


  }

  ngOnInit() {

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
          this.relatorioNotas();
        },
        error => {});

      },
      error => {});
    
  }

  relatorioNotas(){

    this.notaavaliacaoService.avaliacoesPorOferta(this.profOfertaId.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.notas = response;
          this.quantAvaliacoes = this.notas.length;
          
          let array : number[] = [];

          if(this.quantAvaliacoes > 0 && this.notas != null){
            for(let i=0; i<this.quantAvaliacoes; i++){
              array.push(this.notas[i].nota);
            }
            array.sort(this.compararNumeros);
            this.menorNota = array[0];
            this.maiorNota = array[this.quantAvaliacoes - 1];
          }
          

        },
        error => {});

        this.avaliacaoService.pontosDistribuidos(this.profOfertaId.ofertaId.id, this.profOfertaId.professorId.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }


          this.notaavaliacaoService.pontosObtidos(this.profOfertaId.ofertaId.id, this.usuario.id)
          .subscribe(response => {
            if(response[0] === null){
              this.pontosObtidos = 0;
            }else{
              this.pontosObtidos = response;
            }

            if(this.pontosDistribuidos > 0){
              this.aproveitamento = (this.pontosObtidos * 100) / this.pontosDistribuidos;
            }else{
              this.aproveitamento = 0;
            }
            
          },
          error => {});
        },
        error => {});

        


  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  compararNumeros(a, b) {
    return a - b;
  }

  verNotas(obj : Object){;
    this.navCtrl.push('AvaliacaoPage', {obj});
  }

  home(){
    this.navCtrl.push('HomePage');
  }


}
