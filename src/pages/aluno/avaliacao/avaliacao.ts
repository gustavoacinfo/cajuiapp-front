import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { UsuarioDTO } from './../../../models/usuario.dto';
import { AvaliacaoService } from './../../../services/domain/avaliacao.service';
import { NotaAvaliacaoService } from '../../../services/domain/nota-avaliacao.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { NotaAvaliacaoDTO } from '../../../models/nota-avaliacao.dto';
import { LogoutPage } from '../../login/login';

/**
 * Generated class for the AvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao',
  templateUrl: 'avaliacao.html',
})
export class AvaliacaoPage {

  oferta : ProfessorOfertaDTO;

  items : NotaAvaliacaoDTO[];

  pontosDistribuidos : number;

  pontosObtidos : number;

  quantAvaliacoes : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notaavaliacaoService : NotaAvaliacaoService,
    public avaliacaoService : AvaliacaoService,
    public modalCtrl : ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService) {

      this.oferta = navParams.data.obj;
  }

  ionViewDidLoad() {

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.notaavaliacaoService.avaliacoesPorOferta(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.items = response;
          this.quantAvaliacoes = this.items.length;
        },
        error => {});

        this.avaliacaoService.pontosDistribuidos(this.oferta.ofertaId.id, this.oferta.professorId.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosDistribuidos = 0;
          }else{
            this.pontosDistribuidos = response;
          }
          
        },
        error => {});

        this.notaavaliacaoService.pontosObtidos(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          if(response[0] === null){
            this.pontosObtidos = 0;
          }else{
            this.pontosObtidos = response;
          }
        },
        error => {});

      },
      error => {});


    

  }

  home(){
    this.navCtrl.push('HomePage');
  }

  back(){
    this.navCtrl.push('DisciplinaPage');
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}
