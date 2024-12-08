import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MarcaService } from '../../../services/marca.service';
import { Marca } from '../../../models/marca';
@Component({
  selector: 'app-add-marca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-marca.component.html',
  styleUrl: './add-marca.component.css'
})
export class AddMarcaComponent implements OnInit {
  marcaService = inject(MarcaService);
  marcaForm!: FormGroup;
  isEdit: boolean = false;
  marcaId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    // Inicializar formulario
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      observacion: [''],
    });
    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.marcaId = params['id'];
        this.loadMarca(this.marcaId);
      }
    });
  }
  // Cargar datos de la marca para editar
  loadMarca(id: string): void {
    this.marcaService.get(id).subscribe((res: any) => {

      this.marcaForm.patchValue(res);
      //console.log(this.currentMarca);
    });
  }

  // Guardar o actualizar marca
  saveMarca(): void {
    if (this.marcaForm.invalid) return;

    const marcaData: Marca = this.marcaForm.value;

    if (this.isEdit && this.marcaId) {
  
      // Actualizar marca
      this.marcaService.update(this.marcaId,marcaData).subscribe((res)=>{
        this.router.navigate(['/marcas']);
      })

    } else {
      // Crear nueva marca
      this.marcaService.create(marcaData).subscribe((res) => {
        this.marcaForm.reset();
        alert('Marca creada exitosamente');
        this.router.navigate(['/marcas']);
        
      });
    }
  }

}
