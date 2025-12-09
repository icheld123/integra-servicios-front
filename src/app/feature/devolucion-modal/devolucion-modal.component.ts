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

  surveyModel!: Model;
  devolucionForm: FormGroup;

  constructor(private fb: FormBuilder,
    private prestamoDataService: PrestamoDataService,
    private toastr: ToastrService
  ) {
    this.devolucionForm = this.fb.group({
      id_transaccion: ['', [Validators.required]]
    });
  } 

  ngOnChanges() {
    if (this.abierto && this.reserva) {
      this.cargarEncuesta();
    }
  }

  ngOnInit(){}

  procesarDevolucion(){
    const devolucion = {
      id_transaccion: this.reserva?.transaccion
    }
    this.devolucionCompletada = true;

    // this.prestamoDataService.setDevolucion(data).subscribe({
    //   next: () => {
    //     this.toastr.success("¡Devolución y encuesta registrada!");
    //   },
    //   error: () => {
    //     this.toastr.error("Error registrando la encuesta.");
    //   }
    // });
  }

  cargarEncuesta() {
    const json = this.jsonEncuesta();

    const elemento = json.pages[0].elements.find((el: any) => el.name === "id_transaccion");

    if (elemento) {
      (elemento as any).defaultValue = this.reserva?.transaccion;
    }

    this.surveyModel = new Model(json);

    this.surveyModel.onComplete.add((sender) => {

      const encuesta = {
        cumplimiento_horarios: sender.data.cumplimiento_horarios,
        calidad_servicio: sender.data.calidad_servicio,
        atencion_personal: sender.data.atencion_personal,
        id_transaccion: this.reserva?.transaccion
      }
      this.cerrar.emit();
      // this.prestamoDataService.enviarEncuesta(data).subscribe({
      //   next: () => {
      //     this.toastr.success("¡Encuesta registrada!");
      //     this.cerrar.emit();
      //   },
      //   error: () => {
      //     this.toastr.error("Error registrando la encuesta.");
      //   }
      // });

    });
  }

  jsonEncuesta() {
    return {
      title: "Califica el servicio",
      showQuestionNumbers: "off",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "rating",
              name: "cumplimiento_horarios",
              title: "¿Cumplimos con los horarios?",
              rateMin: 1,
              rateMax: 5,
              isRequired: true
            },
            {
              type: "rating",
              name: "calidad_servicio",
              title: "¿Cómo calificas la calidad del servicio?",
              rateMin: 1,
              rateMax: 5,
              isRequired: true
            },
            {
              type: "rating",
              name: "atencion_personal",
              title: "¿Cómo calificas la atención del personal?",
              rateMin: 1,
              rateMax: 5,
              isRequired: true
            },
            {
              type: "text",
              name: "id_transaccion",
              visible: false
            }
          ]
        }
      ]
    };
  }

  close() {
    this.cerrar.emit();
  }
}
