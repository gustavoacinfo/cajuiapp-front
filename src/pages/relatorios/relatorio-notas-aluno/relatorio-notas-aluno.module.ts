import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelatorioNotasAlunoPage } from './relatorio-notas-aluno';

@NgModule({
  declarations: [
    RelatorioNotasAlunoPage,
  ],
  imports: [
    IonicPageModule.forChild(RelatorioNotasAlunoPage),
  ],
})
export class RelatorioNotasAlunoPageModule {}
