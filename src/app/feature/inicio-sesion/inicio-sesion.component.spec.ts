import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { InicioSesionComponent } from './inicio-sesion.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../shared/models/usuario.model';

describe('InicioSesionComponent', () => {
  let component: InicioSesionComponent;
  let fixture: ComponentFixture<InicioSesionComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [InicioSesionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioSesionComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with login mode', () => {
    expect(component.modoRegistro).toBe(false);
  });

  it('should initialize forms with validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registroForm).toBeDefined();
    
    // Check login form validators
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    
    expect(emailControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    passwordControl?.setValue('ab'); // Less than 3 characters
    expect(passwordControl?.hasError('minlength')).toBe(true);
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

  it('should display login title by default', () => {
    component.abierto = true;
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement?.textContent?.trim()).toBe('Iniciar sesión');
  });

  it('should change to registration mode', () => {
    component.cambiarModo();
    expect(component.modoRegistro).toBe(true);
    expect(component.errorMessage).toBeNull();
    expect(component.successMessage).toBeNull();
  });

  it('should display registration title when in register mode', () => {
    component.abierto = true;
    component.modoRegistro = true;
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement?.textContent?.trim()).toBe('Registrarse');
  });

  it('should toggle between login and register modes', () => {
    expect(component.modoRegistro).toBe(false);
    
    component.cambiarModo();
    expect(component.modoRegistro).toBe(true);
    
    component.cambiarModo();
    expect(component.modoRegistro).toBe(false);
  });

  it('should not submit login if form is invalid', () => {
    component.enviarLogin();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should submit login with valid credentials', () => {
    const mockResponse = {
      access_token: 'mock-token',
      token_type: 'Bearer',
      usuario: {
        sub: 'test-sub',
        nombre: 'Test',
        apellido: 'User',
        id_usuario: 123,
        id_tipo_usuario: 1,
        tipo_usuario: 'Estudiante',
        id_unidad: 1,
        unidad: 'Facultad'
      }
    };
    authService.login.and.returnValue(of(mockResponse));
    spyOn(component.cerrar, 'emit');
    
    // Skip the setTimeout that contains window.location.href
    const originalSetTimeout = window.setTimeout;
    spyOn(window, 'setTimeout' as keyof Window).and.callFake((fn: Function, delay: number) => {
      // For tests, don't actually execute timeouts that might change location
      return 123; // Return a fake timer ID
    });
    
    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    component.enviarLogin();
    
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
    expect(toastrService.success).toHaveBeenCalledWith('¡Inicio de sesión exitoso!', 'Éxito');
  });

  it('should handle login error', () => {
    authService.login.and.returnValue(throwError('Login failed'));
    
    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    component.enviarLogin();
    
    expect(component.loading).toBe(false);
    expect(toastrService.error).toHaveBeenCalledWith('Credenciales inválidas. Intenta nuevamente.', 'Error');
  });

  it('should validate password match in registration form', () => {
    const registroForm = component.registroForm;
    
    registroForm.patchValue({
      password: 'password123',
      confirmarPassword: 'password456'
    });
    
    expect(registroForm.hasError('passwordMismatch')).toBe(true);
    
    registroForm.patchValue({
      password: 'password123',
      confirmarPassword: 'password123'
    });
    
    expect(registroForm.hasError('passwordMismatch')).toBe(false);
  });

  it('should not submit registration if form is invalid', () => {
    component.enviarRegistro();
    expect(toastrService.error).toHaveBeenCalledWith('Por favor, completa todos los campos correctamente', 'Error');
  });

  it('should process valid registration form', () => {
    component.registroForm.patchValue({
      nombre: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      confirmarPassword: 'password123'
    });
    
    component.enviarRegistro();
    
    expect(component.loading).toBe(true);
    expect(component.errorMessage).toBeNull();
    expect(component.successMessage).toBeNull();
  });

  it('should close modal and reset messages', () => {
    spyOn(component.cerrar, 'emit');
    component.errorMessage = 'Some error';
    component.successMessage = 'Some success';
    
    component.close();
    
    expect(component.cerrar.emit).toHaveBeenCalled();
    expect(component.errorMessage).toBeNull();
    expect(component.successMessage).toBeNull();
  });

  it('should display error message when present', () => {
    component.abierto = true;
    component.errorMessage = 'Test error message';
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.bg-red-100');
    expect(errorElement?.textContent?.trim()).toBe('Test error message');
  });

  it('should display success message when present', () => {
    component.abierto = true;
    component.successMessage = 'Test success message';
    fixture.detectChanges();
    
    const successElement = fixture.nativeElement.querySelector('.bg-green-100');
    expect(successElement?.textContent?.trim()).toBe('Test success message');
  });

  it('should call close() when close button is clicked', () => {
    spyOn(component, 'close');
    component.abierto = true;
    fixture.detectChanges();
    
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();
    
    expect(component.close).toHaveBeenCalled();
  });

  it('should show loading state in button text', () => {
    component.abierto = true;
    component.loading = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button?.textContent?.trim()).toBe('...');
  });

  it('should show normal button text when not loading', () => {
    component.abierto = true;
    component.loading = false;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button?.textContent?.trim()).toBe('Ingresar');
  });

  it('should validate registration form fields', () => {
    const registroForm = component.registroForm;
    
    // Test required validators
    expect(registroForm.get('nombre')?.hasError('required')).toBe(true);
    expect(registroForm.get('email')?.hasError('required')).toBe(true);
    expect(registroForm.get('password')?.hasError('required')).toBe(true);
    expect(registroForm.get('confirmarPassword')?.hasError('required')).toBe(true);
    
    // Test email validator
    registroForm.get('email')?.setValue('invalid-email');
    expect(registroForm.get('email')?.hasError('email')).toBe(true);
    
    // Test password minlength
    registroForm.get('password')?.setValue('12345'); // Less than 6 characters
    expect(registroForm.get('password')?.hasError('minlength')).toBe(true);
  });
});
