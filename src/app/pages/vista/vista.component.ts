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
      const pdf = new jsPDF('landscape', 'mm', 'a4'); // Horizontal A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Ajusta el tamaño de la imagen al PDF
      pdf.addImage(imgData, 'PNG', 5, 5, pageWidth - 20, pageHeight - 20);

      pdf.save('reporte-movimiento.pdf');
    });
  }

}
