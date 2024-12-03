import { Component, inject, OnInit } from '@angular/core';
import { MarcaService } from '../../../services/marca.service';
import { Marca } from '../../../models/marca';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css'
})

export class MarcaComponent implements OnInit {
  title: string = "Administracion Marca";
  marcaService = inject(MarcaService);
  marcas: Marca[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.marcaService.getAll().subscribe((res: any) => {
      this.marcas = res;
      //console.log(res);
    });
  }
  delete(item: any): void {
    this.marcaService.delete(item._id).subscribe(() => {
      alert('Eliminado exitosamente!');
      this.getData();
    });

  }


}
