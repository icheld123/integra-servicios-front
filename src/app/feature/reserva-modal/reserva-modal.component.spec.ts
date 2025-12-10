import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ReservaModalComponent } from './reserva-modal.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { ToastrService } from 'ngx-toastr';
import { Recurso } from '../../shared/models/recurso.model';
import { Usuario } from '../../shared/models/usuario.model';

describe('ReservaModalComponent', () => {
  let component: ReservaModalComponent;
  let fixture: ComponentFixture<ReservaModalComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let recursoDataService: jasmine.SpyObj<RecursoDataService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const mockRecurso: Recurso = {
    id_recurso: '1',
    nombre_recurso: 'Sala de Reuniones',
    descripcion_recurso: 'Sala principal',
    id_tipo: 1,
    nombre_tipo: 'Sala',
    id_unidad: 1,
    nombre_unidad: 'Edificio A',
    foto_recurso: null
  };

  const mockUser: Usuario = {
    sub: 'test-sub',
    nombre: 'Test',
    apellido: 'User',
    id_usuario: 123,
    id_tipo_usuario: 1,
    tipo_usuario: 'Estudiante',
    id_unidad: 1,
    unidad: 'Facultad de Ingeniería'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const recursoDataServiceSpy = jasmine.createSpyObj('RecursoDataService', ['createReserva']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ReservaModalComponent],
      imports: [
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: RecursoDataService, useValue: recursoDataServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaModalComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    recursoDataService = TestBed.inject(RecursoDataService) as jasmine.SpyObj<RecursoDataService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    // Setup mock returns
    authService.getCurrentUser.and.returnValue(mockUser);
    recursoDataService.createReserva.and.returnValue(of({}));

    // Set required inputs
    component.recurso = mockRecurso;
    component.fecha = '2025-12-08';
    component.horaInicio = '10:00:00';
    component.horaFin = '11:00:00';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.reservaForm).toBeDefined();
    expect(component.reservaForm.get('fecha_inicio')).toBeTruthy();
    expect(component.reservaForm.get('hora_inicio')).toBeTruthy();
    expect(component.reservaForm.get('hora_fin')).toBeTruthy();
  });

  it('should show modal when abierto is true', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const modalElement = fixture.nativeElement.querySelector('.modal');
    expect(modalElement).toBeTruthy();
  });

  it('should hide modal when abierto is false', () => {
    component.abierto = false;
    fixture.detectChanges();
    
    const modalElement = fixture.nativeElement.querySelector('.modal');
    expect(modalElement).toBeNull();
  });

  it('should display resource name in modal title', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement?.textContent).toContain('Sala de Reuniones');
  });

  it('should update form when inputs change', () => {
    const changes = {
      fecha: { currentValue: '2025-12-08', previousValue: undefined, firstChange: true, isFirstChange: () => true },
      horaInicio: { currentValue: '10:00:00', previousValue: undefined, firstChange: true, isFirstChange: () => true },
      horaFin: { currentValue: '11:00:00', previousValue: undefined, firstChange: true, isFirstChange: () => true }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.reservaForm.get('fecha_inicio')?.value).toEqual(new Date('2025-12-08'));
    expect(component.reservaForm.get('hora_inicio')?.value).toBe('10:00');
    expect(component.reservaForm.get('hora_fin')?.value).toBe('11:00');
  });

  it('should disable form fields when hora inputs are provided', () => {
    const changes = {
      horaInicio: { currentValue: '10:00:00', previousValue: undefined, firstChange: true, isFirstChange: () => true },
      horaFin: { currentValue: '11:00:00', previousValue: undefined, firstChange: true, isFirstChange: () => true }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.reservaForm.get('hora_inicio')?.disabled).toBe(true);
    expect(component.reservaForm.get('hora_fin')?.disabled).toBe(true);
  });

  it('should disable fecha field when fecha input is provided', () => {
    const changes = {
      fecha: { currentValue: '2025-12-08', previousValue: undefined, firstChange: true, isFirstChange: () => true }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.reservaForm.get('fecha_inicio')?.disabled).toBe(true);
  });

  it('should emit close event and reset form when close() is called', () => {
    spyOn(component.cerrar, 'emit');
    spyOn(component.reservaForm, 'reset');
    
    component.close();
    
    expect(component.cerrar.emit).toHaveBeenCalled();
    expect(component.reservaForm.reset).toHaveBeenCalled();
  });

  it('should not process reservation if form is invalid', () => {
    component.reservaForm.patchValue({
      fecha_inicio: '',
      hora_inicio: '',
      hora_fin: ''
    });
    
    component.procesarReserva();
    
    expect(recursoDataService.createReserva).not.toHaveBeenCalled();
  });

  it('should process reservation successfully', () => {
    spyOn(component, 'close');
    
    // Set valid form values
    component.reservaForm.patchValue({
      fecha_inicio: new Date('2025-12-08'),
      hora_inicio: '10:00',
      hora_fin: '11:00'
    });
    
    component.procesarReserva();
    
    expect(recursoDataService.createReserva).toHaveBeenCalledWith({
      fecha_inicio_transaccion: '2025-12-08 10:00:00',
      fecha_fin_transaccion: '2025-12-08 11:00:00',
      estado_transaccion: 'PENDIENTE',
      falla_servicio: '1',
      id_tipo_transaccion: 1,
      id_usuario: 123,
      id_recurso: '1'
    });
    
    expect(toastrService.success).toHaveBeenCalledWith('¡Reserva generada!', 'Éxito');
    expect(component.close).toHaveBeenCalled();
  });

  it('should handle reservation error', () => {
    const errorResponse = { error: { detail: 'Error en el servidor' } };
    recursoDataService.createReserva.and.returnValue(throwError(errorResponse));
    
    component.reservaForm.patchValue({
      fecha_inicio: new Date('2025-12-08'),
      hora_inicio: '10:00',
      hora_fin: '11:00'
    });
    
    component.procesarReserva();
    
    expect(toastrService.error).toHaveBeenCalledWith(
      'Error en el servidor',
      'Error'
    );
  });

  it('should display error message when present', () => {
    component.abierto = true;
    component.errorMessage = 'Test error message';
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.bg-red-100');
    expect(errorElement?.textContent.trim()).toBe('Test error message');
  });

  it('should display success message when present', () => {
    component.abierto = true;
    component.successMessage = 'Test success message';
    fixture.detectChanges();
    
    const successElement = fixture.nativeElement.querySelector('.bg-green-100');
    expect(successElement?.textContent.trim()).toBe('Test success message');
  });

  it('should call close() when close button is clicked', () => {
    spyOn(component, 'close');
    component.abierto = true;
    fixture.detectChanges();
    
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();
    
    expect(component.close).toHaveBeenCalled();
  });

  it('should format date and time correctly', () => {
    const fecha = new Date(2025, 11, 5); // Year, Month (0-indexed), Day
    const hora = '10:30:00';
    
    const resultado = component.formato(fecha, hora);
    
    expect(resultado).toBe('2025-12-05 10:30:00');
  });
});
