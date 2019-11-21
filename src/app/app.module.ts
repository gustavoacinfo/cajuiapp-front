import { RecuperacaoService } from './../services/domain/recuperacao.service';
import { AuthInterceptorProvider } from './../interceptors/auth-interceptor';
import { UsuarioService } from './../services/domain/usuario.service';
import { OfertaService } from './../services/domain/oferta.service';
import { LogoutPage } from './../pages/login/login';
import { AvaliacaoService } from './../services/domain/avaliacao.service';
import { AdicionarRegistroPage, LancarFrequenciaPage, EditarRegistroPage } from './../pages/professor/registro-professor/registro-professor';
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
import { LancarNotasPage, AdicionarAvaliacaoPage, EditarAvaliacaoPage } from '../pages/professor/avaliacao-professor/avaliacao-professor';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { NotaAlunoPage } from '../pages/professor/notas/notas';


@NgModule({
  declarations: [
    MyApp,
    EditarRegistroPage,
    AdicionarRegistroPage,
    LancarNotasPage,
    AdicionarAvaliacaoPage,
    LogoutPage,
    LancarFrequenciaPage,
    EditarAvaliacaoPage,
    NotaAlunoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EditarRegistroPage,
    AdicionarRegistroPage,
    LancarNotasPage,
    AdicionarAvaliacaoPage,
    LogoutPage,
    LancarFrequenciaPage,
    EditarAvaliacaoPage,
    NotaAlunoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProfessorOfertaService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    RegistroService,
    FaltaService,
    NotaAvaliacaoService,
    MatriculaService,
    AvaliacaoService,
    OfertaService,
    AuthService,
    StorageService,
    UsuarioService,
    RecuperacaoService
  ],
})
export class AppModule {}
