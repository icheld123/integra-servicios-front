import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { PanelAdminComponent } from './panel-admin.component';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { UnidadDataService } from '../../shared/services/unidad.data.service';
import { UsuarioDataService } from '../../shared/services/usuario.data.service';
import { ToastrService } from 'ngx-toastr';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';
import { Unidad } from '../../shared/models/unidad.model';

describe('PanelAdminComponent', () => {
  let component: PanelAdminComponent;
  let fixture: ComponentFixture<PanelAdminComponent>;
  let recursoDataService: jasmine.SpyObj<RecursoDataService>;
  let unidadDataService: jasmine.SpyObj<UnidadDataService>;
  let usuarioDataService: jasmine.SpyObj<UsuarioDataService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const mockTiposRecursos: TipoRecurso[] = [
    {
      tipo_recurso: {
        id_tipo_recurso: 1,
        nombre_tipo_recurso: 'Sala',
        codigo_tipo_recurso: 'SALA'
      },
      unidad: {
        id_unidad: 1,
        nombre_unidad: 'Edificio A'
      },
      horario: 'LABORAL'
    }
  ];

  const mockUnidades: Unidad[] = [
    {
      id_unidad: 1,
      nombre_unidad: "string" as "string",
      horario_unidad: "string" as "string"
    },
    {
      id_unidad: 2,
      nombre_unidad: "string" as "string", 
      horario_unidad: "string" as "string"
    }
  ];

  beforeEach(async () => {
    const recursoDataServiceSpy = jasmine.createSpyObj('RecursoDataService', [
      'createRecurso', 'createTipoRecurso', 'getTiposRecursos'
    ]);
    const unidadDataServiceSpy = jasmine.createSpyObj('UnidadDataService', [
      'getUnidades', 'createUnidad'
    ]);
    const usuarioDataServiceSpy = jasmine.createSpyObj('UsuarioDataService', [
      'createUsuario'
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success', 'error'
    ]);

    // Setup default return values
    recursoDataServiceSpy.getTiposRecursos.and.returnValue(of(mockTiposRecursos));
    recursoDataServiceSpy.createRecurso.and.returnValue(of({}));
    recursoDataServiceSpy.createTipoRecurso.and.returnValue(of({}));
    unidadDataServiceSpy.getUnidades.and.returnValue(of(mockUnidades));
    unidadDataServiceSpy.createUnidad.and.returnValue(of({}));
    usuarioDataServiceSpy.createUsuario.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [PanelAdminComponent],
      imports: [
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RecursoDataService, useValue: recursoDataServiceSpy },
        { provide: UnidadDataService, useValue: unidadDataServiceSpy },
        { provide: UsuarioDataService, useValue: usuarioDataServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAdminComponent);
    component = fixture.componentInstance;
    recursoDataService = TestBed.inject(RecursoDataService) as jasmine.SpyObj<RecursoDataService>;
    unidadDataService = TestBed.inject(UnidadDataService) as jasmine.SpyObj<UnidadDataService>;
    usuarioDataService = TestBed.inject(UsuarioDataService) as jasmine.SpyObj<UsuarioDataService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all forms with validators', () => {
    expect(component.nuevoRecursoForm).toBeDefined();
    expect(component.nuevoTipoRecursoForm).toBeDefined();
    expect(component.nuevaUnidadForm).toBeDefined();
    expect(component.nuevoUsuarioForm).toBeDefined();

    // Check required validators
    expect(component.nuevoRecursoForm.get('nombre_recurso')?.hasError('required')).toBe(true);
    expect(component.nuevoTipoRecursoForm.get('nombre_tipo_recurso')?.hasError('required')).toBe(true);
    expect(component.nuevaUnidadForm.get('nombre_unidad')?.hasError('required')).toBe(true);
    expect(component.nuevoUsuarioForm.get('nombre')?.hasError('required')).toBe(true);
  });

  it('should load tipos recursos and unidades on init', () => {
    expect(recursoDataService.getTiposRecursos).toHaveBeenCalledWith({});
    expect(unidadDataService.getUnidades).toHaveBeenCalled();
    expect(component.tiposRecursos).toEqual(mockTiposRecursos);
    expect(component.unidades).toEqual(mockUnidades);
  });

  it('should initialize categorias horarios', () => {
    expect(component.categoriasHorarios).toBeDefined();
    expect(component.categoriasHorarios.length).toBeGreaterThan(0);
  });

  it('should handle file selection', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    component.onFileSelect(mockEvent);
    expect(component.selectedFile).toBe(mockFile);
  });

  it('should handle file selection with no file', () => {
    const mockEvent = {
      target: {
        files: []
      }
    };

    component.onFileSelect(mockEvent);
    expect(component.selectedFile).toBe(null);
  });

  describe('Usuario Creation', () => {
    it('should create usuario successfully', () => {
      spyOn(component.nuevoUsuarioForm, 'reset');
      
      component.nuevoUsuarioForm.patchValue({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@test.com',
        contrasena: 'password123',
        id_tipo_usuario: 1,
        id_unidad: 1
      });

      component.crearUsuario();

      expect(usuarioDataService.createUsuario).toHaveBeenCalledWith({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@test.com',
        contrasena: 'password123',
        id_tipo_usuario: 1,
        id_unidad: 1
      });
      expect(toastrService.success).toHaveBeenCalledWith('¡Usuario creado exitosamente!');
      expect(component.nuevoUsuarioForm.reset).toHaveBeenCalled();
    });

    it('should handle usuario creation error', () => {
      const errorResponse = { error: { detail: 'Error creating user' } };
      usuarioDataService.createUsuario.and.returnValue(throwError(errorResponse));

      component.nuevoUsuarioForm.patchValue({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@test.com',
        contrasena: 'password123',
        id_tipo_usuario: 1,
        id_unidad: 1
      });

      component.crearUsuario();

      expect(toastrService.error).toHaveBeenCalledWith('Error creating user', 'Error.');
    });
  });

  describe('Tipo Recurso Creation', () => {
    it('should create tipo recurso successfully', () => {
      spyOn(component.nuevoTipoRecursoForm, 'reset');
      
      component.nuevoTipoRecursoForm.patchValue({
        nombre_tipo_recurso: 'Laboratorio',
        codigo_tipo_recurso: 'LAB',
        descripcion_tipo_recurso: 'Laboratorio de computación',
        horario_disponibilidad: 'LABORAL',
        id_unidad: 1
      });

      component.crearTipoRecurso();

      expect(recursoDataService.createTipoRecurso).toHaveBeenCalledWith({
        nombre_tipo_recurso: 'Laboratorio',
        codigo_tipo_recurso: 'LAB',
        descripcion_tipo_recurso: 'Laboratorio de computación',
        horario_disponibilidad: 'LABORAL',
        id_unidad: 1
      });
      expect(toastrService.success).toHaveBeenCalledWith('¡Tipo de recurso creado exitosamente!');
      expect(component.nuevoTipoRecursoForm.reset).toHaveBeenCalled();
    });

    it('should handle tipo recurso creation error', () => {
      const errorResponse = { error: { detail: 'Error creating tipo recurso' } };
      recursoDataService.createTipoRecurso.and.returnValue(throwError(errorResponse));

      component.nuevoTipoRecursoForm.patchValue({
        nombre_tipo_recurso: 'Laboratorio',
        codigo_tipo_recurso: 'LAB',
        descripcion_tipo_recurso: 'Laboratorio de computación',
        horario_disponibilidad: 'LABORAL',
        id_unidad: 1
      });

      component.crearTipoRecurso();

      expect(toastrService.error).toHaveBeenCalledWith('Error creating tipo recurso', 'Error.');
    });
  });

  describe('Unidad Creation', () => {
    it('should create unidad successfully', () => {
      spyOn(component.nuevaUnidadForm, 'reset');
      
      component.nuevaUnidadForm.patchValue({
        nombre_unidad: 'Edificio C',
        horario_unidad: 'COMPLETO'
      });

      component.crearUnidad();

      expect(unidadDataService.createUnidad).toHaveBeenCalledWith({
        nombre_unidad: 'Edificio C',
        horario_unidad: 'COMPLETO'
      });
      expect(toastrService.success).toHaveBeenCalledWith('¡Nueva unidad creada exitosamente!');
      expect(component.nuevaUnidadForm.reset).toHaveBeenCalled();
    });

    it('should handle unidad creation error', () => {
      const errorResponse = { error: { detail: 'Error creating unidad' } };
      unidadDataService.createUnidad.and.returnValue(throwError(errorResponse));

      component.nuevaUnidadForm.patchValue({
        nombre_unidad: 'Edificio C',
        horario_unidad: 'COMPLETO'
      });

      component.crearUnidad();

      expect(toastrService.error).toHaveBeenCalledWith('Error creating unidad', 'Error.');
    });
  });

  describe('Recurso Creation', () => {
    it('should create FormData correctly', () => {
      component.nuevoRecursoForm.patchValue({
        nombre_recurso: 'Test Recurso',
        descripcion_recurso: 'Test Description',
        id_tipo_recurso: '1',
        foto_recurso: null
      });

      const formData = component.nuevoRecursoData();
      expect(formData).toBeInstanceOf(FormData);
    });

    it('should create recurso successfully', () => {
      spyOn(component.nuevoRecursoForm, 'reset');
      spyOn(component, 'nuevoRecursoData').and.returnValue(new FormData());
      
      component.crearRecursoNuevo();

      expect(recursoDataService.createRecurso).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith('¡Recurso creado exitosamente!');
      expect(component.nuevoRecursoForm.reset).toHaveBeenCalled();
    });

    it('should handle recurso creation error', () => {
      const errorResponse = { error: { detail: 'Error creating recurso' } };
      recursoDataService.createRecurso.and.returnValue(throwError(errorResponse));
      spyOn(component, 'nuevoRecursoData').and.returnValue(new FormData());

      component.crearRecursoNuevo();

      expect(toastrService.error).toHaveBeenCalledWith('Error creating recurso', 'Error.');
    });
  });

  it('should have tipos usuario defined', () => {
    expect(component.tiposUsuario).toBeDefined();
  });
});
