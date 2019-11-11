import { UsuarioDTO } from './../../../models/usuario.dto';
import { ProfessorOfertaDTO } from './../../../models/professoroferta.dto';
import { ProfessorOfertaService } from './../../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { StorageService } from '../../../services/storage.service';
import { UsuarioService } from '../../../services/domain/usuario.service';

/**
 * Generated class for the HomeProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-professor',
  templateUrl: 'home-professor.html',
})
export class HomeProfessorPage {

  items : ProfessorOfertaDTO[];

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService : ProfessorOfertaService,
    public modalCtrl : ModalController,
    public storage : StorageService,
    public alertCtrl : AlertController,
    public usuarioService : UsuarioService
    ) {

      
  }

  ionViewDidLoad() {
    if(this.storage.getRole().perfil == 'PROFESSOR'){

    this.usuarioService.findByUsername(this.storage.getLocalUser().username)
    .subscribe(response => {
      this.usuario = response;

      this.professorofertaService.ofertasProfessor(this.usuario.id)
      .subscribe(response => {
        this.items = response;
      },
      error => {});
    },
    error => {});
    
    }else{
      let alert = this.alertCtrl.create({
        title: 'Erro!',
        message: 'Usuário não possui permissão para acessar essa página!',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot('HomePage');
            }
          }
        ]
      });
      alert.present();
    }
  }

  acessarDisciplina(obj : Object){
    this.navCtrl.push('DisciplinaProfessorPage', {obj});
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }


}
