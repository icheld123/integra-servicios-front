import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Recurso } from '../../shared/models/recurso.model';
import { RecursoNuevo } from '../../shared/models/reserva.model';
import { ToastrService } from 'ngx-toastr';
import { RecursoDataService } from '../../shared/services/recurso.data.service';


@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrl: './reserva-modal.component.css'
})
export class ReservaModalComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Input() recursoNombre: Recurso = {} as Recurso;

  reservaForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private recursoDataService: RecursoDataService
  ) {

    this.reservaForm = this.fb.group({
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      hora_inicio: ['', [Validators.required]],
      hora_fin: ['', [Validators.required]],
    });
  }

  private getDiaSemana(fecha: Date): string {
    const dias = [
      "Domingo", "Lunes", "Martes", "Miércoles",
      "Jueves", "Viernes", "Sabado"
    ];
    return dias[fecha.getDay()];
  }

  private horaEnRango(hora: string, inicio: string, fin: string): boolean {
    const h = hora + ":00"; // convertir "8:00" en "8:00:00"
    return h >= inicio && h <= fin;
  }

  procesarReserva() {
    if (this.reservaForm.invalid) return;

    const fechaInicio = this.reservaForm.get('fecha_inicio')?.value;
    const horaInicio = this.reservaForm.get('hora_inicio')?.value;
    const fechaFin = this.reservaForm.get('fecha_fin')?.value;
    const horaFin = this.reservaForm.get('hora_fin')?.value;

    const diaInicio = this.getDiaSemana(fechaInicio);
    const diaFin = this.getDiaSemana(fechaFin);

    const horarioDiaInicio = this.recursoNombre.horario_disponible?.find(h => h.dia === diaInicio);
    const horarioDiaFin = this.recursoNombre.horario_disponible?.find(h => h.dia === diaFin);

    // VALIDACIÓN DE HORARIOS
    if (!horarioDiaInicio || !this.horaEnRango(horaInicio, horarioDiaInicio.horarios[0].hora_inicio, horarioDiaInicio.horarios[0].hora_fin)) {
      this.errorMessage = `La hora de inicio no está dentro del horario permitido para ${diaInicio}.`;
      return;
    }

    if (!horarioDiaFin || !this.horaEnRango(horaFin, horarioDiaFin.horarios[0].hora_inicio, horarioDiaFin.horarios[0].hora_fin)) {
      this.errorMessage = `La hora de fin no está dentro del horario permitido para ${diaFin}.`;
      return;
    }

    // SI TODO ES VÁLIDO → permitir el envío
    const ReservaData: RecursoNuevo = {
      fecha_inicio_transaccion: this.formato(fechaInicio, horaInicio),
      fecha_fin_transaccion: this.formato(fechaFin, horaFin),
      estado_transaccion: 'PENDIENTE',
      falla_servicio: '1',
      id_tipo_transaccion: 1,
      id_usuario: this.authService.getCurrentUser()!.id_usuario,
      id_recurso: this.recursoNombre.id_recurso
    };

    this.recursoDataService.createReserva(ReservaData).subscribe({
      next: () => this.toastr.success('¡Reserva generada!', 'Éxito'),
      error: () => {
        this.errorMessage = 'Error al generar la reserva. Inténtalo de nuevo.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }


  formato(fecha: Date, hora: string) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d} ${hora}`;
  }
  

  close() {
    this.cerrar.emit();
    this.reservaForm.reset();
  }
}
