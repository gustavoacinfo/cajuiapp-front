import { RegistroService } from './../../services/domain/registro.service';
import { ProfessorOfertaService } from './../../services/domain/professoroferta.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorOfertaDTO } from '../../models/professoroferta.dto';
import { RegistroDTO } from '../../models/registro.dto';

/**
 * Generated class for the DisciplinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disciplina',
  templateUrl: 'disciplina.html',
})
export class DisciplinaPage {

  items : ProfessorOfertaDTO;

  registros : RegistroDTO[];

  quantRegistros : number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public registroService : RegistroService) {

      this.items = navParams.data.obj;
      
  }

  ionViewDidLoad(){
    this.registroService.registrosPorOferta(this.items.id)
    .subscribe(response => {
      this.registros = response;
      this.quantRegistros = this.registros.length;
    },
    error => {});
    
  }

  home(){
    this.navCtrl.push('HomePage');
  }

  registrosDisciplina(obj : Object){;
    this.navCtrl.push('RegistroPage', {obj});
  }

  avaliacoesDisciplina(obj : Object){;
    this.navCtrl.push('AvaliacaoPage', {obj});
  }

  

  

}
