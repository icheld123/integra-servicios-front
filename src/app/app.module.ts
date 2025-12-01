import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
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
