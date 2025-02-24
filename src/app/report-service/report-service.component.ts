import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MovimentService } from '../services/moviment.service';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { Movimiento } from '../models/movimiento';
import { User } from '../models/user';
import { Service } from '../models/service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { startWith, map } from 'rxjs/operators';
import { ServicioService } from '../services/servicio.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-report-service',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './report-service.component.html',
  styleUrl: './report-service.component.css'
})

export class ReportServiceComponent {
  movService = inject(MovimentService);
  authService = inject(AuthService);
  productService = inject(ProductoService);
  serService = inject(ServicioService);

  title: string = "Gestion de Reportes"
  searchForm: FormGroup;
  movements: Movimiento[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = ''; // Texto de búsqueda
  totals: any;
  currentUser: any;
  currentProduct: any;
  inicio: string;
  final: string;
  myDate = new Date();
  currentTime: string;


  servicios: Service[] = [];
  textControl = new FormControl(''); // busqueda de servicios
  filteredServices: Observable<Service[]>;
  selectedService: Service | null = null; // Objeto seleccionado

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.currentUser = new User();
    this.getCurrentTime();
    this.searchForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.filteredServices = this.textControl.valueChanges.pipe(
      startWith(''),
      map((value: string | Service) => (typeof value === 'string' ? value : value?.name || '')),
      map((name) => this.filterServices(name))
    );
  }

  ngOnInit(): void {
    this.authService.getUserTk().subscribe(res => this.currentUser = res);
    this.getServicios();

  }
  buscarServicio(): void {
    if (this.searchForm.invalid) {
      alert('Por favor complete ambos campos de fecha.');
      return;
    }
    const { startDate, endDate } = this.searchForm.value;
    this.inicio = startDate;
    this.final = endDate;

    console.log(startDate, endDate, this.selectedService._id);
    this.movService.buscarPorRangoDeFechaByService(startDate, endDate, this.selectedService._id).subscribe((res) => {
      this.movements = res as Movimiento[];
      console.log(this.movements);
    });
  }

  getServicios() {
    this.serService.getAll().subscribe(res => this.servicios = res);
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
