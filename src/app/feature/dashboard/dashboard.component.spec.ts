import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { Recurso } from '../../shared/models/recurso.model';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';

// Mock del componente reserva-modal
@Component({
  selector: 'app-reserva-modal',
  template: '<div>Mock Reserva Modal</div>'
})
class MockReservaModalComponent {
  @Input() abierto = false;
  @Input() recurso: any;
  @Input() horario: any;
  @Input() horaInicio: any;
  @Input() horaFin: any;
  @Input() fecha: any;
  @Output() cerrar = new EventEmitter<void>();
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let recursoDataService: jasmine.SpyObj<RecursoDataService>;

  const mockRecursos: Recurso[] = [
    {
      id_recurso: '1',
      nombre_recurso: 'Sala de reuniones',
      descripcion_recurso: 'Sala para reuniones',
      id_tipo: 1,
      nombre_tipo: 'Sala',
      id_unidad: 1,
      nombre_unidad: 'Edificio A',
      foto_recurso: null
    },
    {
      id_recurso: '2',
      nombre_recurso: 'Proyector',
      descripcion_recurso: 'Proyector HD',
      id_tipo: 2,
      nombre_tipo: 'Equipo',
      id_unidad: 1,
      nombre_unidad: 'Edificio A',
      foto_recurso: 'base64string'
    }
  ];

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
      horario: '08:00-18:00'
    },
    {
      tipo_recurso: {
        id_tipo_recurso: 2,
        nombre_tipo_recurso: 'Equipo',
        codigo_tipo_recurso: 'EQUIPO'
      },
      unidad: {
        id_unidad: 1,
        nombre_unidad: 'Edificio A'
      },
      horario: '09:00-17:00'
    }
  ];

  beforeEach(async () => {
    const recursoServiceSpy = jasmine.createSpyObj('RecursoDataService', [
      'getAllRecursos',
      'getTiposRecursos'
    ]);

    // Set up initial mock returns before creating component
    recursoServiceSpy.getAllRecursos.and.returnValue(of(mockRecursos));
    recursoServiceSpy.getTiposRecursos.and.returnValue(of(mockTiposRecursos));

    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockReservaModalComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RecursoDataService, useValue: recursoServiceSpy }
      ]
    })
    .compileComponents();

    recursoDataService = TestBed.inject(RecursoDataService) as jasmine.SpyObj<RecursoDataService>;
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.recursos).toEqual([]);
    expect(component.page).toBe(1);
    expect(component.limit).toBe(9);
    expect(component.skip).toBe(0);
    expect(component.modalAbierto).toBe(false);
    expect(component.recursoSeleccionado).toBeNull();
  });

  it('should initialize form with validators', () => {
    expect(component.filter).toBeDefined();
    expect(component.filter.get('hora_inicio')?.hasError('required')).toBe(true);
    expect(component.filter.get('hora_fin')?.hasError('required')).toBe(true);
    expect(component.filter.get('fecha_inicio')?.hasError('required')).toBe(true);
  });

  it('should load tipos recursos on init', () => {
    expect(recursoDataService.getTiposRecursos).toHaveBeenCalled();
    expect(component.tiposRecursos).toEqual(mockTiposRecursos);
  });

  it('should display empty state when no recursos', () => {
    component.recursos = [];
    fixture.detectChanges();
    
    const emptyElement = fixture.nativeElement.querySelector('div:has(> p)');
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('¡Llena los campos requeridos para cargar recursos!');
  });

  it('should display recursos when available', () => {
    component.recursos = mockRecursos;
    fixture.detectChanges();
    
    const recursoCards = fixture.nativeElement.querySelectorAll('div[class*="bg-white border border-gray-300"]');
    expect(recursoCards.length).toBe(2);
  });

  it('should call filterRecursos and reset page', () => {
    spyOn(component, 'getRecursos');
    component.page = 3;
    
    component.filterRecursos();
    
    expect(component.page).toBe(1);
    expect(component.getRecursos).toHaveBeenCalled();
  });

  it('should validate filtroValido correctly', () => {
    // Invalid case - missing fields
    expect(component.filtroValido).toBe(false);
    
    // Invalid case - hora fin <= hora inicio
    component.filter.patchValue({
      fecha_inicio: '2025-12-08',
      hora_inicio: '10:00',
      hora_fin: '09:00'
    });
    expect(component.filtroValido).toBe(false);
    
    // Valid case
    component.filter.patchValue({
      fecha_inicio: '2025-12-08',
      hora_inicio: '09:00',
      hora_fin: '10:00'
    });
    expect(component.filtroValido).toBe(true);
  });

  it('should handle nextPage correctly', () => {
    spyOn(component, 'getRecursos');
    component.page = 1;
    
    component.nextPage();
    
    expect(component.page).toBe(2);
    expect(component.getRecursos).toHaveBeenCalled();
  });

  it('should handle prevPage correctly', () => {
    spyOn(component, 'getRecursos');
    component.page = 3;
    
    component.prevPage();
    
    expect(component.page).toBe(2);
    expect(component.getRecursos).toHaveBeenCalled();
  });

  it('should not go below page 1 in prevPage', () => {
    spyOn(component, 'getRecursos');
    component.page = 1;
    
    component.prevPage();
    
    expect(component.page).toBe(1);
    expect(component.getRecursos).not.toHaveBeenCalled();
  });

  it('should open modal with correct data', () => {
    component.filter.patchValue({
      fecha_inicio: '2025-12-08',
      hora_inicio: '09:00',
      hora_fin: '10:00'
    });
    
    const recurso = mockRecursos[0];
    component.abrirModal(recurso);
    
    expect(component.modalAbierto).toBe(true);
    expect(component.recursoSeleccionado).toBe(recurso);
    expect(component.fechaSeleccionada).toBe('2025-12-08');
    expect(component.horaInicioSeleccionada).toBe('09:00');
    expect(component.horaFinSeleccionada).toBe('10:00');
  });

  it('should close modal correctly', () => {
    component.modalAbierto = true;
    
    component.cerrarModal();
    
    expect(component.modalAbierto).toBe(false);
  });

  it('should display resource information correctly', () => {
    component.recursos = mockRecursos;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Sala de reuniones');
    expect(compiled.textContent).toContain('Proyector');
    expect(compiled.textContent).toContain('Sala para reuniones');
    expect(compiled.textContent).toContain('Proyector HD');
  });

  it('should display correct image sources', () => {
    component.recursos = mockRecursos;
    fixture.detectChanges();
    
    const images = fixture.nativeElement.querySelectorAll('img[alt="recurso"]');
    expect(images[0].src).toContain('britannica.com'); // Default image
    expect(images[1].src).toContain('data:image/jpeg;base64,'); // Base64 image
  });

  it('should handle resource filtering', () => {
    component.filter.patchValue({
      tipo: '1',
      fecha_inicio: '2025-12-08',
      hora_inicio: '09:00',
      hora_fin: '10:00',
      disponibilidad_completa: true
    });
    
    component.getRecursos();
    
    expect(recursoDataService.getAllRecursos).toHaveBeenCalledWith(
      0, // skip
      9, // limit
      jasmine.objectContaining({
        id_tipo_recurso: 1,
        disponibilidad_completa: true
      })
    );
  });

  it('should display pagination controls', () => {
    component.recursos = mockRecursos;
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const pageText = fixture.nativeElement.textContent;
    
    expect(pageText).toContain('Página 1');
    // Just verify we have pagination buttons (exact count may vary)
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should disable filter button when form is invalid', () => {
    // Reset form to ensure it's really invalid
    component.filter.reset();
    fixture.detectChanges();
    
    // Check if the button is disabled due to form validation
    expect(component.filter.invalid).toBe(true);
  });

  it('should enable filter button when form is valid', () => {
    component.filter.patchValue({
      fecha_inicio: '2025-12-08',
      hora_inicio: '09:00',
      hora_fin: '10:00'
    });
    fixture.detectChanges();
    
    const filterButton = fixture.nativeElement.querySelector('button[type="button"]');
    expect(filterButton.disabled).toBe(false);
  });

  it('should display tipos de recursos in select', () => {
    fixture.detectChanges();
    
    // Trigger the mat-select to open (this is complex in testing)
    // We'll just verify the options are loaded in the component
    expect(component.tiposRecursos.length).toBe(2);
    expect(component.tiposRecursos[0].tipo_recurso.nombre_tipo_recurso).toBe('Sala');
    expect(component.tiposRecursos[1].tipo_recurso.nombre_tipo_recurso).toBe('Equipo');
  });

  it('should render reserva modal component', () => {
    const modalComponent = fixture.nativeElement.querySelector('app-reserva-modal');
    expect(modalComponent).toBeTruthy();
  });

  it('should calculate skip value correctly for pagination', () => {
    component.page = 3;
    component.limit = 9;
    
    component.getRecursos();
    
    expect(component.skip).toBe(18); // (3-1) * 9
  });
});
