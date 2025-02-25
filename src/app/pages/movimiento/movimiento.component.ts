import { Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { Movimiento } from '../../models/movimiento';
import { RouterLink } from '@angular/router';
import { MovimentService } from '../../services/moviment.service';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../models/paginated-response';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit {
  title: string = "Movimientos";
  movimientos: Movimiento[] = [];
  movService = inject(MovimentService);
  searchControl = new FormControl('');

  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 30;
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
