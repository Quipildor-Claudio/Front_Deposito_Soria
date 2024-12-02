import { Component, inject, OnInit } from '@angular/core';
import { Movimiento } from '../../models/movimiento';
import { RouterLink } from '@angular/router';
import { MovimentService } from '../../services/moviment.service';
import { CommonModule } from '@angular/common';
import { Console } from 'console';

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

  ngOnInit(): void {

    this.movService.getAll().subscribe(res => {
      this.movimientos = res
      console.log(res);
    });
  }
}
