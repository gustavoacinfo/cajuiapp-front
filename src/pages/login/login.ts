import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  creds : CredenciaisDTO = {
    usuario: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  login(){
    if(this.creds.usuario == 'aluno'){
      console.log(this.creds);
      this.navCtrl.setRoot('HomePage');
    }else{
      console.log(this.creds);
      this.navCtrl.setRoot('ProfessorHomePage');
    }
  }

}
