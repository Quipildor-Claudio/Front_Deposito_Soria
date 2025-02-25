import { Component, OnInit } from '@angular/core';

import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FilterPipe, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  searchTerm: string = '';
  title: string = "Articulos con stock Bajo o sin Stock"
  productosModificados: Producto[] = [];
  user: User = new User();
  constructor(private productoService: ProductoService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.getUserTk().subscribe((res: any) => { this.user = res });
    this.getData();
  }

  getData() {
    this.productoService.modificadoSinStock().subscribe((res: any) => {
      this.productosModificados = res.productos;
      console.log(this.productosModificados)
    });
  }

  print() {
    window.print();
  }




}
