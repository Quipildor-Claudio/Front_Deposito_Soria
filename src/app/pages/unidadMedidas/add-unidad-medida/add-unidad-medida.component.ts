import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UnidadMedida } from '../../../models/unidad-medida';
import { UnidadService } from '../../../services/unidad.service';

@Component({
  selector: 'app-add-unidad-medida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-unidad-medida.component.html',
  styleUrl: './add-unidad-medida.component.css'
})
export class AddUnidadMedidaComponent implements OnInit {
  unidadService = inject(UnidadService);
  unidadForm!: FormGroup;
  isEdit: boolean = false;
  unidadId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    // Inicializar formulario
    this.unidadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      observacion: [''],
    });
    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.unidadId = params['id'];
        this.loadUnidad(this.unidadId);
      }
    });
  }
  // Cargar datos de la unidad para editar
  loadUnidad(id: string): void {
    this.unidadService.get(id).subscribe((res: any) => {

      this.unidadForm.patchValue(res);
      //console.log(this.currentunidad);
    });
  }

  // Guardar o actualizar unidad
  saveUnidad(): void {
    if (this.unidadForm.invalid) return;

    const unidadData: UnidadMedida = this.unidadForm.value;

    if (this.isEdit && this.unidadId) {
      // Actualizar unidad
      this.unidadService.update(this.unidadId, unidadData).subscribe((res) => {
        this.router.navigate(['/unidades']);
      })

    } else {
      // Crear nueva unidad
      this.unidadService.create(unidadData).subscribe((res) => {
        this.unidadForm.reset();
        alert('Unidad de Medida creada exitosamente');

      });
    }
  }

}
