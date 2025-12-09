import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reserva } from '../../shared/models/reserva.model';
import { ToastrService } from 'ngx-toastr';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { Model } from "survey-core";
import { surveyLocalization } from "survey-core";
import "survey-core/survey.i18n";
import "survey-core/i18n/spanish";
import "survey-core/survey-core.min.css";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


Model.platform = "angular";
surveyLocalization.defaultLocale = "es";


@Component({
  selector: 'app-devolucion-modal',
  templateUrl: './devolucion-modal.component.html',
  styleUrl: './devolucion-modal.component.css'
})
export class DevolucionModalComponent {

  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Input() reserva: Reserva | null = null;
  devolucionCompletada: boolean = false;


  devolucionForm: FormGroup;

  constructor(private fb: FormBuilder,
    private prestamoDataService: PrestamoDataService,
    private toastr: ToastrService
  ) {
    this.devolucionForm = this.fb.group({
      id_transaccion: ['', [Validators.required]]
    });
  } 

  ngOnInit(){}

  procesarDevolucion(){
    const devolucion = {
      id_transaccion: this.reserva?.transaccion
    }
    
    this.prestamoDataService.setDevolucion(devolucion).subscribe({
      next: () => {
        this.toastr.success("¡Devolución y encuesta registrada!");
        this.devolucionCompletada = true;
        this.cerrar.emit();
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      }
    });
  }

  close() {
    this.cerrar.emit();
  }
}
