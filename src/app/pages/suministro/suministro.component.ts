import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';

import { Producto } from '../../models/producto';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/service';
import { Movimiento } from '../../models/movimiento';
import { MovimentService } from '../../services/moviment.service';


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
  serService = inject(ServicioService);
  movService = inject(MovimentService);

  servicios: Service[] = [];
  productos: Producto[] = [];
  products: Producto[] = [];
  currentProducto: Producto;
  title: string = "Suminstro";
  producto: Producto;
  movFrom!: FormGroup;
  constructor(private fb: FormBuilder,) {
    this.currentProducto = new Producto();
    this.producto = new Producto();


  }

  ngOnInit(): void {
    this.getServicios();
    // Inicializar formulario

    // Inicializar formulario
    this.movFrom = this.fb.group({
      products: [null],
      service: [null],
      quantity: 0,
      user: [null],
      hora: [null],
      observacion: [null],
    });

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

  getServicios() {
    this.serService.getAll().subscribe(res => this.servicios = res);
  }
  addPro(item: any) {
    if (item) {
      const existe = this.products.find(prod => prod._id === item._id);
      if (!existe) {
        this.products.push({
          ...item,
          cantidad: new FormControl(1), // Cantidad inicial
        });

        console.log(this.products);
        this.productos = [];
        this.searchControl.reset();
      } else {
        alert('El producto ya está en la lista.');
      }
    }

  }

  eliminarProducto(codigo: string) {
    this.products = this.products.filter(item => item._id !== codigo);
  }
  limpiarLista() {
    this.products = [];
  }

  saveTipo() {
    const movData: Movimiento = this.movFrom.value;
    movData.products = this.products.map(prod => ({
      ...prod,
      cantidad: prod.cantidad?.value, // Extraer el valor del FormControl
    }));
    movData.hora = this.obtenerHoraActual();
    this.authService.getUserTk().subscribe(res => movData.user = res);
    movData.type = "OUT";
    if (movData.products.length > 0) {
      console.log(movData);
      this.productoService.actualizarStock(this.products).subscribe();
      this.movService.create(movData).subscribe();
      this.products = [];
    }
  }

  actualizarCantidad(producto: any, $event) {
    const prod = this.products.find(item => item._id === producto._id);
    if (prod) {
      prod.cantidad.setValue($event.target.value); // Actualizar el FormControl
    } else {
      console.error('Producto no encontrado.');
    }
  }


  obtenerHoraActual = (): string => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0'); // Formatea a dos dígitos
    const minutos = ahora.getMinutes().toString().padStart(2, '0');

    return `${horas}:${minutos}`;
  };

}
