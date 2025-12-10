import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { DevolucionModalComponent } from './devolucion-modal.component';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { ToastrService } from 'ngx-toastr';
import { Reserva } from '../../shared/models/reserva.model';

describe('DevolucionModalComponent', () => {
  let component: DevolucionModalComponent;
  let fixture: ComponentFixture<DevolucionModalComponent>;
  let prestamoDataService: jasmine.SpyObj<PrestamoDataService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const mockReserva: Reserva = {
    transaccion: 123,
    estado_actual: {
      id_estado_transaccion: 1,
      nombre_estado_transaccion: 'PRESTADO'
    },
    fechas: {
      fecha_inicio_transaccion: '2024-01-15T10:00:00Z',
      fecha_fin_transaccion: '2024-01-15T12:00:00Z',
      fecha_creacion: '2024-01-10T09:00:00Z'
    },
    recurso: {
      id_recurso: '101',
      nombre_recurso: 'Laptop'
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

  beforeEach(async () => {
    const prestamoDataServiceSpy = jasmine.createSpyObj('PrestamoDataService', ['setDevolucion']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    prestamoDataServiceSpy.setDevolucion.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [DevolucionModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PrestamoDataService, useValue: prestamoDataServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionModalComponent);
    component = fixture.componentInstance;
    prestamoDataService = TestBed.inject(PrestamoDataService) as jasmine.SpyObj<PrestamoDataService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.abierto).toBe(false);
    expect(component.reserva).toBe(null);
    expect(component.devolucionCompletada).toBe(false);
    expect(component.devolucionForm).toBeDefined();
  });

  it('should initialize form with required validator', () => {
    const idTransaccionControl = component.devolucionForm.get('id_transaccion');
    expect(idTransaccionControl?.hasError('required')).toBe(true);
  });

  it('should display modal when abierto is true', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy();
  });

  it('should hide modal when abierto is false', () => {
    component.abierto = false;
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeFalsy();
  });

  it('should display reservation transaction number in title', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    fixture.detectChanges();
    
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toContain('Prestamo de recurso con reserva 123');
  });

  it('should display resource name in confirmation text', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = false;
    fixture.detectChanges();
    
    const confirmationText = fixture.nativeElement.querySelector('p');
    expect(confirmationText.textContent).toContain('Se realizará la devolución del recurso Laptop');
  });

  it('should show confirmation buttons when devolution not completed', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = false;
    fixture.detectChanges();
    
    const yesButton = fixture.nativeElement.querySelector('button.bg-green-400');
    const noButton = fixture.nativeElement.querySelector('button.bg-gray-400');
    
    expect(yesButton).toBeTruthy();
    expect(noButton).toBeTruthy();
    expect(yesButton.textContent.trim()).toBe('Si');
    expect(noButton.textContent.trim()).toBe('No');
  });

  it('should show completion message when devolution completed', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = true;
    fixture.detectChanges();
    
    const completionMessage = fixture.nativeElement.querySelector('div:last-child p');
    expect(completionMessage.textContent).toContain('Se ha devuelto el recurso Laptop correctamente');
  });

  it('should hide confirmation buttons when devolution completed', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = true;
    fixture.detectChanges();
    
    const yesButton = fixture.nativeElement.querySelector('button.bg-green-400');
    const noButton = fixture.nativeElement.querySelector('button.bg-gray-400');
    expect(yesButton).toBeFalsy();
    expect(noButton).toBeFalsy();
  });

  it('should emit cerrar event when close() is called', () => {
    spyOn(component.cerrar, 'emit');
    
    component.close();
    
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should call close() when "No" button is clicked', () => {
    spyOn(component, 'close');
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = false;
    fixture.detectChanges();
    
    const noButton = fixture.nativeElement.querySelector('button.bg-gray-400');
    noButton.click();
    
    expect(component.close).toHaveBeenCalled();
  });

  it('should process devolution successfully', () => {
    spyOn(component.cerrar, 'emit');
    component.reserva = mockReserva;
    
    component.procesarDevolucion();
    
    expect(prestamoDataService.setDevolucion).toHaveBeenCalledWith({
      id_transaccion: 123
    });
    expect(toastrService.success).toHaveBeenCalledWith('¡Devolución y encuesta registrada!');
    expect(component.devolucionCompletada).toBe(true);
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should handle devolution error', () => {
    const errorResponse = { error: { detail: 'Error en la devolución' } };
    prestamoDataService.setDevolucion.and.returnValue(throwError(errorResponse));
    component.reserva = mockReserva;
    
    component.procesarDevolucion();
    
    expect(prestamoDataService.setDevolucion).toHaveBeenCalledWith({
      id_transaccion: 123
    });
    expect(toastrService.error).toHaveBeenCalledWith('Error en la devolución', 'Error.');
    expect(component.devolucionCompletada).toBe(false);
  });

  it('should call procesarDevolucion when "Si" button is clicked', () => {
    spyOn(component, 'procesarDevolucion');
    component.abierto = true;
    component.reserva = mockReserva;
    component.devolucionCompletada = false;
    fixture.detectChanges();
    
    const yesButton = fixture.nativeElement.querySelector('button.bg-green-400');
    yesButton.click();
    
    expect(component.procesarDevolucion).toHaveBeenCalled();
  });

  it('should handle case when reserva is null', () => {
    component.reserva = null;
    
    component.procesarDevolucion();
    
    expect(prestamoDataService.setDevolucion).toHaveBeenCalledWith({
      id_transaccion: undefined
    });
  });

  it('should display placeholders when reserva is null', () => {
    component.abierto = true;
    component.reserva = null;
    fixture.detectChanges();
    
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toContain('Prestamo de recurso con reserva');
  });
});
