import { UsuarioService } from './../../services/domain/usuario.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController, LoadingController } from 'ionic-angular';
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
    public usuarioService : UsuarioService,
    public modalCtrl : ModalController ) {
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfulllogin(response.headers.get('Authorization'));

      this.usuarioService.findByUsername(this.storage.getLocalUser().username)
    .subscribe(response => {
      let role : Role = {
          perfil : response.perfis[0]
      };
      this.storage.setRole(role);
      if(role.perfil == 'ALUNO'){
        this.navCtrl.setRoot('HomePage');
      }else if(role.perfil == 'PROFESSOR'){
        this.navCtrl.setRoot('HomeProfessorPage');
      }
      },
      error => {});

    }, 
    error => {});
   
  }

  login(){
    this.auth.authentication(this.creds)
      .subscribe(response => {
        this.auth.successfulllogin(response.headers.get('Authorization'));

        this.usuarioService.findByUsername(this.creds.username)
        .subscribe(response => {
          let role : Role = {
              perfil : response.perfis[0]
          };
          this.storage.setRole(role);
          if(role.perfil == 'ALUNO'){
            this.navCtrl.setRoot('HomePage');
          }else if(role.perfil == 'PROFESSOR'){
            this.navCtrl.setRoot('HomeProfessorPage');
          }
          },
          error => {});
      }, 
      error => {});


    
  }

  alterarSenha(){
    let modal = this.modalCtrl.create(AlterarSenhaPage);
    modal.present();
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
    public auth : AuthService,
    public modalCtrl : ModalController ) {
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

  alterarSenha(){
    let modal = this.modalCtrl.create(AlterarSenhaPage);
    modal.present();
  }

  

}

@Component({
  selector: 'page-login',
  templateUrl: 'alterar-senha.html',
})
export class AlterarSenhaPage {

  logado : Object;

  usuario : UsuarioDTO;

  recuperarSenha = {
    username:"",
    senhaAtual:"",
    novaSenha:"",
    confimacaoSenha:"",
  }

  creds : CredenciaisDTO = {
    username: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public storage : StorageService,
    public usuarioService : UsuarioService,
    public auth : AuthService,
    public alertCtrl : AlertController,
    public loadingCtrl : LoadingController
    ) {
  }

  ionViewDidLoad() {

    this.logado = this.storage.getLocalUser();

    if(this.logado != null){
      this.recuperarSenha.username = this.storage.getLocalUser().username;
    }
    
  }

  redefinir(){
    
      this.creds.username = this.recuperarSenha.username;
      this.creds.senha = this.recuperarSenha.senhaAtual;

      this.auth.authentication(this.creds)
      .subscribe(response => {

        let tamanhoSenha = this.recuperarSenha.novaSenha.length;

        let igualAnterior = this.recuperarSenha.senhaAtual.localeCompare(this.recuperarSenha.novaSenha);

        let igual = this.recuperarSenha.novaSenha.localeCompare(this.recuperarSenha.confimacaoSenha);

        if(igualAnterior == 0){
          this.showMesmaSenha();
        }else
        if(tamanhoSenha < 6){
          this.showTamanhoSenha();
        }else 
        if(igual == 1){
          this.showSenhaIgual();
        }else{

          this.usuarioService.findByUsername(this.recuperarSenha.username)
          .subscribe(response => {
            this.usuario = response;

            if(this.usuario != null){

              const loader = this.loadingCtrl.create({
                content: "Alterando avaliacão..."
              });
              loader.present();

              let timestamp = Math.floor(Date.now() / 1000)
              this.usuario.updatedAt = JSON.parse(timestamp.toString());

              this.usuario.authKey = this.recuperarSenha.novaSenha;

              this.usuarioService.changeDados(this.usuario)
              .subscribe(response => {
                loader.dismiss();
                switch(response.status) {
                  case 200:
                      this.handle200();
                    break;
                }
              }, 
              error => {
                loader.dismiss();
              });

            }

          },
          error => {});

        }



      }, 
      error => {});


    
    

  }

  handle200() {
    let alert = this.alertCtrl.create({
        title: 'Sucesso!',
        message: 'Senha alterada com sucesso!',
        enableBackdropDismiss: false,
        buttons: [
            {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot('LoginPage');
                }
            }
        ]
    });
    alert.present();
  }

  showTamanhoSenha(){
    let alert = this.alertCtrl.create({
      title: 'Erro! Nova senha inválida!',
      message: 'A nova senha deve ter no mínimo 6 caracteres.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  showSenhaIgual(){
    let alert = this.alertCtrl.create({
      title: 'Erro! Senhas diferentes!',
      message: 'A senha de confirmação está diferente.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  showMesmaSenha(){
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      message: 'A nova senha deve ser diferente da senha atual.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

}

