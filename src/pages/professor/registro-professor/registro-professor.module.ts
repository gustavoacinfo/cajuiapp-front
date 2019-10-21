import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroProfessorPage } from './registro-professor';

@NgModule({
  declarations: [
    RegistroProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroProfessorPage),
  ],
})
export class RegistroProfessorPageModule {}
