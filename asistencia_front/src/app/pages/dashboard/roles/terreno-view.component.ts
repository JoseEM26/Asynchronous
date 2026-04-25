import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import * as L from 'leaflet';

@Component({
  selector: 'app-terreno-view',
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
        <h1 class="text-h1">Operaciones en Campo</h1>
      </header>

      <div class="row g-4 mb-5">
        <div class="col-lg-8">
          <div class="minimal-card h-100 p-0 overflow-hidden position-relative" style="min-height: 500px;">
            <div id="terreno-map" class="h-100 w-100"></div>
            <div class="map-overlay-info">
               <span class="m-badge m-badge-success mb-2">GPS Activo</span>
               <p class="mb-0 fw-bold small text-primary">Sede Central - Punto de Control</p>
               <span class="text-muted extra-small">Lat: -12.0463 | Lng: -77.0427</span>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="row g-4">
             <div class="col-12">
                <div class="minimal-card">
                  <span class="text-label mb-4 d-block">Eficiencia</span>
                  <apx-chart
                    [series]="efficiencyChart.series"
                    [chart]="efficiencyChart.chart"
                    [xaxis]="efficiencyChart.xaxis"
                    [stroke]="efficiencyChart.stroke"
                    [colors]="efficiencyChart.colors"
                    [fill]="efficiencyChart.fill"
                  ></apx-chart>
                </div>
             </div>
             <div class="col-12">
                <div class="minimal-card">
                  <span class="text-label mb-3 d-block">Próximo Objetivo</span>
                  <div class="d-flex align-items-center gap-3">
                     <div class="step-circle">2</div>
                     <div>
                        <p class="mb-0 fw-bold small">Sede Norte</p>
                        <span class="text-muted extra-small">Distancia: 2.4km</span>
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
    .map-overlay-info {
      position: absolute; bottom: 20px; left: 20px; z-index: 1000;
      background: white; padding: 1rem; border-radius: 8px;
      border: 1px solid var(--border-light); box-shadow: var(--shadow-minimal);
    }
    .step-circle {
      width: 32px; height: 32px; border: 1px solid var(--text-main);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.8rem;
    }
    .extra-small { font-size: 0.7rem; }
  `]
})
export class TerrenoViewComponent implements AfterViewInit, OnDestroy {
  @Input() roleName: string = '';
  @Input() userName: string = '';
  private map?: L.Map;

  public efficiencyChart: any = {
    series: [{ name: 'Desempeño', data: [80, 50, 30, 40, 100, 20] }],
    chart: { height: 250, type: 'radar', toolbar: { show: false }, fontFamily: 'Inter' },
    xaxis: { categories: ['Vel', 'Pts', 'Time', 'Ruta', 'GPS', 'Batt'] },
    colors: ['#0f172a'],
    stroke: { width: 1 },
    fill: { opacity: 0.05 }
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
    this.map = L.map('terreno-map', { zoomControl: false }).setView([-12.0463, -77.0427], 14);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB'
    }).addTo(this.map);

    L.marker([-12.0463, -77.0427], {
      icon: L.divIcon({
        className: 'terreno-marker',
        html: `<div style="width: 14px; height: 14px; background: #6366f1; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);"></div>`,
        iconSize: [14, 14]
      })
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 500);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
