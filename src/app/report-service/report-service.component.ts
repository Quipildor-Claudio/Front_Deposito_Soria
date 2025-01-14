import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MovimentService } from '../services/moviment.service';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-report-service',
  standalone: true,
  imports: [],
  templateUrl: './report-service.component.html',
  styleUrl: './report-service.component.css'
})
export class ReportServiceComponent {
  movService = inject(MovimentService);
  authService = inject(AuthService);
  productService = inject(ProductoService);
  title: string = "Gestion de Reportes"
}
