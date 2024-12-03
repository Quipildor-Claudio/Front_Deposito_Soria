import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { ServicioService } from '../../services/servicio.service';
import { MovimentService } from '../../services/moviment.service';
import { JwtService } from '../../services/jwt.service';
import { Producto } from '../../models/producto';
import { Comprobante } from '../../models/comprobante';
import { Service } from '../../models/service';
@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})

export class IngresoComponent implements OnInit {
  title: string = "Ingreso";
  searchControl = new FormControl('');
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  serService = inject(ServicioService);
  movService = inject(MovimentService);
  jwtService = inject(JwtService);
  products: Producto[] = []; // lsita de productos buscados
  comprobantes: Comprobante[] = [];
  servicios: Service[] = [];
  movFrom!: FormGroup;
  userId: string;
  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      this.userId = this.jwtService.getUserIdFromToken(token);
    }
    this.movFrom = this.fb.group({
      service: [null],
      observacion: [null],
      user: this.userId,
    });

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
        this.products = Array.isArray(result) ? result : [];
      });

    this.getServicios();
  }
  getServicios() {
    this.serService.getAll().subscribe(res => this.servicios = res);
  }
  addPro(producto: Producto) {
    if (producto) {
      const existe = this.comprobantes.find(
        (comprobante) => comprobante.product._id === producto._id
      );
      if (!existe) {
        this.comprobantes.push({
          product: producto,
          cantidad: 0, // Por defecto, cantidad inicial es 1
        });
        this.products = [];
        this.searchControl.reset();
      }

    }
  }
  saveTipo(): void {

    const movData = this.movFrom.value;
    movData.type = 'IN';
    movData.hora = this.obtenerHoraActual();
    movData.comprobantes = this.comprobantes;
    this.authService.getUserTk().subscribe(res => movData.user = res);
    if (movData.comprobantes.length > 0) {
      console.log(movData);
      this.productoService.actualizarStock(movData.comprobantes, "IN").subscribe();
      this.movService.create(movData).subscribe((res) => {
        alert('Guardado exitosamente.');
        this.limpiarLista();
      });
    } else {
      alert('Debe agregar al menos un producto.');
    }
  }

  actualizarCantidad(comprobante: Comprobante, $event): void {
    comprobante.cantidad = Number($event.target.value); // Actualiza la cantidad del comprobante
  }

  eliminarProducto(id: string): void {
    this.comprobantes = this.comprobantes.filter((comprobante) => comprobante.product._id !== id);
  }

  limpiarLista(): void {
    this.comprobantes = [];
  }
  obtenerHoraActual(): string {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}
