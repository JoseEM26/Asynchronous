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
      <header class="mb-5 d-flex justify-content-between align-items-end">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1">
            <span class="text-label">{{ roleName }}</span>
            <span class="text-muted">•</span>
            <span class="text-muted small">{{ userName }}</span>
          </div>
          <h1 class="text-h1">Panel Administrativo</h1>
        </div>
        <div class="d-flex gap-2">
           <div class="m-badge m-badge-success">SISTEMA ONLINE</div>
           <div class="m-badge m-badge-info">{{ workers.length }} TRABAJADORES</div>
        </div>
      </header>

      <!-- Live Tracking Map Section -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="minimal-card p-0 overflow-hidden position-relative" style="height: 650px; border-radius: 20px;">
            <div id="admin-map" class="h-100 w-100"></div>
            
            <!-- Map Overlay: Worker Filter & Route Info -->
            <div class="map-overlay-panel animate-in" *ngIf="showFilter">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center sticky-top" style="background: var(--bg-surface) !important;">
                <span class="text-label-bold">{{ selectedWorkerId ? 'Hoja de Ruta' : 'Personal en Línea' }}</span>
                <button class="btn-close-sm" (click)="showFilter = false">×</button>
              </div>
              
              <div class="p-3" style="overflow-y: auto; flex: 1;">
                <ng-container *ngIf="!selectedWorkerId; else workerDetails">
                  <div class="search-box mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" class="form-control-minimal" placeholder="Buscar por nombre..." (input)="filterWorkers($event)">
                  </div>
                  
                  <div class="worker-list custom-scroll">
                    <div *ngFor="let worker of filteredWorkers" 
                         class="worker-card-mini animate-in" 
                         (click)="focusWorker(worker)">
                      <div class="worker-avatar-mini">{{ worker.name[0] }}</div>
                      <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                          <span class="fw-bold small-title">{{ worker.name }}</span>
                          <div class="status-indicator" [class]="worker.status.toLowerCase()"></div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                          <span class="text-muted extra-small">{{ worker.role }}</span>
                          <span class="text-primary extra-small fw-bold">{{ worker.lastScan }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-container>

                <ng-template #workerDetails>
                  <div class="selected-worker-info animate-in" *ngIf="getSelectedWorker() as sw">
                    <div class="d-flex align-items-center gap-3 mb-4 p-3 bg-dark text-white rounded-4 shadow-sm">
                       <div class="avatar-sm-circle">{{ sw.name[0] }}</div>
                       <div>
                         <p class="mb-0 fw-bold fs-6">{{ sw.name }}</p>
                         <span class="text-white-50 extra-small">{{ sw.role }}</span>
                       </div>
                    </div>

                    <!-- Enhanced Start/End Cards -->
                    <div class="row g-2 mb-4">
                       <div class="col-6">
                          <div class="summary-card-v2 start">
                             <span class="text-label-xs">Primer Escaneo</span>
                             <p class="mb-0 small-time-v2">{{ sw.history[0].time }}</p>
                             <span class="text-muted truncate-text">{{ sw.history[0].location }}</span>
                          </div>
                       </div>
                       <div class="col-6">
                          <div class="summary-card-v2 end">
                             <span class="text-label-xs">Último Punto</span>
                             <p class="mb-0 small-time-v2">{{ sw.lastScan }}</p>
                             <span class="text-muted truncate-text">{{ sw.history[sw.history.length-1].location }}</span>
                          </div>
                       </div>
                    </div>

                    <div class="timeline-header d-flex justify-content-between align-items-center mb-3 px-1">
                       <span class="text-label-bold">Bitácora del Día</span>
                       <span class="m-badge m-badge-info" style="font-size: 0.6rem;">{{ sw.history.length }} Puntos</span>
                    </div>

                    <div class="history-timeline-v2 custom-scroll px-1">
                       <div *ngFor="let p of sw.history; let first = first; let last = last" class="timeline-step-v2" [class.last]="last">
                          <div class="timeline-marker-v2" [class.is-start]="first" [class.is-end]="last"></div>
                          <div class="timeline-content-v2">
                             <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold extra-small text-dark">{{ p.time }}</span>
                                <span class="badge-type" [class]="p.type.toLowerCase()">{{ p.type }}</span>
                             </div>
                             <p class="mb-0 small text-muted lh-sm">{{ p.location }}</p>
                          </div>
                       </div>
                    </div>

                    <button class="btn-back-list w-100 mt-4" (click)="resetMap()">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="me-2"><path d="m15 18-6-6 6-6"/></svg>
                      Volver al listado
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Toggle Filter Button -->
            <button class="btn-map-toggle-v2 shadow-sm" *ngIf="!showFilter" (click)="showFilter = true">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               {{ selectedWorkerId ? 'Ver Detalles' : 'Filtrar Personal' }}
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

      <div class="row g-4">
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
    .extra-small { font-size: 0.65rem; }
    .small-title { font-size: 0.85rem; letter-spacing: -0.2px; }
    .truncate-text { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.6rem; opacity: 0.7; }
    .text-label-bold { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-main); }
    
    .map-overlay-panel {
      position: absolute; top: 20px; right: 20px; width: 350px; z-index: 1000;
      background: var(--bg-surface) !important; backdrop-filter: blur(12px);
      border-radius: 20px; border: 1px solid var(--glass-border); box-shadow: var(--shadow-lg);
      max-height: 610px; display: flex; flex-direction: column; overflow: hidden;
    }
    
    .search-box { position: relative; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
    .form-control-minimal { width: 100%; padding: 10px 10px 10px 38px; border-radius: 12px; border: 1.5px solid var(--glass-border); background: var(--bg-deep); color: var(--text-main); font-size: 0.85rem; outline: none; transition: 0.2s; }
    .form-control-minimal:focus { border-color: var(--text-main); background: var(--bg-surface); }

    .worker-list { max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .worker-card-mini { 
      display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; 
      background: var(--bg-deep) !important; border: 1.5px solid var(--glass-border); cursor: pointer; transition: 0.2s;
    }
    .worker-card-mini:hover { border-color: var(--text-main); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
    .worker-avatar-mini { width: 38px; height: 38px; background: var(--bg-surface); color: var(--text-main); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid var(--glass-border); }
    
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; }
    .status-indicator.puntual { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
    .status-indicator.tardanza { background: #f59e0b; }

    .summary-card-v2 { padding: 14px; border-radius: 16px; border: 1px solid transparent; }
    .summary-card-v2.start { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: #10b981; }
    .summary-card-v2.end { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .small-time-v2 { font-size: 1.25rem; font-weight: 900; letter-spacing: -0.5px; }

    .history-timeline-v2 { max-height: 240px; overflow-y: auto; }
    .timeline-step-v2 { display: flex; gap: 16px; padding-bottom: 24px; position: relative; }
    .timeline-step-v2:not(.last)::before { content: ''; position: absolute; left: 7px; top: 18px; bottom: 0; width: 2px; background: var(--glass-border); }
    .timeline-marker-v2 { width: 16px; height: 16px; border-radius: 50%; background: var(--bg-deep); border: 3px solid var(--bg-surface); flex-shrink: 0; z-index: 1; }
    .timeline-marker-v2.is-start { background: #10b981; }
    .timeline-marker-v2.is-end { background: #ef4444; }
    
    .badge-type { font-size: 0.55rem; padding: 2px 6px; border-radius: 4px; font-weight: 800; text-transform: uppercase; }
    .badge-type.entrada { background: #dcfce7; color: #166534; }
    .badge-type.visita { background: #f1f5f9; color: #475569; }

    .avatar-sm-circle { width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid rgba(255,255,255,0.3); }
    .btn-back-list { background: var(--bg-deep); color: var(--text-main); border: 1.5px solid var(--glass-border); padding: 14px; border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
    .btn-back-list:hover { background: var(--text-main); color: var(--bg-surface); transform: translateY(-2px); }
    
    .btn-close-sm { background: transparent; border: none; font-size: 1.5rem; line-height: 1; color: var(--text-muted); cursor: pointer; transition: 0.2s; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
    .btn-close-sm:hover { background: var(--bg-deep); color: var(--text-main); }

    .btn-map-toggle-v2 {
      position: absolute; top: 20px; right: 20px; z-index: 1000;
      background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--glass-border); padding: 12px 24px;
      border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; box-shadow: var(--shadow-lg);
    }
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
      history: [{ lat: -12.0550, lng: -77.0350, time: '08:45', location: 'Centro Distribución Sur', type: 'Entrada' }]
    },
    { 
      id: 3, name: 'Carlos Ruiz', role: 'Seguridad', lat: -12.0620, lng: -77.0310, lastScan: '16:10', status: 'Puntual',
      history: [
        { lat: -12.0620, lng: -77.0310, time: '07:30', location: 'Puerta Principal', type: 'Entrada' },
        { lat: -12.0650, lng: -77.0350, time: '12:00', location: 'Ronda Perimetral', type: 'Visita' }
      ]
    },
    { 
      id: 4, name: 'Ana Gomez', role: 'Supervisor', lat: -12.0400, lng: -77.0500, lastScan: '15:30', status: 'Puntual',
      history: [{ lat: -12.0400, lng: -77.0500, time: '08:15', location: 'Oficinas Administrativas', type: 'Entrada' }]
    }
  ];
  filteredWorkers: WorkerLocation[] = [...this.workers];

  quickStats = [
    { label: 'Colaboradores', value: '482', trend: '+5' },
    { label: 'Escaneos Hoy', value: '724', trend: '+12%' },
    { label: 'Asistencia', value: '94%', trend: '+2%' },
    { label: 'Sedes Activas', value: '6', trend: null }
  ];

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
    this.markers.clear();
  }

  focusWorker(worker: WorkerLocation) {
    this.selectedWorkerId = worker.id;
    this.clearMapLayers();

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
    
    // Auto zoom to fit all markers of the worker
    const group = L.featureGroup(workerMarkers);
    this.map?.flyToBounds(group.getBounds(), { padding: [100, 100], duration: 1.5 });
  }

  resetMap() {
    this.selectedWorkerId = null;
    this.renderAllMarkers();
    this.map?.setView([-12.0463, -77.0427], 13);
  }

  getSelectedWorker() { return this.workers.find(w => w.id === this.selectedWorkerId); }
  filterWorkers(event: any) { this.filteredWorkers = this.workers.filter(w => w.name.toLowerCase().includes(event.target.value.toLowerCase())); }
  ngOnDestroy() { this.sub?.unsubscribe(); this.map?.remove(); }
}
