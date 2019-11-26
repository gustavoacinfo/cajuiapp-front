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

  profOfertaId : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public contratoService : ContratoService,
    public professorOfertaService : ProfessorOfertaService) {


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
          console.log(this.items);
        },
        error => {});

      },
      error => {});
    
  }

  relatorioNotas(){
    console.log(this.profOfertaId)
  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  home(){
    this.navCtrl.push('HomePage');
  }


}
