import { Component, inject, OnInit } from '@angular/core';
import { Movimiento } from '../../models/movimiento';
import { RouterLink } from '@angular/router';
import { MovimentService } from '../../services/moviment.service';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../models/paginated-response';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit {
  title: string = "Movimientos";
  movimientos: Movimiento[] = [];
  movService = inject(MovimentService);

  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.movService.getMovientos(this.currentPage, this.limit).subscribe((data: PaginatedResponse<Movimiento>) => {
      this.movimientos = data.items;
      this.totalItems = data.totalItems;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage;
      //console.log(this.articulos, this.totalPages)
    });
  }
  changePage(page: number): void {
    this.currentPage = page;
    this.loadMovimientos();
  }
}
