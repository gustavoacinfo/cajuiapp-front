import { UsuarioService } from './../../services/domain/usuario.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/role';

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
    public auth : AuthService,
    public storage : StorageService,
    public usuarioService : UsuarioService) {
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfulllogin(response.headers.get('Authorization'));
    }, 
    error => {});

    if(localStorage.getItem('localUser') != null){

      this.usuarioService.findByUsername(this.storage.getLocalUser().username)
    .subscribe(response => {
      let role : Role = {
          perfil : response.perfis[0]
      };
      this.storage.setRole(role);
      if(role.perfil == 'ALUNO'){
        this.navCtrl.push('HomePage');
      }else if(role.perfil == 'PROFESSOR'){
        this.navCtrl.push('HomeProfessorPage');
      }
      },
      error => {});

    }
   
  }

  login(){
    this.auth.authentication(this.creds)
      .subscribe(response => {
        this.auth.successfulllogin(response.headers.get('Authorization'));
      }, 
      error => {});

    this.usuarioService.findByUsername(this.creds.username)
    .subscribe(response => {
      let role : Role = {
          perfil : response.perfis[0]
      };
      this.storage.setRole(role);
      if(role.perfil == 'ALUNO'){
        this.navCtrl.push('HomePage');
      }else if(role.perfil == 'PROFESSOR'){
        this.navCtrl.push('HomeProfessorPage');
      }
      },
      error => {});
  }

}

@Component({
  selector: 'page-login',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  usuario : UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public storage : StorageService,
    public usuarioService : UsuarioService,
    public auth : AuthService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.username ){
      this.usuarioService.findByUsername(localUser.username)
      .subscribe(response => {
        this.usuario = response;
      },
      error => {
        if(error.status == 403){
          this.navCtrl.setRoot('LoginPage');
        }
      });
    }else{
      this.navCtrl.setRoot('LoginPage');
    }
  }

  home(){
    this.navCtrl.push('HomeProfessorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  sair(){
    this.auth.logout();
    this.navCtrl.setRoot('LoginPage');
  }

  

}
