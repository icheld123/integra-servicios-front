import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Recurso } from '../../shared/models/recurso.model';
import { ReservaNueva } from '../../shared/models/reserva.model';
import { ToastrService } from 'ngx-toastr';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { HORARIOS } from '../../shared/constants/horarios';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrl: './reserva-modal.component.css'
})
export class ReservaModalComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Input() recurso: Recurso = {} as Recurso;
  @Input() horario: string = '';
  @Input() horaInicio: string = '';
  @Input() horaFin: string = '';
  @Input() fecha: string = '';


  reservaForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private recursoDataService: RecursoDataService
  ) {

    this.reservaForm = this.fb.group({
      fecha_inicio: ['', Validators.required],
      hora_inicio: [{ value: ''}, Validators.required],
      hora_fin: [{ value: '' }, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.fecha) {
      this.reservaForm.patchValue({
        fecha_inicio: new Date(this.fecha)
      });
      this.reservaForm.get('fecha_inicio')?.disable();
    }

    if (this.horaInicio && this.horaFin) {
      this.reservaForm.get('hora_inicio')?.disable();
      this.reservaForm.get('hora_fin')?.disable();

      this.reservaForm.patchValue({
        hora_inicio: this.horaInicio.substring(0, 5),
        hora_fin: this.horaFin.substring(0, 5),
      });
    }
  }

  procesarReserva() {
    if (this.reservaForm.invalid) return;

    const fechaControl = this.reservaForm.get('fecha_inicio')?.value;
    const fechaISO = new Date(fechaControl).toISOString().split('T')[0]; // "YYYY-MM-DD"

    const fecha_inicio_transaccion = `${fechaISO} ${this.horaInicio}`;
    const fecha_fin_transaccion    = `${fechaISO} ${this.horaFin}`;

    const ReservaData: ReservaNueva = {
      fecha_inicio_transaccion,
      fecha_fin_transaccion,
      estado_transaccion: 'PENDIENTE',
      falla_servicio: '1',
      id_tipo_transaccion: 1,
      id_usuario: this.authService.getCurrentUser()!.id_usuario,
      id_recurso: this.recurso.id_recurso
    };

    this.recursoDataService.createReserva(ReservaData).subscribe({
      next: () => {
        this.toastr.success('¡Reserva generada!', 'Éxito')
        this.close();
        
      },
      error: (e) => {
        this.toastr.error(e.error.detail, 'Error');
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
