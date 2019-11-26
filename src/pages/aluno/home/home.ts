import { UsuarioService } from './../../../services/domain/usuario.service';
import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';
import { LogoutPage } from '../../login/login';
import { StorageService } from '../../../services/storage.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items : ProfessorOfertaDTO[];

  quantDisciplinas : number;

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public NavParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public modalCtrl: ModalController,
    public storage : StorageService,
    public alertCtrl : AlertController,
    public usuarioService : UsuarioService) {


  }

  ionViewDidLoad(){
    if(localStorage.getItem('localUser') == null){
      this.navCtrl.setRoot('LoginPage');

    }else
    if(this.storage.getRole().perfil == 'ALUNO'){

      this.usuarioService.findByUsername(this.storage.getLocalUser().username)
      .subscribe(response => {
        this.usuario = response;

        this.professorofertaService.ofertasAluno(this.usuario.id)
        .subscribe(response => {
          this.items = response;
          this.quantDisciplinas = this.items.length;
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

  relatorioNotas(){
    this.navCtrl.push('RelatorioNotasAlunoPage')
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

}



