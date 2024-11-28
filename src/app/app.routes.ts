import { Routes } from '@angular/router';
import { LoguinComponent } from './pages/loguin/loguin.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { TipoComponent } from './pages/tipos/tipo/tipo.component';
import { MarcaComponent } from './pages/marcas/marca/marca.component';
import { UnidadMedida } from './models/unidad-medida';
import { ProductoComponent } from './pages/productos/producto/producto.component';
import { UnidadMedidaComponent } from './pages/unidadMedidas/unidad-medida/unidad-medida.component';


export const routes: Routes = [
    { path: 'login', component: LoguinComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'tipos', component: TipoComponent },

    { path: 'marcas', component: MarcaComponent },

    { path: 'unidades', component: UnidadMedidaComponent },

    { path: 'productos', component: ProductoComponent },


    // { path: '**', redirectTo: 'login' },
];
