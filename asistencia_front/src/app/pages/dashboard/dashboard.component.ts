import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AdminViewComponent } from './roles/admin-view.component';
import { JefeViewComponent } from './roles/jefe-view.component';
import { TrabajadorViewComponent } from './roles/trabajador-view.component';
import { TerrenoViewComponent } from './roles/terreno-view.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminViewComponent,
    JefeViewComponent,
    TrabajadorViewComponent,
    TerrenoViewComponent
  ],
  template: `
    <ng-container *ngIf="userData$ | async as data">
      <div class="dashboard-container animate-in">
        @switch (data.role?.toUpperCase()) {
          @case ('ADMIN') {
            <app-admin-view [roleName]="data.role || ''" [userName]="data.name || ''"></app-admin-view>
          }
          @case ('SUPER_ADMIN') {
            <app-admin-view [roleName]="data.role || ''" [userName]="data.name || ''"></app-admin-view>
          }
          @case ('JEFE_TERRENO') {
            <app-jefe-view [roleName]="data.role || ''" [userName]="data.name || ''"></app-jefe-view>
          }
          @case ('TRABAJADOR') {
            <app-trabajador-view [roleName]="data.role || ''" [userName]="data.name || ''"></app-trabajador-view>
          }
          @case ('TRABAJADOR_TERRENO') {
            <app-terreno-view [roleName]="data.role || ''" [userName]="data.name || ''"></app-terreno-view>
          }
          @default {
            <div class="restriction-screen">
               <div class="minimal-card text-center py-5">
                  <h2 class="text-h2 mb-2">Acceso Restringido</h2>
                  <p class="text-secondary mb-4">Tu rol ({{ data.role || 'No definido' }}) no tiene un panel asignado.</p>
                  <button class="btn-minimal" (click)="logout()">Cerrar Sesión</button>
               </div>
            </div>
          }
        }
      </div>
    </ng-container>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem 0;
      min-height: calc(100vh - 120px);
    }
    .restriction-screen {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
    }
    .btn-minimal {
      background: var(--text-main);
      color: var(--bg-card);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }
    .btn-minimal:hover {
      opacity: 0.9;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userData$: Observable<{ role?: string, name?: string } | undefined>;

  constructor(private authService: AuthService) {
    this.userData$ = this.authService.currentUser$.pipe(
      map(user => ({
        role: user?.rol?.nombre?.toUpperCase(),
        name: user?.username
      }))
    );
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}
