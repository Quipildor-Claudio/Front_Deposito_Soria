import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Movimiento } from '../../models/movimiento';
import { ActivatedRoute, Router } from '@angular/router';


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
  isEdit: boolean = false;
  movId?: string;
  currentMoviment: Movimiento;


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.currentMoviment = new Movimiento();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      this.userId = this.jwtService.getUserIdFromToken(token);
    }
    this.movFrom = this.fb.group({
      remito: [null, [Validators.required]],
      proveedor: [null, [Validators.required]],
      compra: [null, [Validators.required]],
      expediente: [null, [Validators.required]],
      total: [0],
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

    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.movId = params['id'];
        this.loadMov(this.movId);
      }
    });

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

  loadMov(id: any): void {
    this.movService.get(id).subscribe(res => {
      this.currentMoviment = res;
      this.movFrom.patchValue(res);
      this.isEdit = true;
    });
  }

  saveTipo(): void {
    if (this.movFrom.invalid) return;


    if (this.isEdit && this.movId) {
      const { observacion, remito, proveedor, compra, expediente } = this.movFrom.value;
      this.currentMoviment.observacion = observacion;
      this.currentMoviment.remito = remito;
      this.currentMoviment.proveedor = proveedor;
      this.currentMoviment.compra = compra;
      this.currentMoviment.expediente = expediente;

      console.log(this.currentMoviment);
      this.movService.update(this.currentMoviment._id, this.currentMoviment).subscribe((res) => {
        this.router.navigate(['/vista', res._id]);
        this.limpiarLista();
      });

    } else {
      const movData = this.movFrom.value;
      movData.type = 'IN';
      movData.hora = this.obtenerHoraActual();
      movData.comprobantes = this.comprobantes;
      movData.total = this.calcularTotal(this.comprobantes);
      this.authService.getUserTk().subscribe(res => movData.user = res);
      if (movData.comprobantes.length > 0) {
        console.log(movData);
        this.productoService.actualizarStock(movData.comprobantes, "IN").subscribe();
        this.movService.create(movData).subscribe((res) => {
          // console.log(res);
          //this.router.navigate(['/vista', res._id]);
          this.downloadPdf(res._id);
          this.limpiarLista();

        });
      } else {
        alert('Debe agregar al menos un producto.');
      }

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
    this.movFrom.reset();
  }
  obtenerHoraActual(): string {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  calcularTotal(comprobantes: Comprobante[]): number {
    // Inicializamos el total en 0
    let total = 0;

    // Iteramos sobre cada comprobante
    comprobantes.forEach(comprobante => {
      // Multiplicamos la cantidad por el precio del producto y lo sumamos al total
      total += comprobante.cantidad * comprobante.product.price;
    });

    return total;
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
