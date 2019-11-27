import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelatorioFaltasAlunoPage } from './relatorio-faltas-aluno';

@NgModule({
  declarations: [
    RelatorioFaltasAlunoPage,
  ],
  imports: [
    IonicPageModule.forChild(RelatorioFaltasAlunoPage),
  ],
})
export class RelatorioFaltasAlunoPageModule {}
