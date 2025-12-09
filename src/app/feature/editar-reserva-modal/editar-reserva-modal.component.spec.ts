import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { EditarReservaModalComponent } from './editar-reserva-modal.component';
import { ReservaDataService } from '../../shared/services/reserva.data.service';
import { ToastrService } from 'ngx-toastr';
import { Reserva } from '../../shared/models/reserva.model';

describe('EditarReservaModalComponent', () => {
  let component: EditarReservaModalComponent;
  let fixture: ComponentFixture<EditarReservaModalComponent>;
  let reservaDataServiceSpy: jasmine.SpyObj<ReservaDataService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  const mockReserva: Reserva = {
    transaccion: 1,
    estado_actual: 'PENDIENTE',
    fechas: {
      fecha_inicio_transaccion: '2024-01-15T10:00:00Z',
      fecha_fin_transaccion: '2024-01-15T12:00:00Z',
      fecha_creacion: '2024-01-10T09:00:00Z'
    },
    recurso: {
      id_recurso: 101,
      nombre_recurso: 'Sala de reuniones'
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
    const reservaSpy = jasmine.createSpyObj('ReservaDataService', ['updateReserva']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    
    reservaSpy.updateReserva.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [EditarReservaModalComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ReservaDataService, useValue: reservaSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarReservaModalComponent);
    component = fixture.componentInstance;
    reservaDataServiceSpy = TestBed.inject(ReservaDataService) as jasmine.SpyObj<ReservaDataService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    fixture.detectChanges();
    
    expect(component.reservaForm).toBeDefined();
    expect(component.reservaForm.get('estado')?.validator).toBeTruthy();
    expect(component.reservaForm.get('fecha_inicio')?.validator).toBeTruthy();
    expect(component.reservaForm.get('hora_inicio')?.validator).toBeTruthy();
    expect(component.reservaForm.get('hora_fin')?.validator).toBeTruthy();
  });

  it('should populate estadosLista on init', () => {
    fixture.detectChanges();
    
    expect(component.estadosLista).toBeDefined();
    expect(component.estadosLista.length).toBeGreaterThan(0);
    expect(component.estadosLista[0].id).toBeDefined();
    expect(component.estadosLista[0].nombre).toBeDefined();
  });

  it('should populate form when reserva input changes', () => {
    component.reserva = mockReserva;
    
    const changes = {
      reserva: new SimpleChange(null, mockReserva, false)
    };
    
    component.ngOnChanges(changes);
    
    expect(component.reservaForm.get('hora_inicio')?.value).toBe('10:00');
    expect(component.reservaForm.get('hora_fin')?.value).toBe('12:00');
    expect(component.reservaForm.get('fecha_inicio')?.value).toEqual(new Date('2024-01-15T10:00:00Z'));
  });

  it('should not populate form when reserva is null', () => {
    const initialValue = component.reservaForm.get('hora_inicio')?.value;
    
    component.reserva = null;
    const changes = {
      reserva: new SimpleChange(mockReserva, null, false)
    };
    
    component.ngOnChanges(changes);
    
    expect(component.reservaForm.get('hora_inicio')?.value).toBe(initialValue);
  });

  it('should emit cerrar event when close() is called', () => {
    spyOn(component.cerrar, 'emit');
    
    component.close();
    
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should not submit form when form is invalid', () => {
    component.reserva = mockReserva;
    component.reservaForm.patchValue({
      estado: null, // Invalid
      hora_inicio: '',
      hora_fin: '',
      fecha_inicio: ''
    });
    
    component.editar();
    
    expect(reservaDataServiceSpy.updateReserva).not.toHaveBeenCalled();
  });

  it('should not submit form when reserva is null', () => {
    component.reserva = null;
    component.reservaForm.patchValue({
      estado: 1,
      hora_inicio: '10:00',
      hora_fin: '12:00',
      fecha_inicio: new Date()
    });
    
    component.editar();
    
    expect(reservaDataServiceSpy.updateReserva).not.toHaveBeenCalled();
  });

  it('should submit form with correct data when valid', () => {
    component.reserva = mockReserva;
    fixture.detectChanges();
    component.reservaForm.patchValue({
      estado: 2,
      hora_inicio: '14:00',
      hora_fin: '16:00',
      fecha_inicio: new Date(mockReserva.fechas.fecha_inicio_transaccion)
    });
    
    component.editar();
    
    expect(reservaDataServiceSpy.updateReserva).toHaveBeenCalledWith(1, {
      fecha_inicio_transaccion: '2024-01-15T14:00:00',
      fecha_fin_transaccion: '2024-01-15T16:00:00',
      estado_transaccion: 2,
      falla_servicio: null,
      id_usuario: 1,
      id_recurso: 101,
      id_empleado_responsable: 0
    });
  });

  it('should show success message and close modal on successful update', () => {
    spyOn(component, 'close');
    component.reserva = mockReserva;
    fixture.detectChanges();
    component.reservaForm.patchValue({
      estado: 2,
      hora_inicio: '14:00',
      hora_fin: '16:00',
      fecha_inicio: new Date(mockReserva.fechas.fecha_inicio_transaccion)
    });
    
    component.editar();
    
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('¡Reserva actualizada!', 'Éxito');
    expect(component.close).toHaveBeenCalled();
  });

  it('should show error message on failed update', () => {
    reservaDataServiceSpy.updateReserva.and.returnValue(throwError('Update failed'));
    component.reserva = mockReserva;
    fixture.detectChanges();
    component.reservaForm.patchValue({
      estado: 2,
      hora_inicio: '14:00',
      hora_fin: '16:00',
      fecha_inicio: new Date(mockReserva.fechas.fecha_inicio_transaccion)
    });
    
    component.editar();
    
    expect(component.errorMessage).toBe('Error al actualizar la reserva. Inténtalo de nuevo.');
    expect(toastrServiceSpy.error).toHaveBeenCalledWith(
      'Error al actualizar la reserva. Inténtalo de nuevo.',
      'Error',
      { timeOut: 10000 }
    );
  });

  it('should display modal when abierto is true', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const modal = fixture.debugElement.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy();
  });

  it('should hide modal when abierto is false', () => {
    component.abierto = false;
    fixture.detectChanges();
    
    const modal = fixture.debugElement.nativeElement.querySelector('.modal');
    expect(modal).toBeFalsy();
  });

  it('should call close when close button is clicked', () => {
    spyOn(component, 'close');
    component.abierto = true;
    fixture.detectChanges();
    
    const closeButton = fixture.debugElement.nativeElement.querySelector('button');
    closeButton.click();
    
    expect(component.close).toHaveBeenCalled();
  });

  it('should extract hour correctly from ISO date string', () => {
    const isoString = '2024-01-15T14:30:00Z';
    const hour = (component as any).extraerHora(isoString);
    
    expect(hour).toBe('14:30');
  });

  it('should extract date correctly from ISO date string', () => {
    const isoString = '2024-01-15T14:30:00Z';
    const date = (component as any).extraerFecha(isoString);
    
    expect(date).toBe('2024-01-15');
  });

  it('should render form fields correctly', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const formFields = fixture.debugElement.nativeElement.querySelectorAll('mat-form-field');
    expect(formFields.length).toBe(4); // fecha, hora inicio, hora fin, estado
    
    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent.trim()).toBe('Guardar');
  });

  it('should have correct form field labels', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const labels = fixture.debugElement.nativeElement.querySelectorAll('mat-label');
    const labelTexts = Array.from(labels).map((label: any) => label.textContent.trim());
    
    expect(labelTexts).toContain('Fecha de reserva:');
    expect(labelTexts).toContain('Hora de inicio:');
    expect(labelTexts).toContain('Hora de fin:');
    expect(labelTexts).toContain('Estado actual');
  });
});
