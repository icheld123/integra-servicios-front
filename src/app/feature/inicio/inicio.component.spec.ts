import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

import { InicioComponent } from './inicio.component';
import { INICIO } from './data';

// Mock del componente carrusel
@Component({
  selector: 'app-carrusel-inicio',
  template: '<div>Mock Carrusel</div>'
})
class MockCarruselInicioComponent {}

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InicioComponent,
        MockCarruselInicioComponent
      ],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize botones_inicio with data from INICIO', () => {
    expect(component.botones_inicio).toBeDefined();
    expect(component.botones_inicio.length).toBe(4);
  });

  it('should have correct botones_inicio structure', () => {
    const expectedBotones = Object.values(INICIO.boton);
    expect(component.botones_inicio).toEqual(expectedBotones);
  });

  it('should render carrusel component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const carruselElement = compiled.querySelector('app-carrusel-inicio');
    expect(carruselElement).toBeTruthy();
  });

  it('should display all buttons from data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElements = compiled.querySelectorAll('[ng-reflect-router-link]');
    expect(buttonElements.length).toBe(4);
  });

  it('should display correct button titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkElements = compiled.querySelectorAll('a');
    
    const expectedTitles = ['Laboratorios', 'Conócenos', 'Mejor puntuados', 'Contáctanos'];
    linkElements.forEach((link, index) => {
      if (index < expectedTitles.length) {
        expect(link.textContent?.trim()).toBe(expectedTitles[index]);
      }
    });
  });

  it('should display correct button texts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textElements = compiled.querySelectorAll('p');
    
    const expectedTexts = [
      'Descubre nuestros laboratorios',
      'Conoce la Universidad distrital', 
      'Descubre nuestros laboratorios',
      '¿Tienes algun problema? ¡Contáctanos!'
    ];
    
    textElements.forEach((text, index) => {
      if (index < expectedTexts.length) {
        expect(text.textContent?.trim()).toBe(expectedTexts[index]);
      }
    });
  });

  it('should display images for each button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const imageElements = compiled.querySelectorAll('img');
    
    expect(imageElements.length).toBe(4);
    
    const expectedImages = [
      'assets/lab.png',
      'assets/conocenos.png',
      'assets/mejores.png', 
      'assets/contacto.png'
    ];
    
    imageElements.forEach((img, index) => {
      if (index < expectedImages.length) {
        expect(img.getAttribute('src')).toBe(expectedImages[index]);
      }
    });
  });

  it('should have correct CSS classes for styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check main container
    const mainContainer = compiled.querySelector('.home-page');
    expect(mainContainer).toBeTruthy();
    expect(mainContainer?.classList).toContain('bg-red-500');
    expect(mainContainer?.classList).toContain('min-h-screen');
  });

  it('should have correct button container styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonContainers = compiled.querySelectorAll('div[class*="bg-white"]');
    
    expect(buttonContainers.length).toBe(4);
    buttonContainers.forEach(container => {
      expect(container.classList).toContain('bg-white');
      expect(container.classList).toContain('rounded-lg');
      expect(container.classList).toContain('shadow-md');
    });
  });

  it('should properly iterate over botones_inicio in template', () => {
    // Verify that ngFor is working correctly
    expect(component.botones_inicio.length).toBeGreaterThan(0);
    
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonContainers = compiled.querySelectorAll('div[class*="bg-white"]');
    
    expect(buttonContainers.length).toBe(component.botones_inicio.length);
  });

  it('should have correct interface structure for boton', () => {
    component.botones_inicio.forEach(boton => {
      expect(boton.titulo).toBeDefined();
      expect(boton.ruta).toBeDefined();
      expect(boton.texto).toBeDefined();
      expect(boton.image).toBeDefined();
      
      expect(typeof boton.titulo).toBe('string');
      expect(typeof boton.ruta).toBe('string');
      expect(typeof boton.texto).toBe('string');
      expect(typeof boton.image).toBe('string');
    });
  });

  it('should have RouterLink directives on buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkElements = compiled.querySelectorAll('a[ng-reflect-router-link]');
    
    expect(linkElements.length).toBe(4);
  });

  it('should load data from INICIO constant correctly', () => {
    // Verify that the component is using the correct data source
    const originalData = Object.values(INICIO.boton);
    expect(component.botones_inicio).toEqual(originalData);
  });
});
