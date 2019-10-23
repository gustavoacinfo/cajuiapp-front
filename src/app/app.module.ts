import { AdicionarRegistroPage } from './../pages/professor/registro-professor/registro-professor';
import { MatriculaService } from './../services/domain/matricula.service';
import { NotaAvaliacaoService } from './../services/domain/nota-avaliacao.service';
import { FaltaService } from './../services/domain/falta.service';
import { RegistroService } from './../services/domain/registro.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfessorOfertaService } from '../services/domain/professoroferta.service';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { VisualizarRegistroPage } from '../pages/professor/registro-professor/registro-professor';

@NgModule({
  declarations: [
    MyApp,
    VisualizarRegistroPage,
    AdicionarRegistroPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VisualizarRegistroPage,
    AdicionarRegistroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProfessorOfertaService,
    ErrorInterceptorProvider,
    RegistroService,
    FaltaService,
    NotaAvaliacaoService,
    MatriculaService
  ],
})
export class AppModule {}
