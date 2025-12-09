import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Reserva } from '../../shared/models/reserva.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { Prestamo } from '../../shared/models/prestamo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmar-accion',
  templateUrl: './confirmar-accion.component.html',
  styleUrl: './confirmar-accion.component.css'
})
export class ConfirmarAccionComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Input() reserva: Reserva | null = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  prestamoForm: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private prestamoDataService: PrestamoDataService,
    private toastr: ToastrService
  ){
    this.prestamoForm = this.fb.group({
      password_user: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }


  procesarPrestamo(){
    const PrestamoData: Prestamo = {
      id_transaccion: this.reserva!.transaccion,
      password_user: this.prestamoForm.get('password_user')?.value
    }
    console.log(PrestamoData);

    this.prestamoDataService.setPrestamo(PrestamoData).subscribe({
      next: () => {
        this.toastr.success('¡Prestamo generado!', 'Éxito')
        this.close();
        
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      }
    });
  }

  close() {
    this.cerrar.emit();
    this.prestamoForm.reset();
  }
}
