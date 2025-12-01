import { Component } from '@angular/core';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { Recurso } from '../../shared/models/recurso.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  recursos: Recurso[] = [];
  tiposRecursos: TipoRecurso[] = [];
  page: number = 1;
  limit: number = 9;
  skip: number = 0;

  filter: FormGroup;

  constructor(private recursoDataService: RecursoDataService,
    private fb: FormBuilder
  ) { 
    this.filter = this.fb.group({
      tipo: [''],
      estado: [''],
      unidad: [''],
      horario: ['']
    });
    this.getRecursos();
    this.getTiposRecursos();
  }

  getRecursos() {
    this.skip = (this.page - 1) * this.limit;

    const filtros = {
      estado_recurso: this.filter.value.estado || null,
      id_tipo_recurso: this.filter.value.tipo ? Number(this.filter.value.tipo) : null,
      id_unidad: this.filter.value.unidad || null
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

  ngOnInit() {
    this.getRecursos();
  }

  reservarRecurso(recurso: Recurso) {
    console.log('Recurso reservado:', recurso);
  }
}
