import { Component, inject, OnInit } from '@angular/core';
import { TipoService } from '../../services/tipo.service';
import { Tipo } from '../../models/tipo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tipo.component.html',
  styleUrl: './tipo.component.css'
})
export class TipoComponent implements OnInit {
  title: string = "Administracion Familia";
  tipoService = inject(TipoService);
  familias:Tipo[];
  ngOnInit(): void {
    this.getData();
  }
  getData():void{
    this.tipoService.getAll().subscribe((res:any)=>{
      this.familias=res;
      console.log(res);
    });
  }
  delete(item:any):void{

  }
}
