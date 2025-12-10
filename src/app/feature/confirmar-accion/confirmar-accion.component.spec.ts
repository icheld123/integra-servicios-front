import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ConfirmarAccionComponent } from './confirmar-accion.component';
import { PrestamoDataService } from '../../shared/services/prestamo.data.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth/auth.service';
import { Reserva } from '../../shared/models/reserva.model';

describe('ConfirmarAccionComponent', () => {
  let component: ConfirmarAccionComponent;
  let fixture: ComponentFixture<ConfirmarAccionComponent>;
  let mockPrestamoService: jasmine.SpyObj<PrestamoDataService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockReserva: Reserva = {
    transaccion: 123,
    estado_actual: {
      id_estado_transaccion: 1,
      nombre_estado_transaccion: 'Pendiente'
    }
  } as Reserva;

  beforeEach(async () => {
    mockPrestamoService = jasmine.createSpyObj('PrestamoDataService', ['setPrestamo']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmarAccionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PrestamoDataService, useValue: mockPrestamoService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with abierto false', () => {
    expect(component.abierto).toBeFalse();
  });

  it('should have an empty reserva initially', () => {
    expect(component.reserva).toBeNull();
  });

  it('should initialize prestamoForm with password_user control', () => {
    expect(component.prestamoForm.get('password_user')).toBeTruthy();
  });

  it('should make password_user control required', () => {
    const passwordControl = component.prestamoForm.get('password_user');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should validate form as valid when password_user is filled', () => {
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');
    expect(component.prestamoForm.valid).toBeTrue();
  });

  it('should display modal when abierto is true', () => {
    component.abierto = true;
    component.reserva = mockReserva;
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

  it('should display reservation transaction number', () => {
    component.abierto = true;
    component.reserva = mockReserva;
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading.textContent).toContain('123');
  });

  it('should call close when close button is clicked', () => {
    spyOn(component, 'close');
    component.abierto = true;
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(component.close).toHaveBeenCalled();
  });

  it('should emit cerrar event when close is called', (done: DoneFn) => {
    component.cerrar.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    component.close();
  });

  it('should reset form when close is called', () => {
    component.prestamoForm.get('password_user')?.setValue('test123');
    component.close();
    expect(component.prestamoForm.get('password_user')?.value).toBeNull();
  });

  it('should call setPrestamo service when procesarPrestamo is submitted successfully', () => {
    mockPrestamoService.setPrestamo.and.returnValue(of({}));
    component.reserva = mockReserva;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');

    component.procesarPrestamo();

    expect(mockPrestamoService.setPrestamo).toHaveBeenCalledWith({
      id_transaccion: 123,
      password_user: 'micontraseña123'
    });
  });

  it('should show success message when prestamo is processed successfully', () => {
    mockPrestamoService.setPrestamo.and.returnValue(of({}));
    component.reserva = mockReserva;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');

    component.procesarPrestamo();

    expect(mockToastrService.success).toHaveBeenCalledWith('¡Prestamo generado!', 'Éxito');
  });

  it('should close modal after successful prestamo', () => {
    mockPrestamoService.setPrestamo.and.returnValue(of({}));
    spyOn(component, 'close');
    component.reserva = mockReserva;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');

    component.procesarPrestamo();

    expect(component.close).toHaveBeenCalled();
  });

  it('should show error message when prestamo service fails', () => {
    const errorResponse = { error: { detail: 'Contraseña incorrecta' } };
    mockPrestamoService.setPrestamo.and.returnValue(throwError(() => errorResponse));
    component.reserva = mockReserva;
    component.prestamoForm.get('password_user')?.setValue('contraseñaincorrecta');

    component.procesarPrestamo();

    expect(mockToastrService.error).toHaveBeenCalledWith('Contraseña incorrecta', 'Error.');
  });

  it('should disable submit button when form is invalid', () => {
    component.abierto = true;
    component.prestamoForm.get('password_user')?.setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.abierto = true;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalse();
  });

  it('should call procesarPrestamo when form is submitted', () => {
    spyOn(component, 'procesarPrestamo');
    mockPrestamoService.setPrestamo.and.returnValue(of({}));
    
    component.abierto = true;
    component.reserva = mockReserva;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.procesarPrestamo).toHaveBeenCalled();
  });

  it('should not call setPrestamo if reserva is null', () => {
    component.reserva = null;
    component.prestamoForm.get('password_user')?.setValue('micontraseña123');

    expect(() => component.procesarPrestamo()).toThrow();
  });

  it('should set correct form control validity', () => {
    const passwordControl = component.prestamoForm.get('password_user');
    
    // Test empty value
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(passwordControl?.invalid).toBeTrue();
    expect(passwordControl?.hasError('required')).toBeTrue();
    
    // Test valid value
    passwordControl?.setValue('validpassword');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should display password input field', () => {
    component.abierto = true;
    fixture.detectChanges();

    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.getAttribute('placeholder')).toBe('Digite su contraseña');
  });

  it('should update form control value when typing in password input', () => {
    component.abierto = true;
    fixture.detectChanges();

    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
    passwordInput.value = 'testpassword123';
    passwordInput.dispatchEvent(new Event('input'));
    
    expect(component.prestamoForm.get('password_user')?.value).toBe('testpassword123');
  });
});
