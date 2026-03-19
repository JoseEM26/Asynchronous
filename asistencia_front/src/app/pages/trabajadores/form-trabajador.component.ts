import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadorRequest, TrabajadorResponse } from '../../models/trabajador.interface';

@Component({
  selector: 'app-form-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop animate-fade" (click)="onClose()">
      <div class="modal-container glass-card scale-in" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="h4 mb-0">{{ editData ? 'Editar Trabajador' : 'Nuevo Trabajador' }}</h2>
          <button class="btn-close-modal" (click)="onClose()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombres</label>
              <input type="text" formControlName="nombres" class="form-input" placeholder="Ej: Juan">
              <div *ngIf="showError('nombres')" class="error-msg">Requerido</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Apellidos</label>
              <input type="text" formControlName="apellidos" class="form-input" placeholder="Ej: Pérez">
              <div *ngIf="showError('apellidos')" class="error-msg">Requerido</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">DNI</label>
              <input type="text" formControlName="dni" class="form-input" placeholder="8 dígitos">
              <div *ngIf="showError('dni')" class="error-msg">Inválido (8 dígitos)</div>
            </div>
            <div class="col-md-8">
              <label class="form-label">Email</label>
              <input type="email" formControlName="email" class="form-input" placeholder="usuario@empresa.com">
              <div *ngIf="showError('email')" class="error-msg">Email inválido</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Teléfono</label>
              <input type="text" formControlName="telefono" class="form-input" placeholder="Ej: 987654321">
            </div>
            <div class="col-md-6">
              <label class="form-label">Área / Cargo</label>
              <input type="text" formControlName="direccion" class="form-input" placeholder="Ej: Sistemas">
            </div>
            <div class="col-12">
              <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" formControlName="activo" id="checkActivo">
                <label class="form-check-label" for="checkActivo">Trabajador Activo</label>
              </div>
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
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
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
      background: none;
      border: none;
      font-size: 1.25rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .btn-close-modal:hover { color: var(--text-primary); transform: rotate(90deg); }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-input {
      width: 100%;
      padding: 10px 16px;
      border-radius: 12px;
      border: 1.5px solid rgba(0,0,0,0.08);
      background: var(--bg-deep);
      color: var(--text-primary);
      transition: var(--transition-smooth);
    }
    .form-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .error-msg {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 4px;
    }

    .btn {
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 600;
      transition: var(--transition-smooth);
      border: none;
    }
    .btn-light { background: var(--bg-deep); color: var(--text-primary); }
    .btn-light:hover { background: rgba(0,0,0,0.05); }

    .btn-primary-grad {
      background: var(--grad-main);
      color: white;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-primary-grad:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5); }
    .btn-primary-grad:disabled { opacity: 0.6; cursor: not-allowed; }

    [data-theme='dark'] .form-input {
      border-color: rgba(255,255,255,0.1);
    }
  `]
})
export class FormTrabajadorComponent implements OnInit {
  @Input() editData: TrabajadorResponse | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TrabajadorRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.editData) {
      this.form.patchValue(this.editData);
    }
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
