import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnidadMedidaComponent } from './add-unidad-medida.component';

describe('AddUnidadMedidaComponent', () => {
  let component: AddUnidadMedidaComponent;
  let fixture: ComponentFixture<AddUnidadMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnidadMedidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
