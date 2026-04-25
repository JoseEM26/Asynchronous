import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { Subscription } from 'rxjs';
import { NgxApexchartsModule } from 'ngx-apexcharts';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  template: `
    <div class="container-fluid animate-in">
      <header class="mb-5">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="text-label">{{ roleName }}</span>
          <span class="text-muted">•</span>
          <span class="text-muted small">{{ userName }}</span>
        </div>
        <h1 class="text-h1">Panel Administrativo</h1>
      </header>

      <div class="row g-4 mb-5">
        <div class="col-md-3" *ngFor="let stat of quickStats">
          <div class="minimal-card h-100">
            <span class="text-label d-block mb-2">{{ stat.label }}</span>
            <div class="d-flex align-items-baseline gap-2">
              <span class="text-h2">{{ stat.value }}</span>
              <span class="small text-success" *ngIf="stat.trend">{{ stat.trend }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-lg-8">
          <div class="minimal-card h-100">
            <h3 class="text-h3 mb-4">Asistencia Semanal</h3>
            <apx-chart
              [series]="attendanceChart.series"
              [chart]="attendanceChart.chart"
              [xaxis]="attendanceChart.xaxis"
              [stroke]="attendanceChart.stroke"
              [colors]="attendanceChart.colors"
              [dataLabels]="attendanceChart.dataLabels"
              [grid]="attendanceChart.grid"
              [yaxis]="attendanceChart.yaxis"
              [theme]="attendanceChart.theme"
            ></apx-chart>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="minimal-card h-100">
            <h3 class="text-h3 mb-4 text-center">Modalidades</h3>
            <apx-chart
              [series]="modalityChart.series"
              [chart]="modalityChart.chart"
              [labels]="modalityChart.labels"
              [colors]="modalityChart.colors"
              [legend]="modalityChart.legend"
              [stroke]="modalityChart.stroke"
              [theme]="modalityChart.theme"
            ></apx-chart>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-8">
          <div class="minimal-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="text-h3">Actividad Reciente</h3>
              <span class="m-badge m-badge-danger" *ngIf="isLive">EN VIVO</span>
            </div>
            <div class="activity-list">
              <div *ngFor="let log of logs" class="activity-row">
                <div class="activity-dot"></div>
                <div class="flex-grow-1">
                  <p class="mb-0 small fw-medium">{{ log.mensaje }}</p>
                  <span class="text-muted extra-small">{{ log.creado_en | date:'HH:mm' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="minimal-card">
            <h3 class="text-h3 mb-4">Servicios</h3>
            <div class="service-row" *ngFor="let sys of systemStatus">
              <span class="small">{{ sys.name }}</span>
              <span class="m-badge m-badge-success">OPERATIVO</span>
            </div>
            <div class="mt-4 pt-4 border-top">
              <p class="text-muted small mb-0">Próximo backup programado para las 04:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .extra-small { font-size: 0.7rem; }
    .activity-list { display: flex; flex-direction: column; gap: 1rem; }
    .activity-row { display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light); }
    .activity-row:last-child { border-bottom: none; padding-bottom: 0; }
    .activity-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); margin-top: 8px; }
    .service-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); }
    .service-row:last-child { border-bottom: none; }
  `]
})
export class AdminViewComponent implements OnInit, OnDestroy {
  @Input() roleName: string = '';
  @Input() userName: string = '';
  logs: any[] = [];
  isLive = true;
  private sub?: Subscription;

  quickStats = [
    { label: 'Usuarios', value: '1,240', trend: '+12%' },
    { label: 'Asistencia Hoy', value: '86%', trend: '+4%' },
    { label: 'Sedes', value: '12', trend: null },
    { label: 'Alertas', value: '0', trend: null }
  ];

  systemStatus = [
    { name: 'API Server', status: 'Online' },
    { name: 'Database', status: 'Online' },
    { name: 'Storage', status: 'Online' }
  ];

  public attendanceChart: any = {
    series: [{ name: 'Asistencia', data: [85, 92, 88, 95, 90, 87, 91] }],
    chart: { type: 'area', height: 350, toolbar: { show: false }, fontFamily: 'Inter' },
    colors: ['#0f172a'],
    stroke: { curve: 'smooth', width: 2 },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    theme: { mode: 'light' }
  };

  public modalityChart: any = {
    series: [45, 30, 25],
    chart: { type: 'donut', height: 300, fontFamily: 'Inter' },
    labels: ['Híbrido', 'Presencial', 'Remoto'],
    colors: ['#0f172a', '#64748b', '#cbd5e1'],
    legend: { position: 'bottom', labels: { colors: '#475569' } },
    stroke: { width: 0 },
    theme: { mode: 'light' }
  };

  constructor(private supabase: SupabaseService) { }

  async ngOnInit() {
    try {
      this.logs = await this.supabase.getInitialLogs();
      this.sub = this.supabase.getActivityFeed().subscribe(newLog => {
        this.logs.unshift(newLog);
        if (this.logs.length > 30) this.logs.pop();
      });
    } catch (error) {
      console.error('Error loading admin logs:', error);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
