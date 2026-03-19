import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioRequest, UsuarioResponse } from '../../models/usuario.interface';
import { TrabajadorResponse } from '../../models/trabajador.interface';
import { RolResponse } from '../../models/rol.interface';
import { TrabajadorService } from '../../services/trabajador.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop animate-fade" (click)="onClose()">
      <div class="modal-container glass-card scale-in" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="h4 mb-0">{{ editData ? 'Editar Acceso' : 'Nuevo Acceso' }}</h2>
          <button class="btn-close-modal" (click)="onClose()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Trabajador</label>
              <select formControlName="trabajadorId" class="form-input">
                <option [value]="null" disabled>Seleccione un trabajador</option>
                <option *ngFor="let t of trabajadores" [value]="t.id">
                  {{ t.dni }} - {{ t.nombres }} {{ t.apellidos }}
                </option>
              </select>
              <div *ngIf="showError('trabajadorId')" class="error-msg">Requerido</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Nombre de Usuario</label>
              <input type="text" formControlName="username" class="form-input" placeholder="Ej: jpererz">
              <div *ngIf="showError('username')" class="error-msg">Requerido</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Rol de Sistema</label>
              <select formControlName="rolId" class="form-input">
                <option [value]="null" disabled>Seleccione un rol</option>
                <option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</option>
              </select>
              <div *ngIf="showError('rolId')" class="error-msg">Requerido</div>
            </div>

            <div class="col-12" *ngIf="!editData">
              <label class="form-label">Contraseña</label>
              <input type="password" formControlName="password" class="form-input" placeholder="••••••••">
              <div *ngIf="showError('password')" class="error-msg">Mínimo 6 caracteres</div>
            </div>

            <div class="col-12" *ngIf="editData">
              <p class="small text-secondary mb-0">Para cambiar la contraseña, usa la opción de recuperación.</p>
            </div>
          </div>

          <div class="modal-footer mt-4">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-container {
      width: 100%;
      max-width: 500px;
      background: var(--bg-surface);
      border: 1px solid var(--glass-border);
    }

    .scale-in {
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-body { padding: 1.5rem; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .btn-close-modal {
      background: none; border: none; font-size: 1.25rem; color: var(--text-secondary); cursor: pointer;
    }

    .form-label {
      display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);
    }

    .form-input {
      width: 100%; padding: 10px 16px; border-radius: 12px;
      border: 1.5px solid rgba(0,0,0,0.08); background: var(--bg-deep);
      color: var(--text-primary); transition: var(--transition-smooth);
    }
    .form-input:focus {
      outline: none; border-color: var(--accent-primary);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 4px; }

    .btn { padding: 10px 24px; border-radius: 12px; font-weight: 600; transition: var(--transition-smooth); border: none; }
    .btn-light { background: var(--bg-deep); color: var(--text-primary); }

    .btn-primary-grad {
      background: var(--grad-main); color: white;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-primary-grad:disabled { opacity: 0.6; cursor: not-allowed; }

    [data-theme='dark'] .form-input { border-color: rgba(255,255,255,0.1); }
  `]
})
export class FormUsuarioComponent implements OnInit {
  @Input() editData: UsuarioResponse | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UsuarioRequest>();

  form: FormGroup;
  trabajadores: TrabajadorResponse[] = [];
  roles: RolResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private rolService: RolService
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
      this.form.get('password')?.clearValidators();
      this.form.get('trabajadorId')?.disable(); // No se cambia el trabajador de un usuario existente
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  cargarMetadata(): void {
    this.trabajadorService.listar().subscribe(data => this.trabajadores = data);
    this.rolService.listar().subscribe(data => this.roles = data);
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Si está deshabilitado, getRawValue lo incluye
      this.save.emit(this.form.getRawValue());
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
