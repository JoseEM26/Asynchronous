import { Routes } from '@angular/router';
import { AsynchronousLayoutComponent } from './layout/asynchronous-layout/asynchronous-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TrabajadoresListComponent } from './pages/trabajadores/trabajadores-list.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list.component';
import { AsistenciasListComponent } from './pages/asistencias/asistencias-list.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { QrAsistenciaComponent } from './pages/asistencias/qr-asistencia.component';

import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AsynchronousLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'personal', loadComponent: () => import('./pages/personal/personal-list.component').then(m => m.PersonalListComponent) },
      { path: 'asistencias', component: AsistenciasListComponent },
      { path: 'qr-generator', component: QrAsistenciaComponent },
      { path: 'comunicados', loadComponent: () => import('./pages/comunicados/comunicados-management.component').then(m => m.ComunicadosManagementComponent) },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
