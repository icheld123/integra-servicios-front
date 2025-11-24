import { Component } from '@angular/core';
import { INICIO } from './data';

interface boton  {
  titulo: string;
  ruta: string;
  texto: string;
  image: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  botones_inicio: boton[] = Object.values(INICIO.boton) as boton[];

  constructor() { 
  }

}
