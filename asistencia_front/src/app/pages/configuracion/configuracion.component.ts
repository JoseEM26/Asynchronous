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
    <div class="container-fluid animate-fade">
      <div class="row mb-4">
        <div class="col-12 text-start">
          <h1 class="display-5 fw-bold">Configuración</h1>
          <p class="text-secondary">Personaliza la apariencia de tu sistema Asynchronous.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6">
          <div class="glass-card p-4">
            <h4 class="mb-4">Paleta de Colores</h4>
            
            <div class="theme-grid mb-5">
               <div *ngFor="let t of availableThemes" 
                    class="theme-option" 
                    [style.background]="'linear-gradient(135deg, ' + themes[t].primary + ', ' + themes[t].secondary + ')'"
                    (click)="selectTheme(t)">
                 <span class="theme-label text-capitalize">{{ t }}</span>
               </div>
            </div>

            <h4 class="mb-3">Personalizado</h4>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label text-secondary small">Acento 1</label>
                <input type="color" class="form-control form-control-color w-100 dark-picker" 
                       [(ngModel)]="customColors.primary">
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary small">Acento 2</label>
                <input type="color" class="form-control form-control-color w-100 dark-picker" 
                       [(ngModel)]="customColors.secondary">
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary small">Fondo</label>
                <input type="color" class="form-control form-control-color w-100 dark-picker" 
                       [(ngModel)]="customColors.background">
              </div>

              <div class="col-12 mt-3">
                <div class="form-check form-switch custom-switch">
                  <input class="form-check-input" type="checkbox" id="darkModeSwitch" 
                         [(ngModel)]="customColors.isDark">
                  <label class="form-check-label ms-2" for="darkModeSwitch">Activar Modo Oscuro Profundo</label>
                </div>
              </div>

              <div class="col-12 mt-4 text-start">
                <button class="btn btn-primary-grad w-100" (click)="applyCustom()">
                  Aplicar Cambios al Sistema
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="glass-card p-4 h-100">
            <h4 class="mb-4">Previsualización</h4>
            <div class="preview-box p-5 d-flex flex-column gap-3 align-items-center justify-content-center">
               <div class="preview-badge">MODO PREVIEW</div>
               <button class="btn btn-primary-grad px-5">Botón de Prueba</button>
               <div class="d-flex gap-2">
                 <div class="preview-dot primary"></div>
                 <div class="preview-dot secondary"></div>
               </div>
            </div>
            <p class="mt-4 text-center text-secondary small">
              Los cambios se aplican instantáneamente en todo el layout y componentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { background: var(--grad-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;
    }
    .theme-option {
      height: 60px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
      border: 2px solid transparent;
    }
    .theme-option:hover { transform: scale(1.05); }
    .theme-label { font-size: 0.7rem; font-weight: 700; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    
    .dark-picker {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      height: 45px;
    }
    
    .preview-box {
      background: rgba(0,0,0,0.2);
      border-radius: 20px;
      min-height: 200px;
      border: 1px dashed var(--glass-border);
    }
    .preview-badge {
      background: var(--grad-main);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 800;
    }
    .preview-dot { width: 20px; height: 20px; border-radius: 50%; }
    .preview-dot.primary { background: var(--accent-primary); }
    .preview-dot.secondary { background: var(--accent-secondary); }

    .btn-primary-grad {
      background: var(--grad-main);
      border: none;
      color: white;
      padding: 12px;
      border-radius: 12px;
      font-weight: 600;
      transition: var(--transition-smooth);
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .custom-switch .form-check-input {
      width: 3em;
      height: 1.5em;
      cursor: pointer;
    }
    .custom-switch .form-check-input:checked {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .dark-picker {
      background: var(--bg-surface);
      border: 1px solid var(--glass-border);
      height: 45px;
      border-radius: 10px;
    }
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
    // Initialize custom pickers with current theme
    const current = this.themeService.getTheme('modern_light');
    this.customColors = { ...current };
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
}
