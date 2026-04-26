import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../../../../services/configuracion.service';
import { TrabajadorService } from '../../../../services/trabajador.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-config-remoto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './remoto.component.html',
  styleUrls: ['./remoto.component.css']
})
export class RemotoComponent implements OnInit, OnDestroy {
  trabajadoresRemotos: any[] = [];
  focusedWorker: any = null;
  searchText: string = '';

  get filteredTrabajadores(): any[] {
    if (!this.searchText) return this.trabajadoresRemotos;
    const term = this.searchText.toLowerCase();
    return this.trabajadoresRemotos.filter(t => 
      t.nombres.toLowerCase().includes(term) || 
      t.apellidos.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term)
    );
  }

  private remoteMap: L.Map | null = null;
  private remoteMarkers: L.Marker[] = [];

  constructor(
    private configService: ConfiguracionService,
    private trabajadorService: TrabajadorService
  ) { }

  ngOnInit(): void {
    this.loadRemotoData();
    this.initRemoteMap();
  }

  ngOnDestroy(): void {
    if (this.remoteMap) {
      this.remoteMap.remove();
    }
  }

  loadRemotoData(): void {
    this.trabajadorService.listar().subscribe({
      next: (data) => {
        console.log('Trabajadores cargados en Remoto:', data);
        this.trabajadoresRemotos = data;
        this.updateRemoteMarkers();
      },
      error: (err) => console.error('Error cargando trabajadores en Remoto:', err)
    });
  }

  initRemoteMap(): void {
    setTimeout(() => {
      const container = document.getElementById('remote-map');
      if (!container || (container as any)._leaflet_id) return;
      if (this.remoteMap) this.remoteMap.remove();
      this.remoteMap = L.map('remote-map').setView([-12.0463, -77.0427], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.remoteMap);
      this.updateRemoteMarkers();
    }, 250);
  }

  updateRemoteMarkers(): void {
    if (!this.remoteMap) return;
    this.remoteMarkers.forEach(m => m.remove());
    this.remoteMarkers = [];
    const bounds = L.latLngBounds([]);
    this.trabajadoresRemotos.forEach(t => {
      if (t.latitudVirtual) {
        const m = L.marker([t.latitudVirtual, t.longitudVirtual], {
          icon: L.divIcon({ className: 'custom-marker', html: `<div class=\"pulse-dot\" style=\"background: #38bdf8\"></div>`, iconSize: [12,12] })
        }).bindPopup(`<b>${t.nombres}</b>`).addTo(this.remoteMap!);
        this.remoteMarkers.push(m);
        bounds.extend([t.latitudVirtual, t.longitudVirtual]);
      }
    });
    if (this.remoteMarkers.length > 0) {
      this.remoteMap.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  focusWorker(t: any): void {
    if (t.latitudVirtual && this.remoteMap) {
      this.focusedWorker = t;
      this.remoteMap.setView([t.latitudVirtual, t.longitudVirtual], 17);
    }
  }

  resetRemoto(id: number): void {
    if (confirm('¿Resetear ubicación?')) {
      this.configService.resetUbicacionVirtual(id).subscribe(() => this.loadRemotoData());
    }
  }
}
