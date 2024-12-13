import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Service } from '../../models/service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NumberToWordsService } from '../../services/number-to-words.service';

@Component({
  selector: 'app-vista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista.component.html',
  styleUrl: './vista.component.css'
})

export class VistaComponent implements OnInit {

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  movService = inject(MovimentService);
  serService = inject(ServicioService);
  convertidor = inject(NumberToWordsService);
  movimiento: Movimiento;
  service: Service;
  movId: string;
  isIngreso: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.movimiento = new Movimiento();
    this.service = new Service();
  }
  ngOnInit(): void {
    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.movId = params['id'];
        this.loadMovimiento(this.movId);
      }
    });

  }

  // Cargar datos de la tipo para editar
  loadMovimiento(id: string): void {
    this.movService.get(id).subscribe((res: any) => {
      this.movimiento = res;
      if (this.movimiento.type == "IN") {
        this.isIngreso = true;
      }
      console.log(this.movimiento.user.service);
      this.serService.get(this.movimiento.user.service).subscribe(res => this.service = res);

    });
  }

  getMovimientoTipo(type: string): string {
    if (type === 'OUT') {
      return 'SUMINISTRO';
    } else if (type === 'IN') {
      return 'INGRESO';
    }
    return 'Desconocido';
  }
  generatePDF(): void {
    const element = this.pdfContent.nativeElement;
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4'); // PDF en orientación vertical (portrait)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Ajustar la imagen para que se divida entre la izquierda y la derecha
      const leftMargin = 5;
      const topMargin = 5;
      // const cardWidth = (pageWidth / 2) - 10; // 50% del ancho de la página menos márgenes
      const cardWidth = (pageWidth) - 10; // 50% del ancho de la página menos márgenes
      const cardHeight = (pageHeight / 2) - 10; // Usar toda la altura disponible menos los márgenes

      // Primero se agrega la mitad de la imagen en la parte izquierda
      pdf.addImage(imgData, 'PNG', leftMargin, topMargin, cardWidth, cardHeight);

      // Luego se agrega la otra mitad de la imagen en la parte derecha
      //pdf.addImage(imgData, 'PNG', pageWidth / 2, topMargin, cardWidth, cardHeight);

      // Guardar el PDF con las dos mitades de la imagen
      pdf.save('reporte-movimiento.pdf');
    });
  }
  generatePDFs(): void {
    this.downloadPdf(this.movId);
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
