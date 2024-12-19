import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';

import { Producto } from '../../models/producto';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/service';
import { MovimentService } from '../../services/moviment.service';
import { JwtService } from '../../services/jwt.service';
import { Comprobante } from '../../models/comprobante';
import { Router, RouterLink } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-suministro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './suministro.component.html',
  styleUrl: './suministro.component.css'
})
export class SuministroComponent implements OnInit {
  title: string = "Suministro";
  searchControl = new FormControl(''); // busqueda de producto
  textControl = new FormControl(''); // busqueda de servicios

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
  filteredServices: Observable<Service[]>;
  selectedService: Service | null = null; // Objeto seleccionado

  constructor(private fb: FormBuilder, private router: Router) {

    this.filteredServices = this.textControl.valueChanges.pipe(
      startWith(''),
      map((value: string | Service) => (typeof value === 'string' ? value : value?.name || '')),
      map((name) => this.filterServices(name))
    );
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
    movData.type = 'OUT';
    movData.hora = this.obtenerHoraActual();
    movData.comprobantes = this.comprobantes;
    this.authService.getUserTk().subscribe(res => movData.user = res);
    movData.service = this.selectedService;
    // console.log(movData);
    if (movData.comprobantes.length > 0) {
      //console.log(movData);
      this.productoService.actualizarStock(movData.comprobantes, "OUT").subscribe();
      this.movService.create(movData).subscribe((res) => {
        //this.router.navigate(['/vista', res._id]);
        this.downloadPdf(res._id);
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

  private filterServices(name: string): Service[] {
    const filterValue = name.toLowerCase();
    return this.servicios.filter((service) =>
      service.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(service: Service): void {
    this.selectedService = service; // Guardar el servicio seleccionado

  }

  displayFn(service: Service): string {
    return service ? service.name : '';
  }

  downloadPdf(movementId: string) {
    this.movService.downloadPdf(movementId).subscribe({
      next: (pdfBlob) => {
        // Crear un objeto URL para el archivo PDF
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Abrir el PDF en una nueva pestaña
        window.open(url, '_blank');
        // Liberar el objeto URL después de su uso
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar el PDF:', error);
      },
    });
  }
}
