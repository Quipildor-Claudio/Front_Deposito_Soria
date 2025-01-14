import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  inicio: string;
  final: string;
  myDate = new Date();
  currentTime: string;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.currentUser = new User();
    this.currentProduct = new Producto();
    this.getCurrentTime();
    this.searchForm = this.fb.group({
      productCode: ['',],
      serviceId: ['',],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getUserTk().subscribe(res => this.currentUser = res);

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
    this.inicio = startDate;
    this.final = endDate;
    this.productService.getbyCode(productCode).subscribe(res => {
      this.currentProduct = res
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


  getCurrentTime(): void {
    const currentDate = new Date();
    const hours = currentDate.getHours(); // Obtiene la hora
    const minutes = currentDate.getMinutes(); // Obtiene los minutos
    const seconds = currentDate.getSeconds(); // Obtiene los segundos

    // Formatea la hora en un string
    this.currentTime = `${this.formatNumber(hours)}:${this.formatNumber(minutes)}:${this.formatNumber(seconds)}`;
  }

  formatNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  generatePDF(): void {
    const data = this.pdfContent.nativeElement;
  // Mejorar la calidad usando html2canvas con un valor de escala mayor
  html2canvas(data, { scale: 3 }).then(canvas => {  // 'scale: 3' aumenta la resolución
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la relación de aspecto

    // Calcular la posición horizontal para centrar la tabla
    const xOffset = (pdf.internal.pageSize.width - imgWidth) / 2;

    // Calcular la posición vertical para centrar la tabla (opcional)
    const yOffset = 0;

    // Agregar la imagen centrada en el PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // Guardar el archivo PDF
    pdf.save('movimientos-producto.pdf');
  });
  }

}
