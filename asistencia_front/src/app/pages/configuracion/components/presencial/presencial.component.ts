import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../../../../services/configuracion.service';
import { NotificationService } from '../../../../services/notification.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-config-presencial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presencial.component.html',
  styleUrls: ['./presencial.component.css']
})
export class PresencialComponent implements OnInit, OnDestroy {
  @Input() geoConfig: any = { officeLat: -12.046374, officeLng: -77.042793, radius: 50 };
  showMapArea: boolean = false;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private circle: L.Circle | null = null;

  constructor(
    private configService: ConfiguracionService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    if (this.geoConfig.officeLat) {
      this.showMapArea = true;
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  detectLocation(): void {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.geoConfig.officeLat = pos.coords.latitude;
      this.geoConfig.officeLng = pos.coords.longitude;
      this.notify.success('Ubicación detectada');
      if (!this.showMapArea) {
        this.showMapArea = true;
        this.initMap();
      } else {
        this.updateMap();
      }
    });
  }

  initMap(): void {
    setTimeout(() => {
      const container = document.getElementById('office-map');
      if (!container || (container as any)._leaflet_id) return;
      if (this.map) this.map.remove();
      this.map = L.map('office-map').setView([this.geoConfig.officeLat, this.geoConfig.officeLng], 16);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.map);
      this.marker = L.marker([this.geoConfig.officeLat, this.geoConfig.officeLng], {
        icon: L.divIcon({ className: 'custom-marker', html: '<div class=\"pulse-dot\"></div>', iconSize: [16,16] })
      }).addTo(this.map);
      this.circle = L.circle([this.geoConfig.officeLat, this.geoConfig.officeLng], {
        color: '#6366f1', radius: this.geoConfig.radius, fillOpacity: 0.15
      }).addTo(this.map);
    }, 150);
  }

  updateMap(): void {
    if (this.map && this.marker && this.circle) {
      const ll: L.LatLngExpression = [this.geoConfig.officeLat, this.geoConfig.officeLng];
      this.map.setView(ll);
      this.marker.setLatLng(ll);
      this.circle.setLatLng(ll).setRadius(this.geoConfig.radius);
    }
  }

  saveGeo(): void {
    this.configService.actualizar(this.geoConfig).subscribe(() => this.notify.success('Configuración guardada'));
  }
}
