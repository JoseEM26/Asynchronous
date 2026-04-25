import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';

@Component({
  selector: 'app-jefe-view',
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
        <h1 class="text-h1">Supervisión de Equipo</h1>
      </header>

      <div class="row g-4 mb-5">
        <div class="col-md-4" *ngFor="let card of statusCards">
          <div class="minimal-card h-100">
            <span class="text-label d-block mb-2">{{ card.label }}</span>
            <div class="d-flex align-items-baseline gap-2">
              <span class="text-h2">{{ card.value }}</span>
              <span class="small text-muted">{{ card.subText }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-lg-7">
          <div class="minimal-card h-100">
            <h3 class="text-h3 mb-4">Puntualidad del Equipo</h3>
            <apx-chart
              [series]="punctualityChart.series"
              [chart]="punctualityChart.chart"
              [xaxis]="punctualityChart.xaxis"
              [plotOptions]="punctualityChart.plotOptions"
              [dataLabels]="punctualityChart.dataLabels"
              [legend]="punctualityChart.legend"
              [colors]="punctualityChart.colors"
              [grid]="punctualityChart.grid"
            ></apx-chart>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="minimal-card h-100">
            <h3 class="text-h3 mb-4">Cobertura de Turnos</h3>
            <div class="coverage-list">
              <div *ngFor="let day of coverageData" class="coverage-row">
                <span class="small fw-bold text-muted" style="width: 80px;">{{ day.name }}</span>
                <div class="d-flex gap-1 flex-grow-1 mx-3">
                  <div *ngFor="let slot of day.slots" 
                       class="slot-indicator" 
                       [class.active]="slot"></div>
                </div>
                <span class="small fw-bold">{{ day.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="minimal-card p-0 overflow-hidden">
        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
          <h3 class="text-h3 mb-0" style="font-size: 1rem;">Personal Reciente</h3>
          <button class="btn-text">Ver reporte completo</button>
        </div>
        <div class="table-responsive">
          <table class="table m-0 minimal-table">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Evento</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of recentActivity">
                <td class="fw-bold">{{ row.name }}</td>
                <td>{{ row.event }}</td>
                <td>{{ row.time }}</td>
                <td><span class="m-badge" [class]="row.badgeClass">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .coverage-list { display: flex; flex-direction: column; gap: 1rem; }
    .coverage-row { display: flex; align-items: center; justify-content: space-between; }
    .slot-indicator { flex: 1; height: 8px; background: var(--border-light); border-radius: 2px; }
    .slot-indicator.active { background: var(--text-main); }
    .btn-text { background: none; border: none; font-size: 0.8rem; font-weight: 600; text-decoration: underline; cursor: pointer; }
    .minimal-table th { padding: 1rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 2px solid var(--border-light); }
    .minimal-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-light); font-size: 0.9rem; }
    .minimal-table tr:last-child td { border-bottom: none; }
    .bg-light-subtle { background: #fafafa; }
  `]
})
export class JefeViewComponent {
  @Input() roleName: string = '';
  @Input() userName: string = '';

  statusCards = [
    { label: 'Equipo', value: '24', subText: 'Personal activo' },
    { label: 'Pendientes', value: '7', subText: 'Por revisar' },
    { label: 'Asistencia', value: '19', subText: 'Ingresos hoy' }
  ];

  coverageData = [
    { name: 'Lunes', slots: [true, true, true], pct: 100 },
    { name: 'Martes', slots: [true, true, false], pct: 66 },
    { name: 'Miércoles', slots: [true, true, true], pct: 100 },
    { name: 'Jueves', slots: [true, false, true], pct: 66 },
    { name: 'Viernes', slots: [true, true, true], pct: 100 }
  ];

  recentActivity = [
    { name: 'Juan Perez', event: 'Entrada', time: '08:15', status: 'Puntual', badgeClass: 'm-badge-success' },
    { name: 'Maria Lopez', event: 'Entrada', time: '08:45', status: 'Tardanza', badgeClass: 'm-badge-warning' },
    { name: 'Carlos Ruiz', event: 'Salida', time: '17:05', status: 'Finalizado', badgeClass: 'm-badge-info' }
  ];

  public punctualityChart: any = {
    series: [
      { name: 'Puntual', data: [18, 20, 19, 21, 18] },
      { name: 'Tarde', data: [4, 2, 3, 1, 5] }
    ],
    chart: { type: 'bar', height: 350, stacked: true, toolbar: { show: false }, fontFamily: 'Inter' },
    xaxis: { categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'], axisBorder: { show: false }, axisTicks: { show: false } },
    plotOptions: { bar: { columnWidth: '30%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    legend: { position: 'top', labels: { colors: '#475569' } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    colors: ['#0f172a', '#94a3b8'],
  };
}
