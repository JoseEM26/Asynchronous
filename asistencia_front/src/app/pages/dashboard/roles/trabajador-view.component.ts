import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';

@Component({
  selector: 'app-trabajador-view',
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
        <h1 class="text-h1">Mi Actividad</h1>
      </header>

      <div class="row g-4 mb-5">
        <div class="col-lg-4">
          <div class="minimal-card h-100 text-center d-flex flex-column align-items-center justify-content-center">
             <span class="text-label mb-4">Jornada de Hoy</span>
             <apx-chart
              [series]="goalChart.series"
              [chart]="goalChart.chart"
              [plotOptions]="goalChart.plotOptions"
              [labels]="goalChart.labels"
              [colors]="goalChart.colors"
            ></apx-chart>
            <div class="mt-2">
              <span class="text-h2">6.5 <small class="text-muted fs-6">/ 8h</small></span>
              <p class="text-muted small mb-0">90% completado</p>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="row g-4 h-100">
            <div class="col-md-6">
               <div class="minimal-card h-100">
                  <div class="d-flex justify-content-between align-items-start mb-4">
                    <span class="text-label">Horas Semanales</span>
                    <span class="m-badge m-badge-success">+2.4h</span>
                  </div>
                  <h2 class="text-h2 mb-4">38.5h</h2>
                  <apx-chart
                    [series]="sparklineChart.series"
                    [chart]="sparklineChart.chart"
                    [stroke]="sparklineChart.stroke"
                    [tooltip]="sparklineChart.tooltip"
                    [colors]="sparklineChart.colors"
                  ></apx-chart>
               </div>
            </div>
            
            <div class="col-md-6">
              <div class="minimal-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <span class="text-label mb-3 d-block">Estado de Sesión</span>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <div class="status-dot-minimal" [class.active]="isPresent"></div>
                    <span class="text-h3">{{ isPresent ? 'En Planta' : 'Fuera' }}</span>
                  </div>
                  <p class="text-muted small">Ingreso registrado: 08:32 AM</p>
                </div>
                
                <button class="btn-action" [class.btn-danger]="isPresent" (click)="isPresent = !isPresent">
                  {{ isPresent ? 'Marcar Salida' : 'Marcar Ingreso' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="minimal-card">
        <h3 class="text-h3 mb-4">Historial Reciente</h3>
        <div class="m-timeline">
           <div *ngFor="let item of history" class="m-timeline-item">
              <div class="m-timeline-date">
                 <span class="fw-bold">{{ item.day }}</span>
                 <span class="text-muted extra-small">{{ item.date }}</span>
              </div>
              <div class="m-timeline-content">
                 <div class="d-flex justify-content-between">
                    <div>
                       <p class="mb-0 fw-bold small">{{ item.mode }}</p>
                       <span class="text-muted extra-small">{{ item.hours }}h acumuladas</span>
                    </div>
                    <div class="text-end">
                       <p class="mb-0 small fw-bold">{{ item.entry }} - {{ item.exit }}</p>
                       <span class="m-badge m-badge-success">{{ item.status }}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-dot-minimal { width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted); }
    .status-dot-minimal.active { background: var(--accent-success); }
    .btn-action { width: 100%; padding: 1rem; border-radius: 4px; border: none; background: var(--text-main); color: white; font-weight: 700; cursor: pointer; transition: var(--transition); }
    .btn-action:hover { opacity: 0.9; }
    .btn-action.btn-danger { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .btn-action.btn-danger:hover { background: #fee2e2; }
    
    .m-timeline { position: relative; }
    .m-timeline-item { display: flex; gap: 2rem; padding-bottom: 2rem; position: relative; }
    .m-timeline-item:last-child { padding-bottom: 0; }
    .m-timeline-item::before { content: ''; position: absolute; left: 90px; top: 0; bottom: 0; width: 1px; background: var(--border-light); }
    .m-timeline-item:last-child::before { display: none; }
    .m-timeline-date { width: 80px; flex-shrink: 0; display: flex; flex-direction: column; }
    .m-timeline-content { flex-grow: 1; padding: 1rem; background: #fafafa; border-radius: 4px; border: 1px solid var(--border-light); }
    .extra-small { font-size: 0.7rem; }
  `]
})
export class TrabajadorViewComponent {
  @Input() roleName: string = '';
  @Input() userName: string = '';
  isPresent = true;

  history = [
    { day: 'Lun', date: '21 Abr', mode: 'Presencial', hours: '8.2', entry: '08:00', exit: '17:15', status: 'Puntual' },
    { day: 'Mar', date: '22 Abr', mode: 'Remoto', hours: '7.8', entry: '08:05', exit: '16:50', status: 'Puntual' },
    { day: 'Mie', date: '23 Abr', mode: 'Presencial', hours: '8.5', entry: '08:30', exit: '18:00', status: 'Puntual' }
  ];

  public goalChart: any = {
    series: [76],
    chart: { height: 250, type: 'radialBar', fontFamily: 'Inter' },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        dataLabels: {
          name: { show: false },
          value: { fontSize: '24px', fontWeight: '800', color: '#0f172a', offsetY: 10 }
        }
      }
    },
    colors: ['#0f172a'],
    labels: ['Meta'],
  };

  public sparklineChart: any = {
    series: [{ name: 'Horas', data: [8.2, 7.8, 8.5, 4.0, 0, 0, 0] }],
    chart: { type: 'area', height: 80, sparkline: { enabled: true }, fontFamily: 'Inter' },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#0f172a']
  };
}
