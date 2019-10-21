import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisciplinaProfessorPage } from './disciplina-professor';

@NgModule({
  declarations: [
    DisciplinaProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(DisciplinaProfessorPage),
  ],
})
export class DisciplinaProfessorPageModule {}
