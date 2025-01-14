import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
  movService = inject(MovimentService);
  authService = inject(AuthService);
  productService = inject(ProductoService);
  title: string = "Gestion de Reportes"
  searchForm: FormGroup;
  movements: Movimiento[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = ''; // Texto de búsqueda
  codeprod: string = null;
  totals: any;
  currentUser: any;
  currentProduct: any;



  constructor(private fb: FormBuilder) {
    this.currentUser = new User();
    this.currentProduct = new Producto();

    this.searchForm = this.fb.group({
      productCode: ['',],
      serviceId: ['',],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getUserTk().subscribe(res=>this.currentUser=res);

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

    this.productService.getbyCode(productCode).subscribe(res=>{
      this.currentProduct=res
      console.log(this.currentProduct);
    }
    );

    this.movService.buscarPorRangoDeFechaByProduct(startDate, endDate, productCode).subscribe((res) => {
      
      // Filtrar los comprobantes en cada registro
      this.movements = res.map(record => {
        const filteredComprobantes = record.comprobantes.filter(comp => comp.product.code === this.codeprod);

        return {
          ...record,
          comprobantes: filteredComprobantes,
        };
      });

      // Filtrar y sumar las cantidades de entrada y salida
      this.totals = this.movements.reduce(
        (acc, record) => {
          record.comprobantes
            .filter(comp => comp.product.code === productCode)
            .forEach(comp => {
              if (record.type === "IN") {
                acc.entrada += comp.cantidad;
              } else if (record.type === "OUT") {
                acc.salida += comp.cantidad;
              }
            });
          return acc;
        },
        { entrada: 0, salida: 0 }
      );
      console.log(this.movements);
      console.log(this.totals);
    });
  }




}
