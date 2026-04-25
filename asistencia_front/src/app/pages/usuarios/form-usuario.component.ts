import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioRequest, UsuarioResponse } from '../../models/usuario.interface';
import { TrabajadorResponse } from '../../models/trabajador.interface';
import { TrabajadorService } from '../../services/trabajador.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()" style="max-width: 500px;">
        <header class="modal-header-base">
          <div class="d-flex align-items-center gap-3">
             <div class="header-icon-box" [class.bg-edit]="editData" [class.bg-new]="!editData">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
             </div>
             <h2 class="modal-title-base mb-0">{{ editData ? 'Configurar Acceso' : 'Nuevo Usuario' }}</h2>
          </div>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base">
            <div class="row g-4">
              <div class="col-12 form-field">
                <label class="form-label-base">Trabajador Vinculado</label>
                <select formControlName="trabajadorId" class="form-input-base" (change)="onWorkerChange()">
                  <option [value]="null" disabled>Seleccione un trabajador de la lista</option>
                  <option *ngFor="let t of trabajadores" [value]="t.id">
                    {{ t.dni }} — {{ t.nombres }} {{ t.apellidos }}
                  </option>
                </select>
                <div *ngIf="showError('trabajadorId')" class="form-error-base">Debe seleccionar un trabajador</div>
              </div>

              <div class="col-12 form-field">
                <label class="form-label-base">Nombre de Usuario</label>
                <div class="input-group-custom">
                  <span class="input-prefix">@</span>
                  <input type="text" formControlName="username" class="form-input-base" placeholder="ej: jsmith">
                </div>
                <div *ngIf="showError('username')" class="form-error-base">El nombre de usuario es obligatorio</div>
              </div>

              <!-- El Rol se hereda automáticamente del Trabajador -->
              <div class="col-12" *ngIf="selectedWorkerRole">
                 <div class="alert alert-info border-0 rounded-4 d-flex align-items-center gap-3 py-2 px-3 mb-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span class="small fw-bold text-info">Rol Heredado: {{ selectedWorkerRole }}</span>
                 </div>
              </div>

              <div class="col-12 form-field" *ngIf="!editData">
                <label class="form-label-base">Contraseña Inicial</label>
                <input type="password" formControlName="password" class="form-input-base" placeholder="Mínimo 6 caracteres">
                <div *ngIf="showError('password')" class="form-error-base">La contraseña es demasiado corta</div>
              </div>

              <div class="col-12" *ngIf="editData">
                <div class="info-note">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   <span>Las credenciales se gestionan de forma centralizada.</span>
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Guardando...' : (editData ? 'Actualizar Acceso' : 'Crear Usuario') }}
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
    .bg-new { background: var(--grad-main); }

    .btn-close-modal {
      background: none; border: none; color: var(--text-muted); cursor: pointer;
      display: flex; padding: 5px; border-radius: 6px; transition: var(--transition-fast);
    }
    .btn-close-modal:hover { background: var(--bg-deep); color: var(--accent-danger); }
    
    .input-group-custom { position: relative; display: flex; align-items: center; }
    .input-prefix { position: absolute; left: 12px; color: var(--text-muted); font-weight: 700; }
    .input-group-custom .form-input-base { padding-left: 30px; }

    .btn { padding: 0.6rem 1.25rem; border-radius: var(--border-radius-sm); font-weight: 600; font-size: 0.875rem; border: none; }
    .btn-light { background: #e2e8f0; color: #475569; }

    .info-note {
      display: flex; align-items: flex-start; gap: 8px; padding: 12px;
      background: var(--bg-deep); border-radius: 8px; color: var(--text-secondary); font-size: 0.8rem;
    }
  `]
})
export class FormUsuarioComponent implements OnInit {
  @Input() editData: UsuarioResponse | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UsuarioRequest>();

  form: FormGroup;
  trabajadores: TrabajadorResponse[] = [];
  selectedWorkerRole: string = '';

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService
  ) {
    this.form = this.fb.group({
      trabajadorId: [null, Validators.required],
      username: ['', Validators.required],
      rolId: [null, Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.cargarMetadata();
    if (this.editData) {
      this.form.patchValue({
        trabajadorId: this.editData.trabajador.id,
        username: this.editData.username,
        rolId: this.editData.rol.id
      });
      this.selectedWorkerRole = this.editData.rol.nombre;
      this.form.get('password')?.clearValidators();
      this.form.get('trabajadorId')?.disable();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  cargarMetadata(): void {
    this.trabajadorService.listar().subscribe(data => {
      this.trabajadores = data;
      // Si estamos editando, asegurar que mostramos el rol actual del trabajador
      if (this.editData) {
         this.onWorkerChange();
      }
    });
  }

  onWorkerChange(): void {
    const trabajadorId = this.form.get('trabajadorId')?.value;
    const worker = this.trabajadores.find(t => t.id == trabajadorId);
    if (worker) {
      this.form.patchValue({ rolId: worker.rolId });
      this.selectedWorkerRole = worker.rolNombre || 'Sin Rol';
    }
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
