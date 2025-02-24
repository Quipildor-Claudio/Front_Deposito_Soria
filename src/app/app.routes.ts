import { Routes } from '@angular/router';
import { LoguinComponent } from './pages/loguin/loguin.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { TipoComponent } from './pages/tipos/tipo/tipo.component';
import { MarcaComponent } from './pages/marcas/marca/marca.component';
import { ProductoComponent } from './pages/productos/producto/producto.component';
import { UnidadMedidaComponent } from './pages/unidadMedidas/unidad-medida/unidad-medida.component';
import { AddTipoComponent } from './pages/tipos/add-tipo/add-tipo.component';
import { AddMarcaComponent } from './pages/marcas/add-marca/add-marca.component';
import { AddUnidadMedidaComponent } from './pages/unidadMedidas/add-unidad-medida/add-unidad-medida.component';
import { AddProductoComponent } from './pages/productos/add-producto/add-producto.component';
import { SuministroComponent } from './pages/suministro/suministro.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { MovimientoComponent } from './pages/movimiento/movimiento.component';
import { VistaComponent } from './pages/vista/vista.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { ServicioComponent } from './pages/servicios/servicio/servicio.component';
import { AddServicioComponent } from './pages/servicios/add-servicio/add-servicio.component';
import { ReportServiceComponent } from './report-service/report-service.component';


export const routes: Routes = [
    { path: 'login', component: LoguinComponent },
    { path: 'register', component: RegisterComponent ,canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    { path: 'marcas', component: MarcaComponent ,canActivate: [authGuard] },
    { path: 'marca', component: AddMarcaComponent ,canActivate: [authGuard] },
    { path: 'marca/:id', component: AddMarcaComponent ,canActivate: [authGuard] },

    { path: 'tipos', component: TipoComponent ,canActivate: [authGuard] },
    { path: 'tipo', component: AddTipoComponent,canActivate: [authGuard]  },
    { path: 'tipo/:id', component: AddTipoComponent,canActivate: [authGuard]  },



    { path: 'unidades', component: UnidadMedidaComponent,canActivate: [authGuard] },
    { path: 'unidad', component: AddUnidadMedidaComponent,canActivate: [authGuard] },
    { path: 'unidad/:id', component: AddUnidadMedidaComponent,canActivate: [authGuard]  },



    { path: 'productos', component: ProductoComponent,canActivate: [authGuard]  },
    { path: 'producto', component: AddProductoComponent,canActivate: [authGuard]  },
    { path: 'producto/:id', component: AddProductoComponent,canActivate: [authGuard]  },

    { path: 'suministro', component: SuministroComponent,canActivate: [authGuard]  },
    { path: 'suministro/:id', component: SuministroComponent,canActivate: [authGuard]  },


    { path: 'ingreso', component: IngresoComponent,canActivate: [authGuard]  },
    { path: 'ingreso/:id', component: IngresoComponent,canActivate: [authGuard]  },

    { path: 'movimientos', component: MovimientoComponent,canActivate: [authGuard]  },

    { path: 'vista/:id', component: VistaComponent,canActivate: [authGuard]  },

    { path: 'reportes', component: ReporteComponent ,canActivate: [authGuard] },
    { path: 'reportes_servicio', component: ReportServiceComponent ,canActivate: [authGuard] },

    
    { path: 'servicios', component: ServicioComponent ,canActivate: [authGuard] },
    { path: 'servicio', component: AddServicioComponent ,canActivate: [authGuard] },
    { path: 'servicio/:id', component: AddServicioComponent ,canActivate: [authGuard] },

 // Ruta para manejo de errores, cuando la ruta no se encuentra
 { path: '**', component: DashboardComponent,canActivate: [authGuard]  }, // Redirige a una página de error si la ruta no es válida

 { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirige al login si la ruta está vacía
];
