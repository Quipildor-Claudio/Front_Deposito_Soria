import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FilterPipe, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {
  title: string = "Gestion de Reportes"
  searchForm: FormGroup;
  movements: Movimiento[] = [];
  movService = inject(MovimentService);
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = ''; // Texto de búsqueda
  codeprod: string = null;
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      productCode: ['',],
      serviceId: ['',],
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
    });
  }

  buscarProd(): void {
    if (this.searchForm.invalid) {
      alert('Por favor complete ambos campos de fecha.');
      return;
    }
    const { startDate, endDate, productCode } = this.searchForm.value;
    this.codeprod = productCode;
    console.log(startDate, endDate, productCode);
    this.movService.buscarPorRangoDeFechaByProduct(startDate, endDate, productCode).subscribe((res) => {
      this.movements = res as Movimiento[];
      console.log(this.movements);
    });
  }



}
