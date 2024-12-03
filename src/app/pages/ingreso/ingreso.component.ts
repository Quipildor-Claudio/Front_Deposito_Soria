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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Movimiento } from '../../models/movimiento';


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
  isIngreso:boolean=true;
 
  constructor(private fb: FormBuilder) {

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
    movData.total = this.calcularTotal(this.comprobantes);
    this.authService.getUserTk().subscribe(res => movData.user = res);
    if (movData.comprobantes.length > 0) {
      console.log(movData);
      this.productoService.actualizarStock(movData.comprobantes, "IN").subscribe();
      this.movService.create(movData).subscribe((res) => {
        this.generatePDF(movData);
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

  generatePDF(movimiento:Movimiento) {
    const documentDefinition = {
      content: [
        { text: 'Hospital Pablo Soria', style: 'header' },
        { text: 'Dirección Administrativa', style: 'subheader' },
        { text: movimiento.user.service.name, style: 'subheader' },
        ...(this.isIngreso
          ? [
              { text: `Proveedor: ${movimiento.proveedor}` },
              { text: `Usuario: ${movimiento.user.name}` },
            ]
          : []),
        { text: `Fecha: ${movimiento.date}` },
        { text: `Hora: ${movimiento.hora}` },
        ...(this.isIngreso
          ? [
              { text: `Remito N°: ${movimiento.remito}` },
              { text: `O. Compra N°: ${movimiento.compra}` },
              { text: `Exp. N°: ${movimiento.expediente}` },
            ]
          : [{ text: `Usuario: ${movimiento.user.name}` }]),
        { text: 'Detalle del Movimiento', style: 'sectionHeader' },
        { text: `Numero: 2024-${movimiento.code}` },
        { text: `Tipo: ${movimiento.type}` },
        { text: `Observación: ${movimiento.observacion}` },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              ['Cod.', 'Articulo Descripcion', 'U.M', 'Cantidad'],
              ...movimiento.comprobantes.map((comp: any) => [
                comp.product?.code || '-',
                comp.product.name,
                comp.product.unidad.name,
                comp.cantidad,
              ]),
            ],
          },
        },
        ...(this.isIngreso
          ? [
              { text: `Total: $${movimiento.total}`, style: 'total' },
              {
                text: `En palabras: ${movimiento.total}`,
              },
            ]
          : []),
        {
          columns: [
            { text: this.isIngreso ? 'Firma Proveedor' : 'Firma Entrega', alignment: 'center' },
            { text: 'Firma Recepción', alignment: 'center' },
          ],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
        sectionHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
        total: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  
}
