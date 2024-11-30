import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suministro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './suministro.component.html',
  styleUrl: './suministro.component.css'
})
export class SuministroComponent implements OnInit {
  searchControl = new FormControl('');
  searchId: string = '';
  searchName: string = '';
  authService = inject(AuthService);
  productoService = inject(ProductoService);

  productos: Producto[] = [];
  producosSeleccionados: Producto[] = [];
  currentProducto: Producto;
  title: string = "Suminstro";
  producto: Producto;

  constructor() {
    this.currentProducto = new Producto();
    this.producto = new Producto();


  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged(), // Evita realizar la misma búsqueda consecutivamente
        switchMap((value: string) => {
          if (value) {

            return this.productoService.searchProductsNom(value).pipe(
              catchError(() => of([])) // En caso de error, retorna un array vacío
            );

          } else {
            return of([]); // Si el valor está vacío, retorna un array vacío
          }
        })
      )
      .subscribe((result) => {
        if (Array.isArray(result)) {
          this.productos = result;
          this.producto = null;
        } else {
          this.producto = result;
          this.productos = [];
        }
      });

  }
}
