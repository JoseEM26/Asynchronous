import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajadorResponse } from '../../models/trabajador.interface';

@Component({
  selector: 'app-detail-trabajador',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-overlay" (click)="onClose()">
      <div class="detail-panel animate-slide-up" (click)="$event.stopPropagation()">
        <!-- Header con Banner -->
        <header class="detail-header">
           <div class="banner-gradient"></div>
           <button class="btn-close-glass" (click)="onClose()">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
           
           <div class="profile-summary">
              <div class="avatar-large">
                {{ trabajador?.nombres ? trabajador!.nombres[0] : '?' }}
              </div>
              <div class="profile-info">
                <h2 class="profile-name">{{ trabajador?.nombres }} {{ trabajador?.apellidos }}</h2>
                <div class="d-flex align-items-center gap-2">
                   <span class="badge-role">{{ trabajador?.rolNombre }}</span>
                   <span class="status-indicator" [class.active]="trabajador?.activo">
                     {{ trabajador?.activo ? 'VIGENTE' : 'INACTIVO' }}
                   </span>
                </div>
              </div>
           </div>
        </header>

        <div class="detail-content custom-scrollbar">
           <div class="detail-grid">
              <!-- Columna 1: Información Personal -->
              <div class="detail-card info-card">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Información Personal
                 </div>
                 <div class="info-item">
                    <label>Documento de Identidad (DNI)</label>
                    <span>{{ trabajador?.dni }}</span>
                 </div>
                 <div class="info-item">
                    <label>Correo Electrónico</label>
                    <span class="text-primary">{{ trabajador?.email }}</span>
                 </div>
                 <div class="info-item">
                    <label>Teléfono de Contacto</label>
                    <span>{{ trabajador?.telefono || 'No registrado' }}</span>
                 </div>
                 <div class="info-item">
                    <label>Dirección</label>
                    <span>{{ trabajador?.direccion || 'No registrada' }}</span>
                 </div>
              </div>

              <!-- Columna 2: Ficha Laboral -->
              <div class="detail-card job-card">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    Ficha Laboral
                 </div>
                 <div class="info-item highlight-date">
                    <label>Fecha de Ingreso</label>
                    <div class="date-badge">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                       {{ trabajador?.fechaIngreso | date:'longDate' }}
                    </div>
                 </div>
                 <div class="info-item">
                    <label>Modalidad de Trabajo</label>
                    <div class="modality-tag" [ngClass]="getModalidadClass(trabajador?.modalidadId)">
                       {{ getModalidadLabel(trabajador?.modalidadId) }}
                    </div>
                 </div>
                 <div class="info-item" *ngIf="trabajador?.modalidadId === 4">
                    <label>Liderazgo de Terreno</label>
                    <span>{{ trabajador?.esJefeTerreno ? 'Es Líder de Terreno' : 'Asignado a: ' + (trabajador?.jefeNombre || 'N/A') }}</span>
                 </div>
              </div>

              <!-- Columna 3: Jornada Semanal -->
              <div class="detail-card schedule-card full-width" *ngIf="trabajador?.modalidadId !== 5">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Distribución de Jornada Semanal
                 </div>
                 <div class="schedule-grid">
                    <div *ngFor="let day of DAYS" class="schedule-day" [ngClass]="getDayState(day)">
                       <span class="day-label">{{ day.substring(0,3) }}</span>
                       <span class="state-label">{{ getDayStateLabel(day) }}</span>
                    </div>
                 </div>
              </div>

              <!-- Geolocalización (Solo si aplica) -->
              <div class="detail-card geo-card full-width" *ngIf="trabajador?.latitudVirtual || trabajador?.longitudVirtual">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Perímetro de Marcación Virtual
                 </div>
                 <div class="d-flex align-items-center gap-4">
                    <div class="geo-badge">
                       <label>Latitud</label>
                       <span>{{ trabajador?.latitudVirtual }}</span>
                    </div>
                    <div class="geo-badge">
                       <label>Longitud</label>
                       <span>{{ trabajador?.longitudVirtual }}</span>
                    </div>
                    <div class="flex-grow-1 text-end">
                       <span class="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 rounded-pill small">Validación de GPS Activa</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <footer class="detail-footer">
           <button class="btn btn-premium-close" (click)="onClose()">Cerrar Vista</button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .detail-overlay {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px); z-index: 1050; display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .detail-panel {
      width: 100%; max-width: 800px; background: #fff; border-radius: 24px;
      overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2); position: relative;
    }
    
    .detail-header { position: relative; padding: 60px 40px 30px; }
    .banner-gradient {
      position: absolute; top: 0; left: 0; right: 0; height: 120px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    .btn-close-glass {
      position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2); color: white; width: 40px; height: 40px;
      border-radius: 12px; display: flex; align-items: center; justify-content: center; 
      cursor: pointer; transition: all 0.2s;
    }
    .btn-close-glass:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.1); }

    .profile-summary { position: relative; display: flex; align-items: flex-end; gap: 24px; }
    .avatar-large {
      width: 100px; height: 100px; background: #fff; border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; font-weight: 800; color: #1e293b;
      box-shadow: var(--shadow-xl); border: 4px solid #fff;
    }
    .profile-info { padding-bottom: 5px; }
    .profile-name { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
    .badge-role {
      background: #f1f5f9; color: #475569; padding: 6px 14px; border-radius: 30px;
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
    }
    .status-indicator {
      font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 30px; background: #fee2e2; color: #991b1b;
    }
    .status-indicator.active { background: #dcfce7; color: #166534; }
    .status-indicator::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

    .detail-content { padding: 30px 40px; max-height: 60vh; overflow-y: auto; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .full-width { grid-column: span 2; }

    .detail-card {
      background: #f8fafc; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    .card-header {
      font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase;
      letter-spacing: 1px; display: flex; align-items: center; gap: 10px; margin-bottom: 15px;
    }

    .info-item { margin-bottom: 12px; display: flex; flex-direction: column; }
    .info-item label { font-size: 0.7rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
    .info-item span { font-size: 0.95rem; font-weight: 600; color: #1e293b; }
    
    .highlight-date .date-badge {
      display: inline-flex; align-items: center; gap: 10px; background: #fff;
      padding: 8px 15px; border-radius: 12px; border: 1px solid #e2e8f0;
      font-weight: 700; color: #1e293b;
    }

    .modality-tag {
      display: inline-block; padding: 6px 15px; border-radius: 10px; font-weight: 700; font-size: 0.8rem;
    }
    .mod-presencial { background: #dcfce7; color: #166534; }
    .mod-virtual { background: #e0f2fe; color: #075985; }
    .mod-hibrido { background: #fef9c3; color: #854d0e; }
    .mod-terreno { background: #f3e8ff; color: #6b21a8; }

    .schedule-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
    .schedule-day {
      background: #fff; padding: 12px 10px; border-radius: 12px; border: 1px solid #e2e8f0;
      text-align: center; display: flex; flex-direction: column; gap: 4px;
    }
    .schedule-day.OFC { border-color: #3b82f6; background: #eff6ff; }
    .schedule-day.REM { border-color: #64748b; background: #f1f5f9; }
    .day-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .state-label { font-size: 0.75rem; font-weight: 700; color: #475569; }
    .OFC .day-label, .OFC .state-label { color: #2563eb; }

    .geo-badge { display: flex; flex-direction: column; background: #fff; padding: 10px 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .geo-badge label { font-size: 0.6rem; color: #94a3b8; font-weight: 700; }
    .geo-badge span { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #0891b2; }

    .detail-footer { padding: 20px 40px 30px; text-align: center; }
    .btn-premium-close {
      background: #1e293b; color: white; padding: 12px 60px; border-radius: 15px;
      font-weight: 700; border: none; transition: all 0.2s; box-shadow: 0 10px 20px -5px rgba(30, 41, 59, 0.4);
    }
    .btn-premium-close:hover { background: #334155; transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(30, 41, 59, 0.5); }

    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class DetailTrabajadorComponent {
  @Input() trabajador: TrabajadorResponse | null = null;
  @Output() close = new EventEmitter<void>();

  readonly DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  onClose() {
    this.close.emit();
  }

  getModalidadLabel(id?: number): string {
    switch (id) {
      case 1: return 'Laboral Presencial';
      case 2: return 'Trabajo Virtual';
      case 3: return 'Esquema Híbrido';
      case 4: return 'Operaciones Terreno';
      case 5: return 'Exento de Marcación';
      default: return 'No asignado';
    }
  }

  getModalidadClass(id?: number): string {
    switch (id) {
      case 1: return 'mod-presencial';
      case 2: return 'mod-virtual';
      case 3: return 'mod-hibrido';
      case 4: return 'mod-terreno';
      default: return 'bg-light';
    }
  }

  getDayState(day: string): string {
    if (!this.trabajador) return 'LIB';
    const presencial = this.trabajador.diasPresencial?.split(',').map(d => d.trim()) || [];
    const remoto = this.trabajador.diasRemotos?.split(',').map(d => d.trim()) || [];

    if (presencial.includes(day)) return 'OFC';
    if (remoto.includes(day)) return 'REM';
    return 'LIB';
  }

  getDayStateLabel(day: string): string {
    const state = this.getDayState(day);
    return state === 'OFC' ? 'PRES' : state === 'REM' ? 'VIRT' : 'LIBRE';
  }
}
