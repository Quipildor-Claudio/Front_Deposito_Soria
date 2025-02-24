import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/service';
import { MovimentService } from '../../services/moviment.service';
import { JwtService } from '../../services/jwt.service';
import { Comprobante } from '../../models/comprobante';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-suministro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './suministro.component.html',
  styleUrls: ['./suministro.component.css']
})
export class SuministroComponent implements OnInit {
  title: string = "Suministro";
  searchControl = new FormControl('');  // Control de búsqueda de productos
  textControl = new FormControl('');  // Control de búsqueda de servicios
  products: Producto[] = [];  // Lista de productos buscados
  comprobantes: Comprobante[] = [];  // Lista de productos seleccionados
  servicios: Service[] = [];  // Lista de servicios
  movFrom!: FormGroup;
  userId: string = '';  // ID del usuario
  filteredServices: Observable<Service[]>;  // Servicios filtrados
  selectedService: Service | null = null;  // Servicio seleccionado

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productoService: ProductoService,
    private serService: ServicioService,
    private movService: MovimentService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {
    this.filteredServices = this.textControl.valueChanges.pipe(
      startWith(''),
      map((value: string | Service) => (typeof value === 'string' ? value : value?.name || '')),
      map((name) => this.filterServices(name))
    );
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      this.userId = this.jwtService.getUserIdFromToken(token || '');
    }

    this.movFrom = this.fb.group({
      service: [null],
      observacion: [null],
      user: [this.userId, Validators.required],
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (value) {
          return this.productoService.searchProductsNom(value).pipe(catchError(() => of([])));
        } else {
          return of([]);
        }
      })
    ).subscribe((result) => {
      this.products = Array.isArray(result) ? result : [];
    });

    this.getServicios();
  }

  getServicios() {
    this.serService.getAll().subscribe(res => this.servicios = res);
  }

  addPro(producto: Producto): void {
  
    if (producto) {
 
      const existe = this.comprobantes.find((comprobante) => comprobante.product._id === producto._id);
      if (!existe) {
        this.comprobantes.push({ product: producto, cantidad: 0 });
        this.products = [];
        this.searchControl.reset();
      }
    }
  }

  saveTipo(): void {
    const movData = this.movFrom.value;
    movData.type = 'OUT';
    movData.hora = this.obtenerHoraActual();
    movData.comprobantes = this.comprobantes;
    movData.service = this.selectedService;

    if (!movData.comprobantes.length || !this.todosConCantidadMayorACero(movData.comprobantes)) {
      alert('Debe agregar al menos un producto con cantidad mayor a 0.');
      return;
    }

    this.authService.getUserTk().subscribe(res => {
      movData.user = res;
      // Llamamos a los servicios para actualizar el stock y crear el movimiento
      this.productoService.actualizarStock(movData.comprobantes, "OUT").subscribe(() => {
        this.movService.create(movData).subscribe((res) => {
          this.downloadPdf(res._id);
          this.limpiarLista();
        });
      });
    });
  }

  actualizarCantidad(comprobante: Comprobante, $event: Event): void {
    comprobante.cantidad = Number(($event.target as HTMLInputElement).value);
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

  filterServices(name: string): Service[] {
    const filterValue = name.toLowerCase();
    return this.servicios.filter((service) =>
      service.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(service: Service): void {
    this.selectedService = service;
  }

  displayFn(service: Service): string {
    return service ? service.name : '';
  }

  todosConCantidadMayorACero(comprobantes: Comprobante[]): boolean {
    return comprobantes.every(comprobante => comprobante.cantidad > 0);
  }

  downloadPdf(movementId: string) {
    this.movService.downloadPdf(movementId).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar el PDF:', error);
      },
    });
  }
}
