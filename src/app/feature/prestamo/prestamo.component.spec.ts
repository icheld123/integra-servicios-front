import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoComponent } from './prestamo.component';

describe('PrestamoComponent', () => {
  let component: PrestamoComponent;
  let fixture: ComponentFixture<PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent?.trim()).toBe('registro works!');
  });

  it('should have correct selector', () => {
    expect(component.constructor.name).toBe('RegistroComponent');
  });

  it('should display in DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph?.textContent?.trim()).toBe('registro works!');
  });

  it('should be properly initialized', () => {
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(RegistroComponent);
  });
});
