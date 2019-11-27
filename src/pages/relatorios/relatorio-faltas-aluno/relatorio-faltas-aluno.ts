import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogoutPage } from '../../login/login';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { StorageService } from '../../../services/storage.service';
import { ContratoService } from '../../../services/domain/contrato.service';
import { ProfessorOfertaService } from '../../../services/domain/professoroferta.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { ContratoDTO } from '../../../models/contrato.dto';
import { ProfessorOfertaDTO } from '../../../models/professoroferta.dto';

/**
 * Generated class for the RelatorioFaltasAlunoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relatorio-faltas-aluno',
  templateUrl: 'relatorio-faltas-aluno.html',
})
export class RelatorioFaltasAlunoPage {

  usuario : UsuarioDTO;

  contrato : ContratoDTO;

  items : ProfessorOfertaDTO[];

  profOfertaId : ProfessorOfertaDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public usuarioService : UsuarioService,
    public storage : StorageService,
    public contratoService : ContratoService,
    public professorOfertaService : ProfessorOfertaService,) {
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
          this.profOfertaId = this.items[0];
          this.relatorioFaltas();
        },
        error => {});

      },
      error => {});
  }

  relatorioFaltas(){

    console.log(this.profOfertaId);

  }

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  home(){
    this.navCtrl.push('HomePage');
  }


}
