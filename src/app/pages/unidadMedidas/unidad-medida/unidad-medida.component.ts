import { Component, inject, OnInit } from '@angular/core';
import { UnidadService } from '../../../services/unidad.service';
import { UnidadMedida } from '../../../models/unidad-medida';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unidad-medida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unidad-medida.component.html',
  styleUrl: './unidad-medida.component.css'
})
export class UnidadMedidaComponent implements OnInit {
  title: string = "Administracion Unidad de Medida";
  unidadService = inject(UnidadService);
  unidades: UnidadMedida[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.unidadService.getAll().subscribe((res: any) => {
      this.unidades = res;
      console.log(res);
    });
  }
  delete(item: any): void {

  }
}
