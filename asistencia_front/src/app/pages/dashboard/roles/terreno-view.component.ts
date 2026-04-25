import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxApexchartsModule } from 'ngx-apexcharts';

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
        <h1 class="text-h1">Ruta en Terreno</h1>
      </header>

      <div class="row g-4 mb-5">
        <div class="col-lg-8">
          <div class="minimal-card h-100 p-0 overflow-hidden">
            <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
               <h3 class="text-h3 mb-0" style="font-size: 1rem;">Ubicación en Tiempo Real</h3>
               <span class="m-badge m-badge-success">GPS ACTIVO</span>
            </div>
            <div class="map-minimal d-flex flex-column align-items-center justify-content-center p-5 text-center">
               <div class="minimal-marker mb-3"></div>
               <span class="fw-bold mb-1">Sede Central - Punto Actual</span>
               <p class="text-muted small">Lat: -12.0463 | Lng: -77.0427</p>
               <button class="btn-text mt-2">Ver en Google Maps</button>
            </div>
            <div class="p-4 border-top">
               <span class="text-label mb-3 d-block">Siguiente punto de interés</span>
               <div class="d-flex align-items-center gap-3">
                  <div class="minimal-step">2</div>
                  <div>
                    <p class="mb-0 fw-bold small">Sede Norte - Mantenimiento</p>
                    <span class="text-muted extra-small">2.4km • 15 min estimado</span>
                  </div>
               </div>
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
                    [markers]="efficiencyChart.markers"
                  ></apx-chart>
                </div>
             </div>
             <div class="col-12">
                <div class="minimal-card">
                  <span class="text-label mb-4 d-block">Tiempo en Punto (Promedio)</span>
                  <apx-chart
                    [series]="durationChart.series"
                    [chart]="durationChart.chart"
                    [plotOptions]="durationChart.plotOptions"
                    [xaxis]="durationChart.xaxis"
                    [colors]="durationChart.colors"
                  ></apx-chart>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-minimal { height: 300px; background: #fcfcfd; }
    .minimal-marker { width: 16px; height: 16px; background: var(--text-main); border: 4px solid #fff; border-radius: 50%; box-shadow: 0 0 0 8px rgba(15, 23, 42, 0.05); }
    .bg-light-subtle { background: #fafafa; }
    .btn-text { background: none; border: none; font-size: 0.8rem; font-weight: 600; text-decoration: underline; cursor: pointer; }
    .minimal-step { width: 24px; height: 24px; border: 1px solid var(--text-main); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
    .extra-small { font-size: 0.7rem; }
  `]
})
export class TerrenoViewComponent {
  @Input() roleName: string = '';
  @Input() userName: string = '';

  public efficiencyChart: any = {
    series: [{ name: 'Desempeño', data: [80, 50, 30, 40, 100, 20] }],
    chart: { height: 250, type: 'radar', toolbar: { show: false }, fontFamily: 'Inter' },
    xaxis: { categories: ['Vel', 'Pts', 'Time', 'Ruta', 'GPS', 'Batt'] },
    colors: ['#0f172a'],
    stroke: { width: 1 },
    fill: { opacity: 0.05 },
    markers: { size: 0 }
  };

  public durationChart: any = {
    series: [{ name: 'Minutos', data: [45, 52, 38, 24, 48] }],
    chart: { type: 'bar', height: 180, toolbar: { show: false }, fontFamily: 'Inter' },
    plotOptions: { bar: { horizontal: true, borderRadius: 2, barHeight: '40%' } },
    xaxis: { categories: ['P1', 'P2', 'P3', 'P4', 'P5'], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    colors: ['#0f172a']
  };
}
