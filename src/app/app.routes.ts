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


export const routes: Routes = [
    { path: 'login', component: LoguinComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    { path: 'marcas', component: MarcaComponent },
    { path: 'marca', component: AddMarcaComponent },
    { path: 'marca/:id', component: AddMarcaComponent },

    { path: 'tipos', component: TipoComponent },
    { path: 'tipo', component: AddTipoComponent },
    { path: 'tipo/:id', component: AddTipoComponent },



    { path: 'unidades', component: UnidadMedidaComponent },
    { path: 'unidad', component: AddUnidadMedidaComponent },
    { path: 'unidad/:id', component: AddUnidadMedidaComponent },



    { path: 'productos', component: ProductoComponent },
    { path: 'producto', component: AddProductoComponent },
    { path: 'producto/:id', component: AddProductoComponent },

    { path: 'suministro', component: SuministroComponent },
    { path: 'suministro/:id', component: SuministroComponent },


    { path: 'ingreso', component: IngresoComponent },
    { path: 'ingreso/:id', component: IngresoComponent },

    { path: 'movimientos', component: MovimientoComponent },

    // { path: '**', redirectTo: 'login' },
];
