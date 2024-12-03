import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoService } from '../../../services/tipo.service';
import { Tipo } from '../../../models/tipo';

@Component({
  selector: 'app-add-tipo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-tipo.component.html',
  styleUrl: './add-tipo.component.css'
})
export class AddTipoComponent implements OnInit {
  tipoService = inject(TipoService);
  tipoForm!: FormGroup;
  isEdit: boolean = false;
  tipoId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    // Inicializar formulario
    this.tipoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      observacion: [''],
    });
    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.tipoId = params['id'];
        this.loadTipo(this.tipoId);
      }
    });
  }
  // Cargar datos de la tipo para editar
  loadTipo(id: string): void {
    this.tipoService.get(id).subscribe((res: any) => {
      this.tipoForm.patchValue(res);
      //console.log(this.currenttipo);
    });
  }

  // Guardar o actualizar tipo
  saveTipo(): void {
    if (this.tipoForm.invalid) return;

    const tipoData: Tipo = this.tipoForm.value;

    if (this.isEdit && this.tipoId) {
      // Actualizar tipo
      this.tipoService.update(this.tipoId,tipoData).subscribe((res)=>{
        this.router.navigate(['/tipos']);
      })

    } else {
      // Crear nueva tipo
      this.tipoService.create(tipoData).subscribe((res) => {
        this.tipoForm.reset();
        alert('Familia creada exitosamente');
        this.router.navigate(['/tipos']);
      });
    }
  }
}
