import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

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
    username: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth : AuthService) {
  }

  ionViewDidLoad() {
  }

  login(){
    this.auth.authentication(this.creds)
      .subscribe(response => {
        this.auth.successfulllogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('HomePage');
      }, 
      error => {});


    // if(this.creds.username == 'aluno'){
    //   console.log(this.creds);
    //   this.navCtrl.setRoot('HomePage');
    // }else{
    //   console.log(this.creds);
    //   this.navCtrl.setRoot('HomeProfessorPage');
    // }
  }

}

@Component({
  selector: 'page-login',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  sair(){
    this.navCtrl.setRoot('LoginPage');
  }

  

}
