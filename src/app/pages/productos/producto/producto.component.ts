import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { PaginatedResponse } from '../../../models/paginated-response';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
}) 
export class ProductoComponent implements OnInit {
  productoService = inject(ProductoService);
  title: string = "Administracion Articulos";
  articulos: Producto[];
  searchControl = new FormControl('');
  //PAGINACION

  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;


  ngOnInit(): void {
   this.loadProds();
   this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (value) {
            return this.productoService.searchProductsNom(value).pipe(
              catchError(() => of([]))
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((result) => {
        this.articulos = Array.isArray(result) ? result : [];
      });

  }
  getData(): void {
    this.productoService.getProductos().subscribe((res: any) => {
      this.articulos = res;
      // console.log(res);
    });
  }
  loadProds(): void {
    this.productoService.getProductos(this.currentPage, this.limit).subscribe((data: PaginatedResponse<Producto>) => {
      this.articulos = data.items;
      this.totalItems = data.totalItems;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage;
      //console.log(this.articulos, this.totalPages)
    });
  }
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProds();
  }
  delete(item: any): void {
    this.productoService.delete(item._id).subscribe(()=>{
      alert("Eliminado exitosamente!");
      this.loadProds();

    });
  }

}
