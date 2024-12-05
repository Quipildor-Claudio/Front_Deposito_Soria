import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {
  title: string = "Gestion de Reportes"
  searchForm: FormGroup;
  movements: Movimiento[] = [];
  movService = inject(MovimentService);
  productsWithType: any[] = [];
  sortedProducts: any[] = [];
  currentSortKey: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      alert('Por favor complete ambos campos.');
      return;
    }

    const { startDate, endDate } = this.searchForm.value;
    this.movService.buscarPorRangoDeFecha(startDate, endDate).subscribe((res) => {
      this.movements = res as Movimiento[];
      this.extractProductsWithType();
      console.log(this.productsWithType);
    });

  }

  extractProductsWithType(): void {
    this.productsWithType = [];

    this.movements.forEach((movement) => {
      movement.comprobantes.forEach((comprobante: any) => {
        this.productsWithType.push({
          product: comprobante.product,
          cantidad: comprobante.cantidad,
          type: movement.type, // IN o OUT
          code:movement.code,
          service: movement.service || null, // Servicio asociado
        });
      });
    });
  }
  sortBy(key: string): void {
    if (this.currentSortKey === key) {
      // Cambiar la dirección si el mismo key se selecciona
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Cambiar la clave de ordenación y establecer dirección ascendente
      this.currentSortKey = key;
      this.currentSortDirection = 'asc';
    }

    this.sortedProducts.sort((a, b) => {
      const aValue = this.resolveKey(a, key);
      const bValue = this.resolveKey(b, key);

      if (aValue < bValue) return this.currentSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.currentSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  resolveKey(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => (o ? o[k] : null), obj);
  }


}
