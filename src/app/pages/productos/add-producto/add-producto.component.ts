
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Marca } from '../../../models/marca';
import { Tipo } from '../../../models/tipo';
import { UnidadMedida } from '../../../models/unidad-medida';
import { MarcaService } from '../../../services/marca.service';
import { TipoService } from '../../../services/tipo.service';
import { UnidadService } from '../../../services/unidad.service';

@Component({
  selector: 'app-add-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-producto.component.html',
  styleUrl: './add-producto.component.css'
})
export class AddProductoComponent implements OnInit {
  productoService = inject(ProductoService);
  marcaService = inject(MarcaService);
  tipoService = inject(TipoService);
  unidadService = inject(UnidadService);

  productoForm!: FormGroup;
  isEdit: boolean = false;
  proId?: string;
  marcas: Marca[] = []; // Lista de marcas
  tipos: Tipo[] = []; // Lista de familias
  unidades: UnidadMedida[] = []; // Lista de medidas
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    // Inicializar formulario
    this.productoForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [null, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      observation: [''],
      marca: [null],
      tipo: [null],
      unidad: [null],
    });

    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.proId = params['id'];
        this.loadProducto(this.proId);
      }
    });

    this.loadMarcas();
    this.loadTipos();
    this.loadMedidas();
  }

  // Cargar datos de la tipo para editar
  loadProducto(id: string): void {
    this.productoService.get(id).subscribe((res: any) => {
      this.productoForm.patchValue(res);
      //console.log(this.currenttipo);
    });
  }

  loadMarcas() {
    this.marcaService.getAll().subscribe((data) => {
      this.marcas = data;
    });
  }
  loadTipos() {
    this.tipoService.getAll().subscribe((data) => {
      this.tipos = data;
    });
  }
  loadMedidas() {
    this.unidadService.getAll().subscribe((data) => {
      this.unidades = data;
    });
  }



  // Guardar o actualizar tipo
  saveTipo(): void {
    if (this.productoForm.invalid) return;

    const proData: Producto = this.productoForm.value;

    if (this.isEdit && this.proId) {
      // Actualizar tipo
      this.productoService.update(this.proId, proData).subscribe((res) => {
        this.router.navigate(['/productos']);
      })

    } else {
      // Crear nueva tipo
      this.productoService.create(proData).subscribe((res) => {
        this.productoForm.reset();
        alert('Articulo creada exitosamente');
        this.router.navigate(['/productos']);

      });
    }
  }


}
