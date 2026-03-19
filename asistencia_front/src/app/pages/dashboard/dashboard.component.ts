import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="container-fluid animate-fade">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="display-4 fw-bold">Dashboard</h1>
          <p class="text-secondary">Información en tiempo real del sistema Asynchronous.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Stat Card 1 -->
        <div class="col-md-4">
          <div class="glass-card p-4 h-100 border-start border-primary border-4">
            <h5 class="text-secondary fw-normal">Total Trabajadores</h5>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="display-5 fw-bold text-white">124</span>
              <span class="fs-1">👥</span>
            </div>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="col-md-4">
          <div class="glass-card p-4 h-100 border-start border-info border-4">
            <h5 class="text-secondary fw-normal">Asistencias Hoy</h5>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="display-5 fw-bold text-white">86</span>
              <span class="fs-1">📅</span>
            </div>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="col-md-4">
          <div class="glass-card p-4 h-100 border-start border-warning border-4">
            <h5 class="text-secondary fw-normal">Incidencias</h5>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="display-5 fw-bold text-white">4</span>
              <span class="fs-1">⚡</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="glass-card p-5 text-center">
            <h2 class="fw-bold mb-3">Estado del Servidor</h2>
            <div class="progress bg-dark" style="height: 10px;">
              <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 75%"></div>
            </div>
            <p class="mt-3 text-secondary">Carga del sistema al 75%. Operando normalmente.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      background: var(--grad-main);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .border-primary { border-color: var(--accent-primary) !important; }
    .border-info { border-color: var(--accent-secondary) !important; }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(private notify: NotificationService) { }

  ngOnInit(): void {
    // this.notify.success('Bienvenido de nuevo, Administrador');
  }
}
