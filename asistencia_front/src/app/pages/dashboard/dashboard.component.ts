import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid animate-fade">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="display-4 fw-bold">Dashboard</h1>
          <p class="text-secondary">Información en tiempo real del sistema Asynchronous.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Stat Cards -->
        <div class="col-md-4">
          <div class="glass-card p-4 h-100 border-start border-primary border-4">
            <h5 class="text-secondary fw-normal">Total Trabajadores</h5>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="display-5 fw-bold text-white">124</span>
              <span class="fs-1">👥</span>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="glass-card p-4 h-100 border-start border-info border-4">
            <h5 class="text-secondary fw-normal">Asistencias Hoy</h5>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="display-5 fw-bold text-white">86</span>
              <span class="fs-1">📅</span>
            </div>
          </div>
        </div>

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
        <!-- Muro de Actividad Live (Supabase) -->
        <div class="col-md-8">
          <div class="glass-card p-4">
            <h3 class="fw-bold mb-4 d-flex align-items-center">
              <span class="me-2">📡</span> Actividad en Vivo (Supabase)
              <span class="badge bg-danger ms-auto pulse-red" *ngIf="isLive">LIVE</span>
            </h3>
            <div class="activity-feed custom-scroll">
              <div *ngFor="let log of logs" class="activity-item animate-slide-in">
                <div class="d-flex align-items-start mb-3 p-3 rounded bg-dark-soft">
                  <div class="activity-icon me-3">🔔</div>
                  <div>
                    <p class="mb-0 text-white">{{ log.mensaje }}</p>
                    <small class="text-secondary">{{ log.creado_en | date:'short' }}</small>
                  </div>
                </div>
              </div>
              <div *ngIf="logs.length === 0" class="text-center py-5 text-secondary">
                Esperando actividad...
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="glass-card p-4 h-100">
            <h3 class="fw-bold mb-3">Estado</h3>
            <div class="text-center py-4">
               <div class="progress bg-dark mb-3" style="height: 10px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 75%"></div>
              </div>
              <p class="text-secondary">Servidor Railway: <span class="text-success">Online</span></p>
              <p class="text-secondary">Supabase Realtime: <span class="text-success">Conectado</span></p>
            </div>
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
    .activity-feed {
      max-height: 400px;
      overflow-y: auto;
      padding-right: 10px;
    }
    .bg-dark-soft {
      background: rgba(255,255,255,0.05);
      transition: all 0.3s ease;
    }
    .bg-dark-soft:hover {
      background: rgba(255,255,255,0.1);
      transform: translateX(5px);
    }
    .pulse-red {
      animation: pulse 2s infinite;
      font-size: 0.6rem;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  logs: any[] = [];
  isLive = true;
  private sub?: Subscription;

  constructor(private supabase: SupabaseService) { }

  async ngOnInit() {
    // Cargar logs iniciales
    this.logs = await this.supabase.getInitialLogs();
    
    // Suscribirse a cambios en tiempo real
    this.sub = this.supabase.getActivityFeed().subscribe(newLog => {
      this.logs.unshift(newLog);
      if (this.logs.length > 20) this.logs.pop();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
