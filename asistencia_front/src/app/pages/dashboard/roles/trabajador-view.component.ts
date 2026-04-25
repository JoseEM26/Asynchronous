import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import * as L from 'leaflet';

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
        <div class="col-lg-6">
          <div class="minimal-card h-100 p-0 overflow-hidden position-relative" style="min-height: 400px;">
            <div id="worker-map" class="h-100 w-100"></div>
            <div class="map-tag">Ubicación en Tiempo Real</div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="row g-4 h-100">
            <div class="col-12">
              <div class="minimal-card d-flex flex-column justify-content-between">
                <div>
                  <span class="text-label mb-3 d-block">Estado de Sesión</span>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <div class="status-dot-minimal" [class.active]="isPresent"></div>
                    <span class="text-h3">{{ isPresent ? 'En Planta' : 'Fuera' }}</span>
                  </div>
                  <p class="text-muted small">Ingreso registrado: 08:32 AM</p>
                </div>
                <div class="mt-4">
                  <button class="btn-action" [class.btn-danger]="isPresent" (click)="isPresent = !isPresent">
                    {{ isPresent ? 'Marcar Salida' : 'Marcar Ingreso' }}
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12">
               <div class="minimal-card">
                  <div class="d-flex justify-content-between align-items-start mb-4">
                    <span class="text-label">Progreso del Día</span>
                    <span class="text-h2">6.5 <small class="text-muted fs-6">/ 8h</small></span>
                  </div>
                  <div class="progress-minimal">
                    <div class="progress-minimal-bar" style="width: 80%"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-6">
          <div class="minimal-card">
            <h3 class="text-h3 mb-4">Horas Semanales</h3>
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
          <div class="minimal-card h-100">
            <h3 class="text-h3 mb-4">Historial</h3>
            <div class="m-timeline">
               <div *ngFor="let item of history" class="m-timeline-item">
                  <div class="m-timeline-date">
                     <span class="fw-bold">{{ item.day }}</span>
                     <span class="text-muted extra-small">{{ item.date }}</span>
                  </div>
                  <div class="m-timeline-content">
                     <div class="d-flex justify-content-between align-items-center">
                        <span class="small fw-bold">{{ item.mode }}</span>
                        <span class="m-badge m-badge-success">{{ item.status }}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-tag {
      position: absolute; top: 10px; left: 10px; z-index: 1000;
      background: white; padding: 4px 12px; border-radius: 4px;
      font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
      box-shadow: var(--shadow-minimal); border: 1px solid var(--border-light);
    }
    .status-dot-minimal { width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted); }
    .status-dot-minimal.active { background: var(--accent-success); }
    .btn-action { width: 100%; padding: 1rem; border-radius: 4px; border: none; background: var(--text-main); color: white; font-weight: 700; cursor: pointer; transition: var(--transition-fast); }
    .btn-action:hover { opacity: 0.9; }
    .btn-action.btn-danger { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    
    .progress-minimal { height: 6px; background: var(--border-light); border-radius: 10px; overflow: hidden; }
    .progress-minimal-bar { height: 100%; background: var(--text-main); border-radius: 10px; }

    .m-timeline { position: relative; }
    .m-timeline-item { display: flex; gap: 1.5rem; padding-bottom: 1rem; position: relative; }
    .m-timeline-item::before { content: ''; position: absolute; left: 45px; top: 0; bottom: 0; width: 1px; background: var(--border-light); }
    .m-timeline-item:last-child::before { display: none; }
    .m-timeline-date { width: 40px; flex-shrink: 0; display: flex; flex-direction: column; }
    .m-timeline-content { flex-grow: 1; padding: 0.75rem; background: #fafafa; border-radius: 4px; border: 1px solid var(--border-light); }
    .extra-small { font-size: 0.7rem; }
  `]
})
export class TrabajadorViewComponent implements AfterViewInit, OnDestroy {
  @Input() roleName: string = '';
  @Input() userName: string = '';
  isPresent = true;
  private map?: L.Map;
  private marker?: L.Marker;

  history = [
    { day: 'Lun', date: '21 Abr', mode: 'Presencial', hours: '8.2', entry: '08:00', exit: '17:15', status: 'Puntual' },
    { day: 'Mar', date: '22 Abr', mode: 'Remoto', hours: '7.8', entry: '08:05', exit: '16:50', status: 'Puntual' }
  ];

  public sparklineChart: any = {
    series: [{ name: 'Horas', data: [8.2, 7.8, 8.5, 4.0, 0, 0, 0] }],
    chart: { type: 'area', height: 80, sparkline: { enabled: true }, fontFamily: 'Inter' },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#0f172a']
  };

  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 1000);

    window.addEventListener('resize', () => {
      this.map?.invalidateSize();
    });
  }

  private initMap() {
    this.map = L.map('worker-map', { zoomControl: false }).setView([-12.0463, -77.0427], 15);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB'
    }).addTo(this.map);

    this.marker = L.marker([-12.0463, -77.0427], {
      icon: L.divIcon({
        className: 'worker-marker',
        html: `<div style="width: 14px; height: 14px; background: #2563eb; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);"></div>`,
        iconSize: [14, 14]
      })
    }).addTo(this.map);

    // Simulated real-time movement
    setInterval(() => {
      if (this.marker && this.map) {
        const currentPos = this.marker.getLatLng();
        const nextLat = currentPos.lat + (Math.random() - 0.5) * 0.0001;
        const nextLng = currentPos.lng + (Math.random() - 0.5) * 0.0001;
        this.marker.setLatLng([nextLat, nextLng]);
        this.map.panTo([nextLat, nextLng]);
      }
    }, 5000);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 500);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
