import { Component, Output } from '@angular/core';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { Recurso } from '../../shared/models/recurso.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  recursoSeleccionado: Recurso | null = null;
  horarioSeleccionado: string | null = null;
  horaInicioSeleccionada: string = '';
  horaFinSeleccionada: string = '';
  fechaSeleccionada: string = '';
  recursos: Recurso[] = [];
  tiposRecursos: TipoRecurso[] = [];
  page: number = 1;
  limit: number = 9;
  skip: number = 0;

  modalAbierto = false;

  filter: FormGroup;

  constructor(private recursoDataService: RecursoDataService,
    private fb: FormBuilder
  ) { 
    this.filter = this.fb.group({
      tipo: [''],
      disponibilidad_completa: [''],
      unidad: [''],
      hora_inicio: ['', [Validators.required]],
      hora_fin: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
    });
    
    this.getTiposRecursos();
  }

  getRecursos() {
    this.skip = (this.page - 1) * this.limit;

    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];

    const filtros = {
      id_unidad: this.filter.value.unidad ? Number(this.filter.value.unidad) : 0,
      id_tipo_recurso: this.filter.value.tipo ? Number(this.filter.value.tipo) : 0,

      ventana_tiempo_inicio: this.filter.value.hora_inicio
        ? `${fechaISO}T${this.filter.value.hora_inicio}:00.000Z`
        : null,

      ventana_tiempo_fin: this.filter.value.hora_fin
        ? `${fechaISO}T${this.filter.value.hora_fin}:00.000Z`
        : null,
      disponibilidad_completa: this.filter.value.disponibilidad_completa || false,
    };

    this.recursoDataService
      .getAllRecursos(this.skip, this.limit, filtros)
      .subscribe((recursos) => {
        this.recursos = recursos;
        
      });
  }

  getTiposRecursos() {
    const filtros = {
      horario_disponibilidad: this.filter.value.horario || null,
      id_unidad: this.filter.value.unidad || null
    };

    this.recursoDataService.getTiposRecursos(filtros)
      .subscribe(tipos => {
        this.tiposRecursos = tipos;
      });
  }

  get filtroValido(): boolean {
    const f = this.filter.value;

    if (!f.fecha_inicio || !f.hora_inicio || !f.hora_fin) return false;

    const horaInicio = f.hora_inicio;
    const horaFin = f.hora_fin;

    return horaFin > horaInicio;
  }


  filterRecursos() {
    this.page = 1;
    this.getRecursos();
  }

  nextPage() {
    this.page++;
    this.getRecursos();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getRecursos();
    }
  }

  abrirModal(recurso: Recurso) {
    this.filter.updateValueAndValidity();

    this.recursoSeleccionado = recurso;

    this.horarioSeleccionado = this.tiposRecursos.find(
      t => t.tipo_recurso.id_tipo_recurso === recurso.id_tipo
    )?.horario || null;

    this.fechaSeleccionada = this.filter.get('fecha_inicio')?.value;
    this.horaInicioSeleccionada = this.filter.get('hora_inicio')?.value;
    this.horaFinSeleccionada = this.filter.get('hora_fin')?.value;

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

}
