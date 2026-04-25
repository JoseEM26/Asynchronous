import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../models/usuario.interface';

@Component({
   selector: 'app-detail-usuario',
   standalone: true,
   imports: [CommonModule],
   template: `
    <div class="detail-overlay" (click)="onClose()">
      <div class="detail-panel animate-slide-up" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="detail-header">
           <div class="banner-gradient"></div>
           <button class="btn-close-glass" (click)="onClose()">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
           
           <div class="profile-summary">
              <div class="avatar-large" style="overflow: hidden; padding: 2px;">
                 <img src="logo.jpeg" alt="User" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
              </div>
              <div class="profile-info">
                <h2 class="profile-name">{{ usuario?.username }}</h2>
                <div class="d-flex align-items-center gap-2">
                   <span class="badge-account">Cuenta de Usuario</span>
                   <span class="status-indicator active">Activo</span>
                </div>
              </div>
           </div>
        </header>

        <div class="detail-content custom-scrollbar">
           <div class="detail-grid">
              <!-- Información de la Cuenta -->
              <div class="detail-card info-card full-width">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Seguridad y Acceso
                 </div>
                 <div class="d-flex justify-content-between align-items-center">
                    <div class="info-item">
                       <label>Nombre de Usuario</label>
                       <span class="username-display">{{ usuario?.username }}</span>
                    </div>
                    <div class="info-item text-end">
                       <label>Rol de Sistema</label>
                       <span class="badge bg-primary rounded-pill px-3">{{ usuario?.rol?.nombre }}</span>
                    </div>
                 </div>
              </div>

              <!-- Relación con Trabajador -->
              <div class="detail-card relation-card full-width mt-3">
                 <div class="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                    Trabajador Vinculado
                 </div>
                 
                 <div class="worker-relation-box">
                    <div class="worker-avatar">
                       {{ usuario?.trabajador?.nombres ? usuario!.trabajador!.nombres[0] : '?' }}
                    </div>
                    <div class="worker-details">
                       <h4 class="worker-name">{{ usuario?.trabajador?.nombres }} {{ usuario?.trabajador?.apellidos }}</h4>
                       <div class="d-flex gap-3 mt-1">
                          <span class="worker-meta">
                             <strong>DNI:</strong> {{ usuario?.trabajador?.dni }}
                          </span>
                          <span class="worker-meta">
                             <strong>Email:</strong> {{ usuario?.trabajador?.email }}
                          </span>
                       </div>
                       <p class="worker-note mt-2">
                          Este usuario tiene el control de asistencia para el perfil laboral de {{ usuario?.trabajador?.nombres }}.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <footer class="detail-footer">
           <button class="btn btn-premium-close" (click)="onClose()">Cerrar</button>
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
      width: 100%; max-width: 600px; background: #fff; border-radius: 24px;
      overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2); position: relative;
    }
    
    .detail-header { position: relative; padding: 60px 40px 30px; }
    .banner-gradient {
      position: absolute; top: 0; left: 0; right: 0; height: 120px;
      background: var(--grad-main);
    }
    .btn-close-glass {
      position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2); color: white; width: 40px; height: 40px;
      border-radius: 12px; display: flex; align-items: center; justify-content: center; 
      cursor: pointer; transition: all 0.2s;
    }
    .profile-summary { position: relative; display: flex; align-items: flex-end; gap: 24px; }
    .avatar-large {
      width: 80px; height: 80px; background: #fff; border-radius: 20px;
      display: flex; align-items: center; justify-content: center; color: #ea580c;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 4px solid #fff;
    }
    .profile-name { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
    .badge-account { background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; }
    .status-indicator { font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 30px; background: #dcfce7; color: #166534; }
    .status-indicator::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .detail-content { padding: 30px 40px; }
    .detail-grid { display: flex; flex-direction: column; gap: 15px; }
    .detail-card { background: #f8fafc; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; }
    .card-header { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
    .username-display { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #ea580c; }

    .worker-relation-box { display: flex; gap: 16px; align-items: center; background: #fff; padding: 15px; border-radius: 16px; border: 1px solid #e2e8f0; }
    .worker-avatar { width: 50px; height: 50px; background: #fff7ed; color: #ea580c; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
    .worker-name { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
    .worker-meta { font-size: 0.8rem; color: #64748b; }
    .worker-note { font-size: 0.75rem; color: #94a3b8; font-style: italic; }

    .detail-footer { padding: 20px 40px 30px; text-align: center; }
    .btn-premium-close { background: #1e293b; color: white; padding: 10px 40px; border-radius: 12px; font-weight: 700; border: none; }
    
    .animate-slide-up { animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .full-width { width: 100%; }
  `]
})
export class DetailUsuarioComponent {
   @Input() usuario: UsuarioResponse | null = null;
   @Output() close = new EventEmitter<void>();

   onClose() {
      this.close.emit();
   }
}
