import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reserva } from '../../shared/models/reserva.model';
import { ReservaDataService } from '../../shared/services/reserva.data.service';
import { ESTADOS } from '../../shared/constants/estados';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-reserva-modal',
  templateUrl: './editar-reserva-modal.component.html',
  styleUrl: './editar-reserva-modal.component.css'
})
export class EditarReservaModalComponent {
  @Input() abierto = false;
  @Input() reserva: Reserva | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() reservaActualizada = new EventEmitter<void>();
  errorMessage: string | null = null;
  estadosLista: { id: number, nombre: string }[] = [];

  reservaForm: FormGroup;

  constructor( private fb: FormBuilder,
    private reservaService: ReservaDataService,
    private toastr: ToastrService
  ){
    this.reservaForm = this.fb.group({
      fecha_inicio: ['', Validators.required],
      hora_inicio: [{ value: ''}, Validators.required],
      hora_fin: [{ value: '' }, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.reserva) {

      const estadoId = Number(
        Object.keys(ESTADOS).find(
          key => ESTADOS[key].toLowerCase() === this.reserva!.estado_actual
        )
      ) || null;
      this.reservaForm.patchValue({
        fecha_inicio: new Date(this.reserva.fechas.fecha_inicio_transaccion),
        hora_inicio: this.extraerHora(this.reserva.fechas.fecha_inicio_transaccion),
        hora_fin: this.extraerHora(this.reserva.fechas.fecha_fin_transaccion)
      });

    }
  }

  ngOnInit() {
    this.estadosLista = Object.keys(ESTADOS).map(id => ({
      id: Number(id),
      nombre: ESTADOS[id]
    }));
  }

  private extraerHora(fechaISO: string): string {
    return fechaISO.substring(11, 16);
  }

  private extraerFecha(fechaISO: string): string {
    return fechaISO.substring(0, 10);
  }


  editar() {
    if (!this.reserva || this.reservaForm.invalid) return;

    const fechaBase = this.extraerFecha(this.reserva.fechas.fecha_inicio_transaccion);

    const nuevaHoraInicio = this.reservaForm.get('hora_inicio')?.value;
    const nuevaHoraFin = this.reservaForm.get('hora_fin')?.value;

    const fecha_inicio_transaccion = `${fechaBase}T${nuevaHoraInicio}:00`;
    const fecha_fin_transaccion = `${fechaBase}T${nuevaHoraFin}:00`;

    const reservaData = {
      fecha_inicio_transaccion: fecha_inicio_transaccion,
      fecha_fin_transaccion: fecha_fin_transaccion,
      id_transaccion: this.reserva.transaccion,
      id_usuario: this.reserva.usuario.id_usuario,  
    };
    this.reservaService.updateReserva(reservaData).subscribe({
      next: () => {
        this.toastr.success('¡Reserva actualizada!', 'Éxito')
        this.reservaActualizada.emit();
        this.close();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la reserva. Inténtalo de nuevo.';
        this.toastr.error(this.errorMessage, 'Error', { timeOut: 10000 });
      }
    });
  }

  close() {
    this.cerrar.emit();
  }
}
