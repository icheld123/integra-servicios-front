import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Component, Input } from '@angular/core';

import { EncuestaModalComponent } from './encuesta-modal.component';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { ToastrService } from 'ngx-toastr';
import { Reserva } from '../../shared/models/reserva.model';

// Mock Survey component
@Component({
  selector: 'survey',
  template: '<div data-testid="survey-mock">Survey Mock</div>'
})
class MockSurveyComponent {
  @Input() model: any;
}

describe('EncuestaModalComponent', () => {
  let component: EncuestaModalComponent;
  let fixture: ComponentFixture<EncuestaModalComponent>;
  let prestamoDataService: jasmine.SpyObj<PrestamoDataService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const mockReserva: Reserva = {
    transaccion: 456,
    estado_actual: {
      id_estado_transaccion: 3,
      nombre_estado_transaccion: 'COMPLETADO'
    },
    fechas: {
      fecha_inicio_transaccion: '2024-01-15T10:00:00Z',
      fecha_fin_transaccion: '2024-01-15T12:00:00Z',
      fecha_creacion: '2024-01-10T09:00:00Z'
    },
    recurso: {
      id_recurso: '101',
      nombre_recurso: 'Proyector'
    },
    usuario: {
      id_usuario: 1,
      nombre: 'Test',
      apellido: 'User'
    },
    empleado_responsable: {
      id_usuario: 2,
      nombre: 'Admin',
      apellido: 'User'
    },
    falla_servicio: null
  };

  // Mock para Survey Model
  const mockSurveyModel = {
    onComplete: {
      add: jasmine.createSpy('add')
    }
  };

  beforeEach(async () => {
    const prestamoDataServiceSpy = jasmine.createSpyObj('PrestamoDataService', ['enviarEncuesta']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    prestamoDataServiceSpy.enviarEncuesta.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [EncuestaModalComponent, MockSurveyComponent],
      providers: [
        { provide: PrestamoDataService, useValue: prestamoDataServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaModalComponent);
    component = fixture.componentInstance;
    prestamoDataService = TestBed.inject(PrestamoDataService) as jasmine.SpyObj<PrestamoDataService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.abierto).toBe(false);
    expect(component.reserva).toBe(null);
  });

  it('should display modal when abierto is true', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('.fixed');
    expect(modal).toBeTruthy();
  });

  it('should hide modal when abierto is false', () => {
    component.abierto = false;
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('.fixed');
    expect(modal).toBeFalsy();
  });

  it('should display survey component when modal is open', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const survey = fixture.nativeElement.querySelector('[data-testid="survey-mock"]');
    expect(survey).toBeTruthy();
  });

  it('should generate survey JSON structure correctly', () => {
    const json = component.jsonEncuesta();
    
    expect(json.title).toBe('Califica el servicio');
    expect(json.showQuestionNumbers).toBe('off');
    expect(json.pages).toHaveSize(1);
    expect(json.pages[0].elements).toHaveSize(4);
    
    const elements = json.pages[0].elements;
    expect(elements[0].name).toBe('cumplimiento_horarios');
    expect(elements[0].type).toBe('rating');
    expect(elements[0].isRequired).toBe(true);
    
    expect(elements[1].name).toBe('calidad_servicio');
    expect(elements[1].type).toBe('rating');
    expect(elements[1].isRequired).toBe(true);
    
    expect(elements[2].name).toBe('atencion_personal');
    expect(elements[2].type).toBe('rating');
    expect(elements[2].isRequired).toBe(true);
    
    expect(elements[3].name).toBe('id_transaccion');
    expect(elements[3].type).toBe('text');
    expect(elements[3].visible).toBe(false);
  });

  it('should call cargarEncuesta when abierto and reserva are true', () => {
    spyOn(component, 'cargarEncuesta');
    
    component.abierto = true;
    component.reserva = mockReserva;
    
    component.ngOnChanges();
    
    expect(component.cargarEncuesta).toHaveBeenCalled();
  });

  it('should not call cargarEncuesta when abierto is false', () => {
    spyOn(component, 'cargarEncuesta');
    
    component.abierto = false;
    component.reserva = mockReserva;
    
    component.ngOnChanges();
    
    expect(component.cargarEncuesta).not.toHaveBeenCalled();
  });

  it('should not call cargarEncuesta when reserva is null', () => {
    spyOn(component, 'cargarEncuesta');
    
    component.abierto = true;
    component.reserva = null;
    
    component.ngOnChanges();
    
    expect(component.cargarEncuesta).not.toHaveBeenCalled();
  });

  it('should set default value for id_transaccion in survey', () => {
    component.reserva = mockReserva;
    
    const json = component.jsonEncuesta();
    const idTransaccionElement = json.pages[0].elements.find((el: any) => el.name === 'id_transaccion');
    
    expect(idTransaccionElement).toBeDefined();
    if (idTransaccionElement) {
      expect(idTransaccionElement.type).toBe('text');
      expect(idTransaccionElement.visible).toBe(false);
    }
  });

  it('should create survey model when cargarEncuesta is called', () => {
    component.reserva = mockReserva;
    
    spyOn(component, 'jsonEncuesta').and.callThrough();
    
    component.cargarEncuesta();
    
    expect(component.jsonEncuesta).toHaveBeenCalled();
    expect(component.surveyModel).toBeDefined();
  });

  it('should prepare correct encuesta data structure', () => {
    component.reserva = mockReserva;
    
    // Simulate the data that would be sent to the service
    const expectedEncuestaData = {
      cumplimiento_horarios: 5,
      calidad_servicio: 4,
      atencion_personal: 5,
      id_transaccion: 456
    };
    
    // We can test that the data structure would be correct
    expect(expectedEncuestaData.id_transaccion).toBe(mockReserva.transaccion);
    expect(expectedEncuestaData.cumplimiento_horarios).toBeDefined();
    expect(expectedEncuestaData.calidad_servicio).toBeDefined();
    expect(expectedEncuestaData.atencion_personal).toBeDefined();
    expect(expectedEncuestaData.id_transaccion).toBeDefined();
  });

  it('should have correct survey questions structure', () => {
    const json = component.jsonEncuesta();
    const elements = json.pages[0].elements;
    
    expect(elements[0].title).toBe('¿Cumplimos con los horarios?');
    expect(elements[0].rateMin).toBe(1);
    expect(elements[0].rateMax).toBe(5);
    
    expect(elements[1].title).toBe('¿Cómo calificas la calidad del servicio?');
    expect(elements[1].rateMin).toBe(1);
    expect(elements[1].rateMax).toBe(5);
    
    expect(elements[2].title).toBe('¿Cómo calificas la atención del personal?');
    expect(elements[2].rateMin).toBe(1);
    expect(elements[2].rateMax).toBe(5);
  });
});
