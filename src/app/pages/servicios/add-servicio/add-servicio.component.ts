import { Component, inject, OnInit } from '@angular/core';
import { ServicioService } from '../../../services/servicio.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Service } from '../../../models/service';


@Component({
  selector: 'app-add-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-servicio.component.html',
  styleUrl: './add-servicio.component.css'
})
export class AddServicioComponent implements OnInit{
  servicioService = inject(ServicioService);
  serviceForm!: FormGroup;
  isEdit: boolean = false;
  serviceId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit(): void {
          // Inicializar formulario
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      observacion: [''],
    });
    // Verificar si estamos editando
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.serviceId = params['id'];
        this.loadService(this.serviceId);
      }
    });
  }

  loadService(id:any):void{
    this.servicioService.get(id).subscribe(res=>{
      this.serviceForm.patchValue(res);
    });
  }

   // Guardar o actualizar marca
   saveService(): void {
    if (this.serviceForm.invalid) return;

    const serviceData: Service = this.serviceForm.value;

    if (this.isEdit && this.serviceId) {
      // Actualizar marca
      this.servicioService.update(this.serviceId,serviceData).subscribe((res)=>{
        this.router.navigate(['/servicios']);
      })

    } else {
      // Crear nueva marca
      this.servicioService.create(serviceData).subscribe((res) => {
        this.serviceForm.reset();
        alert('Marca creada exitosamente');
        this.router.navigate(['/servicios']);
        
      });
    }
  }


}
