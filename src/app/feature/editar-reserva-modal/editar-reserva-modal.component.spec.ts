import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarReservaModalComponent } from './editar-reserva-modal.component';

describe('EditarReservaModalComponent', () => {
  let component: EditarReservaModalComponent;
  let fixture: ComponentFixture<EditarReservaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarReservaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarReservaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
