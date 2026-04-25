import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { Subscription } from 'rxjs';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import * as L from 'leaflet';

interface ScanPoint {
  lat: number;
  lng: number;
  time: string;
  location: string;
  type: 'Entrada' | 'Visita' | 'Salida';
}

interface WorkerLocation {
  id: number;
  name: string;
  role: string;
  lat: number;
  lng: number;
  lastScan: string;
  status: 'Puntual' | 'Tardanza' | 'Ausente';
  history: ScanPoint[];
}

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

      <!-- Live Tracking Map Section -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="minimal-card p-0 overflow-hidden position-relative" style="height: 600px;">
            <div id="admin-map" class="h-100 w-100"></div>
            
            <!-- Map Overlay: Worker Filter & Route Info -->
            <div class="map-overlay-panel animate-in" *ngIf="showFilter">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
                <span class="text-label">{{ selectedWorkerId ? 'Hoja de Ruta' : 'Rastreo en Vivo' }}</span>
                <button class="btn-close-sm" (click)="showFilter = false">×</button>
              </div>
              
              <div class="p-3">
                <ng-container *ngIf="!selectedWorkerId; else workerDetails">
                  <input type="text" class="form-control-minimal mb-3" placeholder="Buscar trabajador..." (input)="filterWorkers($event)">
                  <div class="worker-list custom-scroll">
                    <div *ngFor="let worker of filteredWorkers" 
                         class="worker-item" 
                         (click)="focusWorker(worker)">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold small">{{ worker.name }}</span>
                        <span class="m-badge" [class]="getBadgeClass(worker.status)">{{ worker.status }}</span>
                      </div>
                      <span class="text-muted extra-small">Última: {{ worker.lastScan }} • {{ worker.role }}</span>
                    </div>
                  </div>
                </ng-container>

                <ng-template #workerDetails>
                  <div class="selected-worker-info animate-in" *ngIf="getSelectedWorker() as sw">
                    <div class="d-flex align-items-center gap-3 mb-4 p-2 bg-light rounded-3">
                       <div class="avatar-sm shadow-sm">{{ sw.name[0] }}</div>
                       <div>
                         <p class="mb-0 fw-bold">{{ sw.name }}</p>
                         <span class="m-badge m-badge-info" style="font-size: 0.6rem;">{{ sw.role }}</span>
                       </div>
                    </div>

                    <!-- Enhanced Start/End Cards -->
                    <div class="row g-2 mb-4">
                       <div class="col-6">
                          <div class="summary-card start">
                             <div class="card-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></div>
                             <span class="text-label-xs">Inicio</span>
                             <p class="mb-0 small-time">{{ sw.history[0].time }}</p>
                             <span class="text-muted truncate-text">{{ sw.history[0].location }}</span>
                          </div>
                       </div>
                       <div class="col-6">
                          <div class="summary-card end">
                             <div class="card-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                             <span class="text-label-xs">Actual</span>
                             <p class="mb-0 small-time">{{ sw.lastScan }}</p>
                             <span class="text-muted truncate-text">{{ sw.history[sw.history.length-1].location }}</span>
                          </div>
                       </div>
                    </div>

                    <div class="route-metadata mb-4 px-2">
                       <div class="d-flex justify-content-between mb-1">
                          <span class="text-muted small">Puntos registrados</span>
                          <span class="fw-bold small">{{ sw.history.length }}</span>
                       </div>
                       <div class="d-flex justify-content-between">
                          <span class="text-muted small">Estado actual</span>
                          <span class="m-badge m-badge-success">Activo</span>
                       </div>
                    </div>

                    <span class="text-label mb-2 d-block px-2">Línea de Tiempo</span>
                    <div class="history-timeline custom-scroll px-2">
                       <div *ngFor="let p of sw.history; let first = first; let last = last" class="timeline-step" [class.last]="last">
                          <div class="timeline-marker" [class.is-start]="first" [class.is-end]="last"></div>
                          <div class="timeline-content">
                             <div class="d-flex justify-content-between">
                                <span class="fw-bold extra-small">{{ p.time }}</span>
                                <span class="text-muted extra-small">{{ p.type }}</span>
                             </div>
                             <p class="mb-0 small text-secondary">{{ p.location }}</p>
                          </div>
                       </div>
                    </div>

                    <button class="btn-minimal-outline w-100 mt-4" (click)="resetMap()">
                      ← Volver al listado
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Toggle Filter Button -->
            <button class="btn-map-toggle shadow-minimal" *ngIf="!showFilter" (click)="showFilter = true">
               🔍 {{ selectedWorkerId ? 'Ver Hoja de Ruta' : 'Filtrar Personal' }}
            </button>
          </div>
        </div>
      </div>

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
              [grid]="attendanceChart.grid"
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
            ></apx-chart>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .extra-small { font-size: 0.7rem; }
    .truncate-text { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.6rem; }
    
    /* Map Overlay Styles */
    .map-overlay-panel {
      position: absolute; top: 20px; right: 20px; width: 340px; z-index: 1000;
      background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px);
      border-radius: 16px; border: 1px solid var(--border-light); box-shadow: 0 20px 40px rgba(0,0,0,0.12);
      max-height: 560px; display: flex; flex-direction: column;
    }
    .worker-list, .history-timeline { max-height: 280px; overflow-y: auto; }
    
    .summary-card { padding: 12px; border-radius: 12px; border: 1px solid var(--border-light); position: relative; }
    .summary-card.start { background: #f0fdf4; border-color: #dcfce7; }
    .summary-card.end { background: #fef2f2; border-color: #fee2e2; }
    .card-icon { position: absolute; top: 10px; right: 10px; opacity: 0.5; }
    .text-label-xs { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6; color: inherit; }
    .small-time { font-size: 1.1rem; font-weight: 800; color: var(--text-main); }

    .timeline-step { display: flex; gap: 15px; padding-bottom: 20px; position: relative; }
    .timeline-step:not(.last)::before { content: ''; position: absolute; left: 6px; top: 15px; bottom: 0; width: 2px; background: #f1f5f9; }
    .timeline-marker { width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; border: 3px solid white; flex-shrink: 0; z-index: 1; }
    .timeline-marker.is-start { background: #10b981; }
    .timeline-marker.is-end { background: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
    .timeline-content { flex-grow: 1; }

    .avatar-sm { width: 44px; height: 44px; background: var(--text-main); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
    .btn-minimal-outline { background: #fff; border: 1px solid var(--border-light); padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
    .btn-minimal-outline:hover { background: #f8fafc; border-color: var(--text-main); }
  `]
})
export class AdminViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() roleName: string = '';
  @Input() userName: string = '';
  logs: any[] = [];
  isLive = true;
  showFilter = true;
  selectedWorkerId: number | null = null;
  private sub?: Subscription;
  private map?: L.Map;
  private markers: Map<number, L.Marker[]> = new Map();
  private polylines: Map<number, L.Polyline> = new Map();

  workers: WorkerLocation[] = [
    { 
      id: 1, name: 'Juan Perez', role: 'Trabajador', lat: -12.0463, lng: -77.0427, lastScan: '14:20', status: 'Puntual',
      history: [
        { lat: -12.0463, lng: -77.0427, time: '08:00', location: 'Sede Central (Oficina)', type: 'Entrada' },
        { lat: -12.0500, lng: -77.0400, time: '10:30', location: 'Almacén Sector Norte', type: 'Visita' },
        { lat: -12.0450, lng: -77.0350, time: '14:20', location: 'Planta Industrial 2', type: 'Visita' }
      ]
    },
    { 
      id: 2, name: 'Maria Lopez', role: 'Terreno', lat: -12.0550, lng: -77.0350, lastScan: '08:45', status: 'Tardanza',
      history: [
        { lat: -12.0550, lng: -77.0350, time: '08:45', location: 'Centro Distribución Sur', type: 'Entrada' }
      ]
    }
  ];
  filteredWorkers: WorkerLocation[] = [...this.workers];

  quickStats = [{ label: 'Usuarios', value: '1,240', trend: '+12%' }, { label: 'Asistencia Hoy', value: '86%', trend: '+4%' }, { label: 'Sedes', value: '12', trend: null }, { label: 'Alertas', value: '0', trend: null }];

  public attendanceChart: any = {
    series: [{ name: 'Asistencia', data: [85, 92, 88, 95, 90, 87, 91] }],
    chart: { type: 'area', height: 280, toolbar: { show: false }, fontFamily: 'Inter' },
    colors: ['#0f172a'],
    stroke: { curve: 'smooth', width: 2 },
    grid: { borderColor: '#f1f5f9' },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'] }
  };

  public modalityChart: any = {
    series: [45, 30, 25],
    chart: { type: 'donut', height: 280, fontFamily: 'Inter' },
    labels: ['Híbrido', 'Presencial', 'Remoto'],
    colors: ['#0f172a', '#64748b', '#cbd5e1'],
    legend: { position: 'bottom' },
    stroke: { width: 0 }
  };

  constructor(private supabase: SupabaseService) { }

  ngOnInit() { this.loadLogs(); }

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => this.map?.invalidateSize(), 1000);
    window.addEventListener('resize', () => this.map?.invalidateSize());
  }

  private async loadLogs() {
    try {
      this.logs = await this.supabase.getInitialLogs();
      this.sub = this.supabase.getActivityFeed().subscribe(newLog => {
        this.logs.unshift(newLog);
        if (this.logs.length > 30) this.logs.pop();
      });
    } catch (error) {}
  }

  private initMap() {
    this.map = L.map('admin-map', { zoomControl: false }).setView([-12.0463, -77.0427], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' }).addTo(this.map);
    this.renderAllMarkers();
  }

  private renderAllMarkers() {
    this.clearMapLayers();
    this.workers.forEach(worker => {
      const lastPoint = worker.history[worker.history.length - 1];
      const marker = L.marker([lastPoint.lat, lastPoint.lng], {
        icon: L.divIcon({
          className: 'current-loc-marker',
          html: `<div class="pulse-dot"></div>`,
          iconSize: [20, 20]
        })
      }).bindTooltip(`<b>${worker.name}</b>`, { direction: 'top' });
      marker.addTo(this.map!);
      this.markers.set(worker.id, [marker]);
    });
  }

  private clearMapLayers() {
    this.markers.forEach(ms => ms.forEach(m => this.map?.removeLayer(m)));
    this.polylines.forEach(p => this.map?.removeLayer(p));
    this.markers.clear();
    this.polylines.clear();
  }

  focusWorker(worker: WorkerLocation) {
    this.selectedWorkerId = worker.id;
    this.clearMapLayers();

    const points = worker.history.map(p => L.latLng(p.lat, p.lng));
    const polyline = L.polyline(points, { color: '#0f172a', weight: 4, dashArray: '8, 12', opacity: 0.5 }).addTo(this.map!);
    this.polylines.set(worker.id, polyline);

    const workerMarkers: L.Marker[] = [];
    worker.history.forEach((p, index) => {
      const isFirst = index === 0;
      const isLast = index === worker.history.length - 1;
      
      const iconHtml = isFirst 
        ? `<div class="marker-base start"></div>`
        : isLast 
        ? `<div class="marker-base end"><div class="pulse"></div></div>`
        : `<div class="marker-base step"></div>`;

      const marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({ className: 'custom-route-marker', html: iconHtml, iconSize: [20, 20] })
      }).bindTooltip(`<b>${p.time}</b>: ${p.location}`, { direction: 'top' });
      
      marker.addTo(this.map!);
      workerMarkers.push(marker);
    });

    this.markers.set(worker.id, workerMarkers);
    this.map?.flyToBounds(polyline.getBounds(), { padding: [80, 80], duration: 1.5 });
  }

  resetMap() {
    this.selectedWorkerId = null;
    this.renderAllMarkers();
    this.map?.setView([-12.0463, -77.0427], 13);
  }

  getSelectedWorker() { return this.workers.find(w => w.id === this.selectedWorkerId); }
  filterWorkers(event: any) { this.filteredWorkers = this.workers.filter(w => w.name.toLowerCase().includes(event.target.value.toLowerCase())); }
  getBadgeClass(s: string) { return s === 'Puntual' ? 'm-badge-success' : s === 'Tardanza' ? 'm-badge-warning' : 'm-badge-danger'; }
  ngOnDestroy() { this.sub?.unsubscribe(); this.map?.remove(); }
}
