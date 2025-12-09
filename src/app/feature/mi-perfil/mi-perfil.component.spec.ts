import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, BehaviorSubject } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MiPerfilComponent } from './mi-perfil.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ReservaDataService } from '../../shared/services/reserva.data.service';
import { Usuario } from '../../shared/models/usuario.model';
import { Reserva } from '../../shared/models/reserva.model';

// Mock component para evitar dependencias complejas
@Component({
  selector: 'app-editar-reserva-modal',
  template: '<div></div>'
})
class MockEditarReservaModalComponent {
  @Input() abierto = false;
  @Input() reserva: Reserva | null = null;
  @Output() cerrar = new EventEmitter<void>();
}

describe('MiPerfilComponent', () => {
  let component: MiPerfilComponent;
  let fixture: ComponentFixture<MiPerfilComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let reservaDataServiceSpy: jasmine.SpyObj<ReservaDataService>;
  let userSubject: BehaviorSubject<Usuario | null>;

  const mockUser: Usuario = {
    id_usuario: 1,
    nombre: 'Test',
    apellido: 'User',
    sub: 'test.user@example.com',
    id_tipo_usuario: 1,
    tipo_usuario: 'Estudiante',
    id_unidad: 1,
    unidad: 'Facultad de Ingeniería'
  };

  const mockReservas: Reserva[] = [
    {
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
    }
  ];

  beforeEach(async () => {
    userSubject = new BehaviorSubject<Usuario | null>(mockUser);
    
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: userSubject.asObservable()
    });

    const reservaSpy = jasmine.createSpyObj('ReservaDataService', ['getReservas', 'updateReserva']);
    reservaSpy.getReservas.and.returnValue(of(mockReservas));
    reservaSpy.updateReserva.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [MiPerfilComponent, MockEditarReservaModalComponent],
      imports: [
        ReactiveFormsModule,
        MatTabsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ReservaDataService, useValue: reservaSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MiPerfilComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    reservaDataServiceSpy = TestBed.inject(ReservaDataService) as jasmine.SpyObj<ReservaDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct display columns', () => {
    expect(component.displayedColumns).toEqual([
      'transaccion',
      'estado',
      'recurso', 
      'inicio',
      'fin',
      'responsable',
      'editar'
    ]);
  });

  it('should initialize form', () => {
    fixture.detectChanges();
    expect(component.usuarioForm).toBeDefined();
    expect(component.usuarioForm.get('nombre')).toBeDefined();
    expect(component.usuarioForm.get('apellido')).toBeDefined();
    expect(component.usuarioForm.get('correo')).toBeDefined();
  });

  it('should load user data on init', () => {
    fixture.detectChanges();
    expect(component.usuarioLogueado).toEqual(mockUser);
  });

  it('should load reservas on init', () => {
    fixture.detectChanges();
    expect(reservaDataServiceSpy.getReservas).toHaveBeenCalled();
    expect(component.reservas).toEqual(mockReservas);
  });

  it('should enable editing mode', () => {
    fixture.detectChanges();
    component.editar();
    expect(component.editando).toBe(true);
  });

  it('should cancel editing', () => {
    fixture.detectChanges();
    component.editar();
    component.cancelar();
    expect(component.editando).toBe(false);
  });

  it('should save changes when form is valid', () => {
    fixture.detectChanges();
    component.editar();
    component.usuarioForm.patchValue({
      nombre: 'New Name',
      apellido: 'New Surname',
      correo: 'new@email.com'
    });

    component.guardar();
    expect(component.editando).toBe(false);
  });

  it('should open modal when editarReserva is called', () => {
    fixture.detectChanges();
    const reserva = mockReservas[0];
    component.editarReserva(reserva);

    expect(component.reservaSeleccionada).toBe(reserva);
    expect(component.modalAbierto).toBe(true);
  });

  it('should close modal', () => {
    component.modalAbierto = true;
    component.cerrarModal();
    expect(component.modalAbierto).toBe(false);
  });
});
