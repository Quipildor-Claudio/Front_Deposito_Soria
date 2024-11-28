import { Component, inject, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit{
  productoService = inject(ProductoService);
  title: string = "Administracion Articulos";
  articulos:Producto[];
  ngOnInit(): void {
    this.getData();
  }
  getData():void{
    this.productoService.getAll().subscribe((res:any)=>{
      this.articulos=res;
      console.log(res);
    });
  }
  delete(item:any):void{

  }

}
