import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionModalComponent } from './devolucion-modal.component';

describe('DevolucionModalComponent', () => {
  let component: DevolucionModalComponent;
  let fixture: ComponentFixture<DevolucionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevolucionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
