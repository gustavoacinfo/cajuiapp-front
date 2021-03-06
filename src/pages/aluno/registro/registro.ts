import { StorageService } from './../../../services/storage.service';
import { UsuarioService } from './../../../services/domain/usuario.service';
import { RegistroService } from '../../../services/domain/registro.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { FaltaService } from '../../../services/domain/falta.service';
import { FaltaDTO } from '../../../models/falta.dto';
import { LogoutPage } from '../../login/login';
import { UsuarioDTO } from '../../../models/usuario.dto';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  oferta : ProfessorOfertaDTO;

  faltas : FaltaDTO[];

  itemsFilter : FaltaDTO[];

  quantFalta : number;

  quantFrequencia : number;

  quantRegistro : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public registroService : RegistroService,
    public faltaService : FaltaService,
    public modalCtrl : ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService) {

      this.oferta = navParams.data.obj;

  }

  ionViewDidLoad(){

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.faltaService.faltasPorOferta(this.oferta.ofertaId.id, this.usuario.id)
        .subscribe(response => {
          this.faltas = response;
          this.quantFrequencia = this.faltas.length;
          this.initializeItems();
        },
        error => {});

      },
      error => {});

  }

  initializeItems() {
    this.itemsFilter = this.faltas;
  }

  getItems(ev: any) {
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.itemsFilter = this.itemsFilter.filter((item) => {
        return (item.registroId.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
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
