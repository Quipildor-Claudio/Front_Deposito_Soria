import { Routes } from '@angular/router';
import { LoguinComponent } from './pages/loguin/loguin.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { TipoComponent } from './pages/tipo/tipo.component';


export const routes: Routes = [
    { path: 'login', component: LoguinComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'tipo', component: TipoComponent },

    // { path: '**', redirectTo: 'login' },
];
