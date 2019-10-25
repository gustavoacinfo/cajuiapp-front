import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvaliacaoProfessorPage, LancarNotasPage } from './avaliacao-professor';

@NgModule({
  declarations: [
    AvaliacaoProfessorPage
  ],
  imports: [
    IonicPageModule.forChild(AvaliacaoProfessorPage),
  ],
})
export class AvaliacaoProfessorPageModule {}
