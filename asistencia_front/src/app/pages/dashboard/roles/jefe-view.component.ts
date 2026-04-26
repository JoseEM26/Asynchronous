import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { PersonalService, PersonalUnificado } from '../../../services/personal.service';
import { AuthService } from '../../../services/auth.service';
import { PersonalDetailComponent } from '../../personal/personal-detail.component';

@Component({
  selector: 'app-jefe-view',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule, PersonalDetailComponent],
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
        <!-- SECCIÓN DE MI EQUIPO -->
        <div class="col-lg-12">
          <div class="minimal-card p-0 overflow-hidden">
            <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
              <h3 class="text-h3 mb-0" style="font-size: 1rem;">Mi Equipo de Terreno</h3>
              <span class="badge bg-dark rounded-pill">{{ miEquipo.length }} Integrantes</span>
            </div>
            <div class="table-responsive">
              <table class="table m-0 minimal-table">
                <thead>
                  <tr>
                    <th>Trabajador</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th class="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of miEquipo" class="team-row">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-sm">{{ p.nombres[0] }}</div>
                        <span class="fw-bold">{{ p.nombres }} {{ p.apellidos }}</span>
                      </div>
                    </td>
                    <td>{{ p.dni }}</td>
                    <td>{{ p.email }}</td>
                    <td>
                      <span class="m-badge" [class.m-badge-success]="p.activo" [class.m-badge-danger]="!p.activo">
                        {{ p.activo ? 'Vigente' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button class="btn-detail-icon" (click)="verDetalle(p)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="miEquipo.length === 0">
                    <td colspan="5" class="text-center py-4 text-muted">No tienes trabajadores asignados todavía.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ESTADÍSTICAS (OPCIONALES ABAJO) -->
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

      <app-personal-detail
        *ngIf="selectedPersonal"
        [data]="selectedPersonal"
        (close)="selectedPersonal = null"
      ></app-personal-detail>
    </div>
  `,
  styles: [`
    .coverage-list { display: flex; flex-direction: column; gap: 1rem; }
    .coverage-row { display: flex; align-items: center; justify-content: space-between; }
    .slot-indicator { flex: 1; height: 8px; background: var(--border-light); border-radius: 2px; }
    .slot-indicator.active { background: var(--text-main); }
    .minimal-table th { padding: 1rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 2px solid var(--border-light); }
    .minimal-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-light); font-size: 0.9rem; }
    .minimal-table tr:last-child td { border-bottom: none; }
    .bg-light-subtle { background: #fafafa; }
    .avatar-sm { width: 32px; height: 32px; background: var(--text-main); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; }
    .btn-detail-icon { background: none; border: none; color: var(--text-main); padding: 4px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    .btn-detail-icon:hover { background: rgba(0,0,0,0.05); transform: scale(1.1); }
    .team-row:hover { background: #fcfcfc; }
  `]
})
export class JefeViewComponent implements OnInit {
  @Input() roleName: string = '';
  @Input() userName: string = '';

  miEquipo: PersonalUnificado[] = [];
  selectedPersonal: PersonalUnificado | null = null;

  statusCards = [
    { label: 'Mi Equipo', value: '0', subText: 'Personal asignado' },
    { label: 'Modalidad', value: 'Terreno', subText: 'Área de operación' },
    { label: 'Estado', value: 'Activo', subText: 'Supervisión habilitada' }
  ];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarEquipo();
  }

  cargarEquipo() {
    const user = this.authService.currentUserValue;
    if (user && user.trabajador?.id) {
      this.personalService.getMiEquipo(user.trabajador.id).subscribe(data => {
        this.miEquipo = data;
        this.statusCards[0].value = data.length.toString();
      });
    }
  }

  verDetalle(p: PersonalUnificado) {
    this.selectedPersonal = p;
  }

  coverageData = [
    { name: 'Lunes', slots: [true, true, true], pct: 100 },
    { name: 'Martes', slots: [true, true, false], pct: 66 },
    { name: 'Miércoles', slots: [true, true, true], pct: 100 },
    { name: 'Jueves', slots: [true, false, true], pct: 66 },
    { name: 'Viernes', slots: [true, true, true], pct: 100 }
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

