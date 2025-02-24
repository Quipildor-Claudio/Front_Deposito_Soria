import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosStockComponent } from './articulos-stock.component';

describe('ArticulosStockComponent', () => {
  let component: ArticulosStockComponent;
  let fixture: ComponentFixture<ArticulosStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticulosStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticulosStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
