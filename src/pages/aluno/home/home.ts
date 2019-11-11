import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { LogoutPage } from '../../login/login';
import { StorageService } from '../../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items : ProfessorOfertaDTO[];

  quantDisciplinas : number;

  constructor(
    public navCtrl: NavController, 
    public NavParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public modalCtrl: ModalController,
    public storage : StorageService,
    public alertCtrl : AlertController ) {

  }

  ionViewDidLoad(){
    if(this.storage.getRole().perfil == 'ALUNO'){
      this.professorofertaService.ofertasAluno()
      .subscribe(response => {
        this.items = response;
        this.quantDisciplinas = this.items.length;
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
              this.navCtrl.setRoot('HomeProfessorPage');
            }
          }
        ]
      });
      alert.present();
    }
  }

  informacoesDisciplina(obj : Object){
    this.navCtrl.push('DisciplinaPage', {obj});
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}



