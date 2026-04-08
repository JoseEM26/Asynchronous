import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunicadoRequest, ComunicadoResponse } from '../../models/comunicado.interface';

@Component({
  selector: 'app-form-comunicado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()">
        <header class="modal-header-base">
          <div class="d-flex align-items-center gap-3">
             <div class="header-icon-box" [class.bg-edit]="editData" [class.bg-new]="!editData">
               <svg *ngIf="editData" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
               <svg *ngIf="!editData" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </div>
             <h2 class="modal-title-base mb-0">
               {{ editData ? 'Editar Comunicado' : 'Nuevo Comunicado' }}
             </h2>
          </div>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base custom-scrollbar">
            
            <div class="form-section mb-4">
              <h6 class="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Contenido del Aviso
              </h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label-base">Título</label>
                  <input type="text" formControlName="titulo" class="form-input-base" [class.is-invalid]="showError('titulo')" placeholder="Ej: Mantenimiento de Servidores">
                  <div *ngIf="showError('titulo')" class="form-error-base">El título es obligatorio</div>
                </div>
                <div class="col-12">
                  <label class="form-label-base">Mensaje / Detalle</label>
                  <textarea formControlName="contenido" class="form-input-base" rows="5" [class.is-invalid]="showError('contenido')" placeholder="Escriba el detalle del comunicado..."></textarea>
                  <div *ngIf="showError('contenido')" class="form-error-base">El contenido no puede estar vacío</div>
                </div>
              </div>
            </div>

            <div class="form-section mb-4">
              <h6 class="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Configuración y Vigencia
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label-base">Tipo de Comunicado</label>
                  <select formControlName="tipo" class="form-input-base">
                    <option value="INFO">Información General</option>
                    <option value="ALERTA">Alerta / Importante</option>
                    <option value="URGENTE">Urgente / Crítico</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label-base">Fecha de Expiración</label>
                  <input type="date" formControlName="fechaExpiracion" class="form-input-base">
                  <small class="text-muted">Dejar vacío si no expira hoy.</small>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" formControlName="activo" id="flexSwitchCheckDefault">
                    <label class="form-check-label fw-bold" for="flexSwitchCheckDefault">Comunicado Activo y Visible</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="isLoading || form.invalid">
              {{ isLoading ? 'Procesando...' : (editData ? 'Guardar Cambios' : 'Publicar Comunicado') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .header-icon-box {
      width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white;
    }
    .bg-edit { background: var(--accent-primary); }
    .bg-new { background: #10b981; }

    .btn-close-modal { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 5px; border-radius: 6px; transition: var(--transition-fast); display: flex; }
    .btn-close-modal:hover { background: var(--bg-deep); color: var(--accent-danger); }
    .btn { padding: 0.6rem 1.25rem; border-radius: var(--border-radius-sm); font-weight: 600; font-size: 0.875rem; transition: var(--transition-fast); border: none; }
    .btn-light { background: #e2e8f0; color: #475569; }
    .btn-light:hover { background: #cbd5e1; }
    
    .form-section { position: relative; }
    .section-title { 
      font-size: 0.85rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase; 
      letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }

    .form-error-base { color: #ef4444; font-size: 0.75rem; margin-top: 4px; font-weight: 500; }
    .custom-scrollbar { max-height: 70vh; overflow-y: auto; padding-right: 8px; }
  `]
})
export class FormComunicadoComponent implements OnInit {
  @Input() editData: ComunicadoResponse | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ComunicadoRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.minLength(5)]],
      tipo: ['INFO', Validators.required],
      fechaExpiracion: [null],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.editData) {
      const data = { ...this.editData };
      if (data.fechaExpiracion) {
        data.fechaExpiracion = data.fechaExpiracion.split('T')[0];
      }
      this.form.patchValue(data);
    }
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose() {
    this.close.emit();
  }
}
