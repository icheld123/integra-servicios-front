import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reserva } from '../../shared/models/reserva.model';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { ToastrService } from 'ngx-toastr';
import { Model } from "survey-core";
import { surveyLocalization } from "survey-core";
import "survey-core/survey.i18n";
import "survey-core/i18n/spanish";
import "survey-core/survey-core.min.css";


Model.platform = "angular";
surveyLocalization.defaultLocale = "es";

@Component({
  selector: 'app-encuesta-modal',
  templateUrl: './encuesta-modal.component.html',
  styleUrl: './encuesta-modal.component.css'
})
export class EncuestaModalComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  surveyModel!: Model;
  @Input() reserva: Reserva | null = null;

  constructor(private prestamoDataService: PrestamoDataService,
      private toastr: ToastrService){

  }

  ngOnChanges() {
    if (this.abierto && this.reserva) {
      this.cargarEncuesta();
    }
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
      this.prestamoDataService.enviarEncuesta(encuesta).subscribe({
        next: () => {
          this.toastr.success("¡Encuesta registrada!");
          this.cerrar.emit();
        },
        error: () => {
          this.toastr.error("Error registrando la encuesta.");
        }
      });

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
}
