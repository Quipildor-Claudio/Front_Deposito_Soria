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
    
    html2canvas(data, { scale: 3 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const imgWidth = 210; // Ancho en mm (A4)
      const pageHeight = 297; // Alto en mm (A4)
      const marginTop = 5; // Margen superior de 0.5 cm
      const marginBottom = 10; // Margen inferior de 1 cm
      const availableHeight = pageHeight - marginTop - marginBottom; // Altura disponible en cada página
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la relación de aspecto
  
      let yPosition = 0; // Posición inicial para la imagen
      let currentPage = 1;
      const totalPages = Math.ceil(imgHeight / availableHeight); // Calcular total de páginas
  
      while (yPosition < imgHeight) {
        if (yPosition > 0) {
          pdf.addPage(); // Agregar nueva página si hay más contenido
          currentPage++;
        }
  
        pdf.addImage(imgData, 'PNG', 0, marginTop - yPosition, imgWidth, imgHeight);
  
        // Agregar número de página en el pie de página con margen de 1 cm
        pdf.setFontSize(10);
        pdf.text(`Página ${currentPage} de ${totalPages}`, 105, pageHeight - marginBottom / 2, { align: "center" });
  
        yPosition += availableHeight; // Avanzar para la siguiente página
      }
  
      pdf.save('movimientos-servicio.pdf'); // Guardar el archivo PDF
    });
  }
  

}
