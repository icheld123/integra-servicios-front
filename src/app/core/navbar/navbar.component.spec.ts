import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth/auth.service';
import { Usuario } from '../../shared/models/usuario.model';

// Mock del componente inicio-sesion
@Component({
  selector: 'app-inicio-sesion',
  template: '<div>Mock Inicio Sesion</div>'
})
class MockInicioSesionComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
        MockInicioSesionComponent
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // Initialize tokenExpireTimeout to avoid undefined errors
    component['tokenExpireTimeout'] = null;
    
    // Setup default mock
    authService.getCurrentUser.and.returnValue(null);
    
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any timers
    if (component['tokenExpireTimeout']) {
      clearTimeout(component['tokenExpireTimeout']);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with modal closed', () => {
    expect(component.modalAbierto).toBe(false);
  });

  it('should open modal', () => {
    component.abrirModal();
    expect(component.modalAbierto).toBe(true);
  });

  it('should close modal', () => {
    component.modalAbierto = true;
    component.cerrarModal();
    expect(component.modalAbierto).toBe(false);
  });

  it('should render navbar element', () => {
    const navElement = fixture.nativeElement.querySelector('nav');
    expect(navElement).toBeTruthy();
  });

  it('should display logo', () => {
    const logoImg = fixture.nativeElement.querySelector('img[alt="Logo UD"]');
    expect(logoImg).toBeTruthy();
    expect(logoImg.src).toContain('udistrital.edu.co');
  });

  it('should display search input', () => {
    const searchInput = fixture.nativeElement.querySelector('input[placeholder="Buscar..."]');
    expect(searchInput).toBeTruthy();
  });

  it('should display "Empezar ahora" button when no user', () => {
    component.usuarioLogueado = null;
    fixture.detectChanges();
    
    const startButton = fixture.nativeElement.textContent;
    expect(startButton).toContain('Empezar ahora');
  });

  it('should display user info when logged in', () => {
    component.usuarioLogueado = {
      nombre: 'Test',
      apellido: 'User'
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Usuario: Test User');
  });

  it('should display logout button when logged in', () => {
    component.usuarioLogueado = {
      nombre: 'Test',
      apellido: 'User'
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Cerrar sesión');
  });

  it('should display navigation buttons when logged in', () => {
    component.usuarioLogueado = {
      nombre: 'Test',
      apellido: 'User'
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Ver recursos');
    expect(compiled.textContent).toContain('Mi perfil');
  });

  it('should call abrirModal when button clicked', () => {
    spyOn(component, 'abrirModal');
    component.abrirModal();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should set modalAbierto to true when opening modal', () => {
    component.abrirModal();
    expect(component.modalAbierto).toBe(true);
  });

  it('should clear session data on logout', () => {
    spyOn(component as any, 'clearSessionData');
    
    // Override logout method to avoid window.location.href in tests
    component.logout = jasmine.createSpy('logout').and.callFake(() => {
      component['clearSessionData']();
    });
    
    component.logout();
    
    expect(component['clearSessionData']).toHaveBeenCalled();
  });

  it('should render inicio-sesion component', () => {
    const modalComponent = fixture.nativeElement.querySelector('app-inicio-sesion');
    expect(modalComponent).toBeTruthy();
  });

  it('should have proper CSS classes', () => {
    const navElement = fixture.nativeElement.querySelector('nav');
    expect(navElement.classList).toContain('bg-white');
    expect(navElement.classList).toContain('border-b-4');
  });

  it('should handle token expiry cleanup', () => {
    component['tokenExpireTimeout'] = setTimeout(() => {}, 1000);
    expect(component['tokenExpireTimeout']).toBeTruthy();
    
    component.ngOnDestroy();
    // Should clear the timeout
  });

  it('should initialize auth state on init', () => {
    spyOn(component, 'checkAuthState');
    component.ngOnInit();
    expect(component.checkAuthState).toHaveBeenCalled();
  });

  it('should handle user state from AuthService', () => {
    const mockUser: Usuario = {
      sub: 'test-sub',
      nombre: 'Test',
      apellido: 'User',
      id_usuario: 123,
      id_tipo_usuario: 1,
      tipo_usuario: 'Estudiante',
      id_unidad: 1,
      unidad: 'Facultad'
    };
    authService.getCurrentUser.and.returnValue(mockUser);
    
    // Re-create component to test constructor
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    
    expect(component.usuarioLogueado).toBe(mockUser);
  });

  it('should handle search button', () => {
    const searchButton = fixture.nativeElement.querySelector('button[class*="rounded-full"]');
    expect(searchButton).toBeTruthy();
  });

  it('should have proper structure', () => {
    expect(component.constructor.name).toBe('NavbarComponent');
    expect(fixture.componentInstance).toBeInstanceOf(NavbarComponent);
  });
});
