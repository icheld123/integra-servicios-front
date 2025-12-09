import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SurveyModule } from "survey-angular-ui";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { InicioComponent } from './feature/inicio/inicio.component';
import { RegistroComponent } from './feature/registro/registro.component';
import { InicioSesionComponent } from './feature/inicio-sesion/inicio-sesion.component';
import { CarruselInicioComponent } from './feature/carrusel-inicio/carrusel-inicio.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { AuthService } from './core/services/auth/auth.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HttpgeneralService } from './core/services/http-general.service';
import { ReservaModalComponent } from './feature/reserva-modal/reserva-modal.component';
import { MiPerfilComponent } from './feature/mi-perfil/mi-perfil.component';
import { EditarReservaModalComponent } from './feature/editar-reserva-modal/editar-reserva-modal.component';
import { PrestamoComponent } from './feature/prestamo/prestamo.component';
import { ConfirmarAccionComponent } from './feature/confirmar-accion/confirmar-accion.component';
import { DevolucionModalComponent } from './feature/devolucion-modal/devolucion-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    InicioComponent,
    RegistroComponent,
    InicioSesionComponent,
    CarruselInicioComponent,
    DashboardComponent,
    ReservaModalComponent,
    MiPerfilComponent,
    EditarReservaModalComponent,
    PrestamoComponent,
    ConfirmarAccionComponent,
    DevolucionModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    TextFieldModule,
    MatTableModule,
    SurveyModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    provideNativeDateAdapter(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    HttpgeneralService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
