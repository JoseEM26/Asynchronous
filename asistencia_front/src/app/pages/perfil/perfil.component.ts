import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponse } from '../../models/usuario.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <header class="mb-5">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="icon-box-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h1 class="h2 fw-bold mb-0">Mi Perfil</h1>
        </div>
        <p class="text-secondary fs-6 opacity-75">Información personal y laboral registrada en el sistema.</p>
      </header>

      <div class="row g-4" *ngIf="user$ | async as user">
        <!-- Tarjeta de Identidad -->
        <div class="col-lg-4">
          <div class="premium-card text-center p-5">
            <div class="profile-avatar-large mx-auto mb-4">
              <span>{{ user.trabajador.nombres[0] || 'U' }}</span>
              <div class="status-badge-online"></div>
            </div>
            <h2 class="h3 fw-bold mb-1">{{ user.trabajador.nombres }} {{ user.trabajador.apellidos }}</h2>
            <p class="text-accent fw-bold small mb-4 ls-1 uppercase">{{ user.rol.nombre }}</p>
            
            <div class="d-flex flex-column gap-2 text-start mt-4 border-top pt-4">
              <div class="info-row-minimal">
                <span class="label">Username</span>
                <span class="value">{{ user.username }}</span>
              </div>
              <div class="info-row-minimal">
                <span class="label">Estado</span>
                <span class="value badge-success-minimal">Activo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Detallada -->
        <div class="col-lg-8">
          <div class="glass-card p-0 overflow-hidden mb-4">
            <div class="px-4 py-3 border-bottom bg-light-subtle d-flex justify-content-between align-items-center">
              <h3 class="h6 fw-bold mb-0">Información Laboral</h3>
              <span class="small text-muted">ID Trabajador: #{{ user.trabajador.id }}</span>
            </div>
            <div class="p-4">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="detail-item">
                    <label>DNI / Documento</label>
                    <p>{{ user.trabajador.dni || 'No registrado' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label>Email Corporativo</label>
                    <p>{{ user.trabajador.email || 'No registrado' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label>Modalidad de Trabajo</label>
                    <div class="modality-pill">
                       {{ user.trabajador.modalidadNombre || 'No definida' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label>Fecha de Ingreso</label>
                    <p>{{ (user.trabajador.fechaIngreso | date:'longDate') || 'No registrada' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-6">
              <div class="glass-card p-4">
                <h3 class="h6 fw-bold mb-4 d-flex align-items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Horario Establecido
                </h3>
                <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span class="text-secondary small">Entrada</span>
                  <span class="fw-bold">{{ user.trabajador.horaIngreso || '--:--' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-secondary small">Salida</span>
                  <span class="fw-bold">{{ user.trabajador.horaSalida || '--:--' }}</span>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="glass-card p-4 h-100">
                <h3 class="h6 fw-bold mb-4 d-flex align-items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Contacto
                </h3>
                <div class="detail-item mb-0">
                  <label>Teléfono</label>
                  <p class="mb-0">{{ user.trabajador.telefono || 'No registrado' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-card {
      background: white; border-radius: 24px; border: 1px solid var(--border-light);
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .profile-avatar-large {
      width: 120px; height: 120px; background: var(--grad-main);
      border-radius: 40px; display: flex; align-items: center; justify-content: center;
      font-size: 3rem; font-weight: 800; color: white; position: relative;
      box-shadow: 0 20px 40px rgba(249, 115, 22, 0.3);
    }
    .status-badge-online {
      position: absolute; bottom: 5px; right: 5px; width: 24px; height: 24px;
      background: #10b981; border: 4px solid white; border-radius: 50%;
    }
    .glass-card {
      background: white; border-radius: 20px; border: 1px solid var(--border-light);
    }
    .bg-light-subtle { background: #fafafa; }
    .icon-box-primary {
      padding: 10px; background: var(--grad-main); color: white;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
    }
    .info-row-minimal {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.5rem 0;
    }
    .info-row-minimal .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
    .info-row-minimal .value { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
    
    .detail-item label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; }
    .detail-item p { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
    
    .modality-pill {
      display: inline-block; padding: 6px 16px; background: var(--bg-deep);
      border-radius: 12px; color: var(--accent-primary); font-weight: 800; font-size: 0.85rem;
    }
    .badge-success-minimal { color: #10b981; font-weight: 800; font-size: 0.8rem; }
    .ls-1 { letter-spacing: 1px; }
    .uppercase { text-transform: uppercase; }
  `]
})
export class PerfilComponent implements OnInit {
  user$: Observable<UsuarioResponse | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}
}
