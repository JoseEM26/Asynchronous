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
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'asistencia-qr', loadComponent: () => import('./pages/public-qr/public-qr.component').then(m => m.PublicQrComponent) },
  {
    path: '',
    component: AsynchronousLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent) },
      { 
        path: 'personal', 
        loadComponent: () => import('./pages/personal/personal-list.component').then(m => m.PersonalListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
      },
      { 
        path: 'asistencias', 
        component: AsistenciasListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN', 'JEFE_TERRENO', 'TRABAJADOR_TERRENO', 'TRABAJADOR'] }
      },
      { 
        path: 'qr-generator', 
        component: QrAsistenciaComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
      },
      { 
        path: 'comunicados', 
        loadComponent: () => import('./pages/comunicados/comunicados-management.component').then(m => m.ComunicadosManagementComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
      },
      { 
        path: 'configuracion', 
        component: ConfiguracionComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
