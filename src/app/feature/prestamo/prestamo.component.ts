import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Recurso } from '../../shared/models/recurso.model';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { Usuario, UsuarioResponse } from '../../shared/models/usuario.model';
import { UsuarioDataService } from '../../shared/services/usuario.data.service';
import { ReservaDataService } from '../../shared/services/reserva.data.service';
import { Reserva } from '../../shared/models/reserva.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.css'
})
export class PrestamoComponent {
  recursoSeleccionado: Recurso | null = null;
  horarioSeleccionado: string | null = null;
  horaInicioSeleccionada: string = '';
  horaFinSeleccionada: string = '';
  fechaSeleccionada: string = '';
  recursos: Recurso[] = [];
  tiposRecursos: TipoRecurso[] = [];
  selectedUser: UsuarioResponse | null = null;
  reservasPorUsuario: Reserva[] = [];
  reservaSeleccionada: Reserva | null = null;
  esDevolucion: boolean = false;
  page: number = 1;
  limit: number = 9;
  skip: number = 0;

  modalAbierto = false;

  filter: FormGroup;
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioDataService: UsuarioDataService,
    private reservaDataService: ReservaDataService,
    private toastr: ToastrService
  ) { 
    this.filter = this.fb.group({
      estado_1: [false], // Reservada
      estado_2: [false], // En prestamo
      estado_3: [false], // Cancelada
      estado_4: [false], // Completada
    });

    this.usuarioForm = this.fb.group({
      usuario: ['', [Validators.required]]
    });
  }

  buscarUsuario() {
    const texto = this.usuarioForm.get('usuario')?.value?.trim();
    if (!texto) return;

    this.usuarioDataService.getUsuarioByEmail(texto).subscribe({
      next: (res) => {
        this.seleccionarUsuario(res);
      },
      error: (err) => this.toastr.error(err.error.detail, 'Error')
    });
  }

  seleccionarUsuario(usuario: UsuarioResponse) {
    this.selectedUser = usuario;

    this.filter.patchValue({
      usuario: usuario.usuario.id_usuario
    });

    this.usuarioForm.get('usuario')?.disable();
  }

  getReservas(){
    this.skip = (this.page - 1) * this.limit;
    if (!this.selectedUser) {
      console.error('No hay usuario cargado');
      return;
    }

    const estados = this.filter.value;

    const estado_transaccion: number[] = [];

    if (estados.estado_1) estado_transaccion.push(1);
    if (estados.estado_2) estado_transaccion.push(2);
    if (estados.estado_3) estado_transaccion.push(3);
    if (estados.estado_4) estado_transaccion.push(4);

    const payload = {
      id_usuario: this.selectedUser.usuario.id_usuario,
      estado_transaccion
    };

    this.reservaDataService.getReservas(payload).subscribe({
      next: (r) => {
        this.reservasPorUsuario = r;
      },
      error: (e) => this.toastr.error(e.error.detail, 'Error')
    });
  }

  reiniciarBusqueda() {
    this.usuarioForm.reset();
    this.usuarioForm.enable(); 

    this.filter.reset({
      estado_1: false,
      estado_2: false,
      estado_3: false,
      estado_4: false
    });

    this.selectedUser = null;
    this.reservasPorUsuario = [];
    this.page = 1;
    this.skip = 0;

  }

  nextPage() {
    this.page++;
    this.getReservas();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getReservas();
    }
  }

  abrirModal(reserva: Reserva) {
    this.reservaSeleccionada = reserva;

    this.esDevolucion = reserva.estado_actual.id_estado_transaccion === 2;

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }
}
