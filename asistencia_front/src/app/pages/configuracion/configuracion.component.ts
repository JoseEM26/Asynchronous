import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeColors } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">Centro de Configuración</h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">Personaliza la experiencia visual y los parámetros operativos de la plataforma.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Sidebar de Configuración -->
        <div class="col-lg-3">
          <div class="glass-card main-list-card p-3 sticky-top" style="top: 20px;">
            <nav class="config-nav">
               <button class="config-nav-item" [class.active]="activeTab === 'apariencia'" (click)="activeTab = 'apariencia'">
                  <div class="nav-icon-circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>
                  <span>Apariencia</span>
               </button>
               <button class="config-nav-item" [class.active]="activeTab === 'geolocalizacion'" (click)="activeTab = 'geolocalizacion'">
                  <div class="nav-icon-circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                  <span>Geolocalización</span>
               </button>
               <button class="config-nav-item" [class.active]="activeTab === 'avanzado'" (click)="activeTab = 'avanzado'">
                  <div class="nav-icon-circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                  <span>Seguridad y QR</span>
               </button>
            </nav>
            <div class="mt-4 px-3">
               <div class="p-3 bg-deep rounded-4 text-center border">
                  <span class="d-block small text-muted mb-1">Versión Sistema</span>
                  <span class="fw-bold text-primary">v2.4.0-PRO</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Contenido de Configuración -->
        <div class="col-lg-9">
          <!-- SECCION APARIENCIA -->
          <div *ngIf="activeTab === 'apariencia'" class="animate-fade">
            <div class="row g-4">
              <div class="col-md-7">
                <div class="glass-card main-list-card p-4 h-100">
                  <header class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <h5 class="fw-bold mb-0">Temas del Sistema</h5>
                    <span class="badge bg-soft-primary px-3 rounded-pill">UI/UX</span>
                  </header>
                  
                  <div class="theme-grid mb-5">
                    <div *ngFor="let t of availableThemes" 
                         class="theme-option-card" 
                         [class.selected]="customColors.primary === themes[t].primary"
                         (click)="selectTheme(t)">
                      <div class="theme-preview" [style.background]="'linear-gradient(135deg, ' + themes[t].primary + ', ' + themes[t].secondary + ')'"></div>
                      <span class="theme-label-premium">{{ t | uppercase }}</span>
                    </div>
                  </div>

                  <h6 class="text-uppercase small fw-bold text-muted ls-1 mb-4">Paleta Personalizada</h6>
                  <div class="row g-4">
                    <div class="col-md-4">
                      <div class="color-control">
                        <label class="small fw-semibold mb-2 d-block">Primario</label>
                        <div class="color-input-wrapper">
                           <input type="color" class="custom-color-picker" [(ngModel)]="customColors.primary">
                           <span class="color-hex">{{ customColors.primary }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="color-control">
                        <label class="small fw-semibold mb-2 d-block">Secundario</label>
                        <div class="color-input-wrapper">
                           <input type="color" class="custom-color-picker" [(ngModel)]="customColors.secondary">
                           <span class="color-hex">{{ customColors.secondary }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="color-control">
                        <label class="small fw-semibold mb-2 d-block">Fondo de Interfaz</label>
                        <div class="color-input-wrapper">
                           <input type="color" class="custom-color-picker" [(ngModel)]="customColors.background">
                           <span class="color-hex">{{ customColors.background }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 mt-4">
                      <div class="p-3 bg-deep rounded-4 border d-flex align-items-center justify-content-between">
                        <div>
                          <span class="fw-bold d-block">Modo Oscuro Forzado</span>
                          <span class="text-muted extra-small">Optimiza el contraste para ambientes de baja luz</span>
                        </div>
                        <div class="form-check form-switch custom-switch">
                          <input class="form-check-input" type="checkbox" id="darkModeSwitch" [(ngModel)]="customColors.isDark">
                        </div>
                      </div>
                    </div>
                    <div class="col-12 mt-4">
                      <button class="btn btn-primary-grad w-100 py-3 shadow-lg" (click)="applyCustom()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        Guardar Configuración Visual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="glass-card main-list-card p-4 h-100">
                  <h5 class="fw-bold mb-4 pb-2 border-bottom">Previsualización Real-Time</h5>
                  <div class="preview-stage rounded-4 p-4 d-flex flex-column gap-3">
                     <div class="preview-header p-2 bg-glass rounded-3 border">
                        <div class="d-flex gap-2">
                           <div class="p-circle red"></div>
                           <div class="p-circle yellow"></div>
                           <div class="p-circle green"></div>
                        </div>
                     </div>
                     <div class="p-5 text-center bg-surface-alpha rounded-4 border shadow-sm position-relative overflow-hidden">
                        <div class="glow-effect" [style.background]="'radial-gradient(circle at center, ' + customColors.primary + '22, transparent 70%)'"></div>
                        <div class="preview-avatar mx-auto mb-3" [style.background]="'linear-gradient(135deg, ' + customColors.primary + ', ' + customColors.secondary + ')'">
                           <span class="avatar-letter">A</span>
                        </div>
                        <h6 class="fw-bold mb-1">Muestra de Interfaz</h6>
                        <p class="small text-muted mb-4">Así se verán tus componentes.</p>
                        <button class="btn btn-primary-grad px-4 py-2 text-uppercase ls-1 small">Test Button</button>
                     </div>
                     <div class="d-flex gap-3 mt-2">
                        <div class="flex-fill p-2 bg-deep rounded-3 border text-center small opacity-50">Card A</div>
                        <div class="flex-fill p-2 bg-deep rounded-3 border text-center small opacity-50">Card B</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCION GEOLOCALIZACION -->
          <div *ngIf="activeTab === 'geolocalizacion'" class="animate-fade">
             <div class="glass-card main-list-card p-5">
               <div class="row align-items-center mb-5 pb-3 border-bottom">
                  <div class="col-md-9">
                    <h4 class="fw-bold mb-1">Parámetros de Geovalla</h4>
                    <p class="text-secondary opacity-75">Configura el punto geográfico central de marcación y su perímetro de tolerancia permitido.</p>
                  </div>
                  <div class="col-md-3 text-md-end">
                     <button class="btn btn-primary-grad px-4 shadow" (click)="saveGeo()">
                        Actualizar GPS
                     </button>
                  </div>
               </div>

               <div class="row g-5">
                  <div class="col-lg-7">
                    <div class="row g-4">
                      <div class="col-md-6">
                         <div class="form-field">
                           <label class="small fw-bold text-uppercase ls-1 text-muted mb-2">Latitud Central</label>
                           <div class="input-with-icon">
                              <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
                              <input type="number" [(ngModel)]="geoConfig.latitude" class="form-input-base ps-5" step="any">
                           </div>
                         </div>
                      </div>
                      <div class="col-md-6">
                         <div class="form-field">
                           <label class="small fw-bold text-uppercase ls-1 text-muted mb-2">Longitud Central</label>
                           <div class="input-with-icon">
                              <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg>
                              <input type="number" [(ngModel)]="geoConfig.longitude" class="form-input-base ps-5" step="any">
                           </div>
                         </div>
                      </div>
                      <div class="col-12 mt-4">
                         <div class="form-field">
                           <div class="d-flex justify-content-between align-items-center mb-3">
                              <label class="small fw-bold text-uppercase ls-1 text-muted">Radio de Acción (Metros)</label>
                              <span class="badge-pill">{{ geoConfig.radius }}m</span>
                           </div>
                           <div class="p-4 bg-deep rounded-4 border">
                              <input type="range" [(ngModel)]="geoConfig.radius" class="form-range custom-range" min="10" max="1000" step="10">
                              <div class="d-flex justify-content-between mt-2 extra-small text-muted fw-bold">
                                 <span>10m</span>
                                 <span>500m</span>
                                 <span>1000m</span>
                              </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-5">
                    <div class="status-card-geo p-4 rounded-4 h-100">
                       <h6 class="fw-bold mb-4">Ayuda de Configuración</h6>
                       <div class="d-flex gap-3 mb-4">
                          <div class="icon-circle-box blur-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                          <p class="small text-secondary mb-0">El radio recomendado para oficinas es de entre <strong>30m y 50m</strong>.</p>
                       </div>
                       <div class="d-flex gap-3 mb-4">
                          <div class="icon-circle-box blur-cyan"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
                          <p class="small text-secondary mb-0">Usa el botón de detección para obtener las coordenadas si te encuentras en el punto físico.</p>
                       </div>
                       <button class="btn btn-outline-primary btn-sm w-100 rounded-pill py-2 mt-auto" (click)="detectLocation()">
                          Detectar mi posición real ahora
                       </button>
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <!-- SECCION AVANZADO (SEGURIDAD/QR) -->
          <div *ngIf="activeTab === 'avanzado'" class="animate-fade">
             <div class="glass-card main-list-card p-5">
                <header class="mb-5 border-bottom pb-3">
                   <h4 class="fw-bold mb-1">Seguridad de Protocolo</h4>
                   <p class="text-secondary opacity-75">Configuración avanzada de tokens dinámicos y persistencia de sesión.</p>
                </header>
                <div class="row g-4">
                   <div class="col-md-6">
                      <div class="settings-premium-box">
                         <div class="p-icon-box bg-soft-primary mb-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                         </div>
                         <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fw-bold h6 mb-0">Rotación de QR</span>
                            <span class="badge bg-primary-grad-mini rounded-pill">BACKEND-ASYNC</span>
                         </div>
                         <p class="text-muted small mb-4">Frecuencia de refresco para el código dinámico de asistencia.</p>
                         <div class="p-3 bg-white bg-opacity-10 rounded-3 border text-center fw-bold text-primary">
                            CADA 5 MINUTOS (AUTOMÁTICO)
                         </div>
                      </div>
                   </div>
                   <div class="col-md-6">
                      <div class="settings-premium-box">
                         <div class="p-icon-box bg-soft-success mb-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                         </div>
                         <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fw-bold h6 mb-0">Hardware Binding</span>
                            <span class="status-indicator online">ACTIVO</span>
                         </div>
                         <p class="text-muted small mb-4">Vinculación de cuenta única por identificador de equipo físico.</p>
                         <div class="p-3 bg-white bg-opacity-10 rounded-3 border text-center fw-bold text-success small">
                            VALIDACIÓN POR IMEI/FINGERPRINT
                         </div>
                      </div>
                   </div>
                   <div class="col-12 mt-4 px-4 py-3 bg-soft-warning border-dashed rounded-4">
                      <div class="d-flex gap-3 align-items-center">
                         <div class="alert-icon-circle bg-warning text-white">!</div>
                         <div>
                            <span class="d-block fw-bold small">Nota de Administración</span>
                            <p class="extra-small mb-0 opacity-75">Cualquier cambio en los protocolos de encriptación o tiempos de refresco afectarán a todos los nodos conectados actualmente.</p>
                         </div>
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
    .ls-1 { letter-spacing: 0.1rem; }
    .extra-small { font-size: 0.7rem; }
    .ls-1 { letter-spacing: 0.1rem; }
    
    .icon-box-primary {
      padding: 12px; background: var(--grad-main); color: white;
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow-lg);
    }

    .main-list-card {
      border-radius: 20px; border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-xl); background: var(--bg-surface);
    }

    /* Side Nav Interior */
    .config-nav { display: flex; flex-direction: column; gap: 8px; }
    .config-nav-item {
      display: flex; align-items: center; gap: 15px; padding: 12px 16px;
      border: none; background: transparent; color: var(--text-muted);
      border-radius: 12px; font-weight: 600; font-size: 0.95rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-align: left;
    }
    .config-nav-item:hover { background: var(--bg-deep); color: var(--text-primary); }
    .config-nav-item.active { 
       background: var(--bg-deep); color: var(--accent-primary);
       border: 1px solid var(--glass-border);
       box-shadow: var(--shadow-sm); 
    }
    .nav-icon-circle {
       width: 32px; height: 32px; border-radius: 8px; background: var(--bg-deep);
       display: flex; align-items: center; justify-content: center;
       border: 1px solid var(--glass-border);
       transition: all 0.3s ease;
    }
    .active .nav-icon-circle { background: var(--grad-main); color: white; border-color: transparent; }

    /* Theme Section */
    .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 20px; }
    .theme-option-card {
      cursor: pointer; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.2s ease;
    }
    .theme-preview {
      height: 65px; border-radius: 14px; border: 3px solid transparent;
      box-shadow: var(--shadow-sm); transition: all 0.3s ease;
    }
    .theme-option-card.selected .theme-preview { border-color: var(--accent-primary); box-shadow: 0 0 15px var(--accent-primary); }
    .theme-label-premium { font-style: normal; font-size: 0.65rem; font-weight: 800; text-align: center; color: var(--text-muted); }
    .selected .theme-label-premium { color: var(--accent-primary); }

    .color-input-wrapper {
       display: flex; align-items: center; gap: 12px; background: var(--bg-deep);
       padding: 8px 12px; border-radius: 12px; border: 1.5px solid var(--glass-border);
    }
    .custom-color-picker {
       width: 24px; height: 24px; border: none; border-radius: 50%; background: none; cursor: pointer;
    }
    .color-hex { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); }

    /* Preview Section */
    .preview-stage { background: var(--bg-deep); border: 1px solid var(--glass-border); }
    .preview-header { border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; }
    .p-circle { width: 8px; height: 8px; border-radius: 50%; }
    .p-circle.red { background: #ff5f56; }
    .p-circle.yellow { background: #ffbd2e; }
    .p-circle.green { background: #27c93f; }
    .bg-glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(5px); }
    .bg-surface-alpha { background: var(--bg-surface); opacity: 0.95; }
    .preview-avatar {
       width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
       color: white; font-weight: 800; font-size: 1.2rem;
    }
    .glow-effect { position: absolute; inset: 0; pointer-events: none; }

    /* Geo Section */
    .input-with-icon { position: relative; width: 100%; }
    .field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--accent-primary); opacity: 0.7; }
    .custom-range::-webkit-slider-thumb { background: var(--accent-primary); }
    .status-card-geo { background: var(--bg-deep); border: 1px dashed var(--glass-border); display: flex; flex-direction: column; }
    .icon-circle-box {
       width: 36px; height: 36px; min-width: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
       color: white; font-weight: bold;
    }
    .blur-blue { background: rgba(37,99,235,0.25); color: #3b82f6; }
    .blur-cyan { background: rgba(6,182,212,0.25); color: #0891b2; }

    /* Advanced section */
    .settings-premium-box {
       padding: 30px; background: var(--bg-deep); border-radius: 20px; border: 1.5px solid var(--glass-border);
       transition: all 0.3s ease; height: 100%;
    }
    .settings-premium-box:hover { border-color: var(--accent-primary); transform: translateY(-5px); }
    .p-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .bg-soft-primary { background: rgba(37,99,235,0.08); }
    .bg-soft-success { background: rgba(16, 185, 129, 0.08); }
    .bg-primary-grad-mini { background: var(--grad-main); color: white; font-size: 0.6rem; }
    .status-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 800; }
    .status-indicator.online::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #10b981; }
    .alert-icon-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
    .bg-soft-warning { background: rgba(245,158,11,0.05); color: #d97706; }

    .btn-primary-grad {
      background: var(--grad-main); border: none; color: white;
      border-radius: 14px; font-weight: 700; transition: all 0.3s ease;
    }
    .btn-primary-grad:hover { transform: translateY(-2px); filter: brightness(1.1); }
  `]
})
export class ConfiguracionComponent implements OnInit {
  availableThemes: string[] = [];
  themes: any = {
    modern_light: { primary: '#6366f1', secondary: '#06b6d4', background: '#f8fafc', text: '#0f172a', isDark: false },
    minimal: { primary: '#8b5e3c', secondary: '#d2b48c', background: '#fdfbf7', text: '#2d241e', isDark: false },
    royal: { primary: '#1e3a8a', secondary: '#b45309', background: '#ffffff', text: '#1e293b', isDark: false },
    deep_ocean: { primary: '#38bdf8', secondary: '#818cf8', background: '#0a101f', text: '#ffffff', isDark: true },
    forest_night: { primary: '#4ade80', secondary: '#2dd4bf', background: '#060d0a', text: '#ffffff', isDark: true }
  };

  activeTab: string = 'apariencia';

  customColors: ThemeColors = {
    primary: '#6366f1',
    secondary: '#06b6d4',
    background: '#f8fafc',
    text: '#0f172a',
    isDark: false
  };

  constructor(
    private themeService: ThemeService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    const current = this.themeService.getTheme('modern_light');
    this.customColors = { ...current };
    this.loadGeoConfig();
  }

  selectTheme(name: string): void {
    this.themeService.setTheme(name);
    this.customColors = { ...this.themeService.getTheme(name) };
    this.notify.success(`Esquema ${name} aplicado con éxito`);
  }

  applyCustom(): void {
    this.themeService.setCustomColors(this.customColors);
    this.notify.success('Configuración personalizada de Layout guardada');
  }

  // --- GPS CONFIG LOGIC ---
  geoConfig = { latitude: -12.046374, longitude: -77.042793, radius: 50 };

  private loadGeoConfig(): void {
    const saved = localStorage.getItem('async_geo_config');
    if (saved) this.geoConfig = JSON.parse(saved);
  }

  detectLocation(): void {
    if (!navigator.geolocation) {
      this.notify.error('Geolocalización no soportada por el navegador');
      return;
    }

    this.notify.info('Solicitando ubicación...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.geoConfig.latitude = pos.coords.latitude;
        this.geoConfig.longitude = pos.coords.longitude;
        this.notify.success('Ubicación detectada correctamente');
      },
      () => this.notify.error('No se pudo obtener la ubicación. Verifique permisos.')
    );
  }

  saveGeo(): void {
    localStorage.setItem('async_geo_config', JSON.stringify(this.geoConfig));
    this.notify.success('Parámetros de geovalla actualizados');
  }
}
