import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { InicioComponent } from './feature/inicio/inicio.component';
import { RegistroComponent } from './feature/registro/registro.component';
import { InicioSesionComponent } from './feature/inicio-sesion/inicio-sesion.component';
import { CarruselInicioComponent } from './feature/carrusel-inicio/carrusel-inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    InicioComponent,
    RegistroComponent,
    InicioSesionComponent,
    CarruselInicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
