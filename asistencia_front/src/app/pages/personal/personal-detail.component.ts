import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalUnificado, PersonalService } from '../../services/personal.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-personal-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop fade-in" (click)="close.emit()">
      <div class="modal-content glass-card p-0 animate-scale-up" (click)="$event.stopPropagation()">
        <!-- Header con gradiente -->
        <div class="detail-header p-4 text-white rounded-top-4 position-relative">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-large">
              {{ data?.nombres?.[0] }}
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ data?.nombres }} {{ data?.apellidos }}</h3>
              <span class="opacity-75">@{{ data?.username }}</span>
            </div>
          </div>
          <button class="btn-close-modal" (click)="close.emit()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="detail-label">Documento de Identidad (DNI)</label>
              <div class="detail-value">{{ data?.dni }}</div>
            </div>
            <div class="col-md-6">
              <label class="detail-label">Correo Electrónico</label>
              <div class="detail-value text-primary">{{ data?.email || 'No registrado' }}</div>
            </div>
            <div class="col-md-6">
              <label class="detail-label">Teléfono / WhatsApp</label>
              <div class="detail-value">{{ data?.telefono || 'No registrado' }}</div>
            </div>
            <div class="col-md-6">
              <label class="detail-label">Modalidad de Trabajo</label>
              <div class="mt-1">
                 <span class="badge rounded-pill px-3 py-2" [ngClass]="getModalidadClass(data?.modalidadId)">
                    {{ data?.modalidadNombre }}
                 </span>
              </div>
            </div>
            <div class="col-md-12">
              <label class="detail-label">Dirección / Hogar</label>
              <div class="detail-value">{{ data?.direccion || 'Sin dirección registrada' }}</div>
            </div>
            
            <hr class="my-2 opacity-10">

            <div class="col-md-12">
               <label class="detail-label">Horario de Trabajo Asignado</label>
               <div class="detail-value text-success d-flex align-items-center gap-2">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 <span>{{ data?.horaIngreso || 'No definido' }} a {{ data?.horaSalida || 'No definido' }}</span>
               </div>
            </div>

            <div class="col-md-12 mt-3" *ngIf="data?.modalidadId === 2 || data?.modalidadId === 3">
               <div class="p-3 rounded-4 border border-info bg-info bg-opacity-10 d-flex justify-content-between align-items-center">
                 <div>
                   <h6 class="mb-1 fw-bold text-info-emphasis">Ubicación Virtual (Hogar)</h6>
                   <p class="mb-0 small text-secondary">
                     Estado: <span class="fw-bold" [class.text-success]="!data?.permitirCambioUbicacion" [class.text-warning]="data?.permitirCambioUbicacion">
                       {{ data?.permitirCambioUbicacion ? 'Esperando que el trabajador fije su ubicación' : (data?.latitudVirtual ? 'Ubicación fijada correctamente' : 'Sin ubicación, necesita permiso') }}
                     </span>
                   </p>
                 </div>
                 <button *ngIf="!data?.permitirCambioUbicacion" class="btn btn-info btn-sm rounded-pill text-white fw-bold shadow-sm px-3" (click)="otorgarPermiso()">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1 mb-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   Otorgar Permiso
                 </button>
               </div>
            </div>

            <hr class="my-2 opacity-10 w-100">

            <div class="col-md-6">
               <label class="detail-label mb-2">Días Presenciales</label>
               <div class="d-flex flex-wrap gap-1">
                 <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 rounded-pill" *ngFor="let dia of getDiasArray(data?.diasPresencial)">{{dia}}</span>
                 <span *ngIf="!data?.diasPresencial" class="small text-muted italic">Ninguno</span>
               </div>
            </div>
            <div class="col-md-6">
               <label class="detail-label mb-2">Días Remotos (Virtual)</label>
               <div class="d-flex flex-wrap gap-1">
                 <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 py-2 px-3 rounded-pill" *ngFor="let dia of getDiasArray(data?.diasRemotos)">{{dia}}</span>
                 <span *ngIf="!data?.diasRemotos" class="small text-muted italic">Ninguno</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-light rounded-bottom-4 text-end">
          <button class="btn btn-secondary px-4 rounded-pill" (click)="close.emit()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;
    }
    .modal-content {
      width: 100%; max-width: 600px; background: white; border-radius: 24px; overflow: hidden;
    }
    .detail-header { background: var(--grad-main); }
    .avatar-large {
      width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 18px;
      display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .btn-close-modal {
      position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: white; opacity: 0.7; transition: 0.2s;
    }
    .btn-close-modal:hover { opacity: 1; transform: scale(1.1); }
    .detail-label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
    .detail-value { font-size: 1rem; font-weight: 600; color: #1e293b; }
    .badge.rounded-pill { font-size: 0.8rem; }
    .mod-presencial { background: #dcfce7; color: #166534; }
    .mod-virtual { background: #e0f2fe; color: #075985; }
    .mod-hibrido { background: #fef9c3; color: #854d0e; }
    .mod-terreno { background: #f3e8ff; color: #6b21a8; }
  `]
})
export class PersonalDetailComponent {
  @Input() data: PersonalUnificado | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private personalService: PersonalService, private notify: NotificationService) {}

  otorgarPermiso() {
    if (!this.data?.id) return;
    this.personalService.permitirCambioUbicacion(this.data.id, true).subscribe({
      next: () => {
        this.notify.success('Permiso otorgado. El trabajador ahora puede cambiar su ubicación.');
        if (this.data) this.data.permitirCambioUbicacion = true;
      },
      error: () => this.notify.error('Error al otorgar el permiso')
    });
  }

  getModalidadClass(id?: number): string {
    switch (id) {
      case 1: return 'mod-presencial';
      case 2: return 'mod-virtual';
      case 3: return 'mod-hibrido';
      case 4: return 'mod-terreno';
      default: return 'bg-secondary text-white';
    }
  }

  getDiasArray(diasStr?: string): string[] {
    if (!diasStr) return [];
    return diasStr.split(',').map(d => d.trim()).filter(d => d.length > 0);
  }
}
