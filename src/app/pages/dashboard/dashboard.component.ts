import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  title:string="Articulos con stock Bajo o sin Stock"
  productosModificados:Producto[]=[];
  constructor(private productoService:ProductoService) {

  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.productoService.modificadoSinStock().subscribe((res:any)=>{
      this.productosModificados=res.productos;
      console.log(this.productosModificados)
    });
  }
}
