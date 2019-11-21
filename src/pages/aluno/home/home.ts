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

  pdfNotas = null;

  constructor(
    public navCtrl: NavController, 
    public NavParams: NavParams,
    public professorofertaService: ProfessorOfertaService,
    public modalCtrl: ModalController,
    public storage : StorageService,
    public alertCtrl : AlertController,
    public usuarioService : UsuarioService, 
    private plt: Platform) {


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

  logout(){
    let modal = this.modalCtrl.create(LogoutPage);
    modal.present();
  }

  createPdfNotas() {
    var docDefinition = {
      content: [
        { text: 'RESUMO DE NOTAS POR DISCIPLINAS', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'Aluno: '+ this.usuario.nome , style: 'subheader' },
        { text: 'E-mail: '+ this.usuario.email , style: 'subheader' },
        
        { text: 'Notas por Disciplinas', style: 'story', margin: [0, 20, 0, 20] },

      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfNotas = pdfMake.createPdf(docDefinition);
  }

  downloadPdf() {
    this.createPdfNotas();
    if (this.plt.is('cordova')) {
      this.pdfNotas.getBuffer((buffer) => {

        // Save the PDF to the data Directory of our App
        // this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
        //   // Open the PDf with the correct OS tools
        //   this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        // })
      });
    } else {
      // On a browser simply use download!
      this.pdfNotas.download();
    }
  }



}



