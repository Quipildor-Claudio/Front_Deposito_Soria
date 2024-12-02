import { Component, inject, OnInit } from '@angular/core';
import { MovimentService } from '../../services/moviment.service';
import { Movimiento } from '../../models/movimiento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Service } from '../../models/service';


@Component({
  selector: 'app-vista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista.component.html',
  styleUrl: './vista.component.css'
})

export class VistaComponent implements OnInit {
  movService = inject(MovimentService);
  serService = inject(ServicioService);
  movimiento: Movimiento;
  service: Service;
  movId: string;
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
    this.serService.get(this.movimiento.user.service).subscribe(res => this.service = res);
  }

  // Cargar datos de la tipo para editar
  loadMovimiento(id: string): void {
    this.movService.get(id).subscribe((res: any) => {
      this.movimiento = res;
      console.log(this.movimiento);
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
}
