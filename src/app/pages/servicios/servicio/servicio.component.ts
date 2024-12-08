import { Component, inject, OnInit } from '@angular/core';
import { ServicioService } from '../../../services/servicio.service';
import { Service } from '../../../models/service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent implements OnInit {
  title: string = "Servicios";
  servicoService = inject(ServicioService);
  servicios: Service[] = [];

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.servicoService.getAll().subscribe(res=>this.servicios=res);
  }
  
  delete(item:any):void{
      this.servicoService.delete(item._id).subscribe(()=>
        {
          this.getData();
        }
      );
  }


}
