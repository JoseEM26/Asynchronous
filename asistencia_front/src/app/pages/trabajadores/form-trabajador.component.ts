import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadorRequest, TrabajadorResponse } from '../../models/trabajador.interface';

@Component({
  selector: 'app-form-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()">
        <header class="modal-header-base">
          <h2 class="modal-title-base">{{ editData ? 'Editar Trabajador' : 'Nuevo Trabajador' }}</h2>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base">
            <div class="row g-4">
              <div class="col-md-6 form-field">
                <label class="form-label-base">Nombres</label>
                <input type="text" formControlName="nombres" class="form-input-base" placeholder="Ej: Juan">
                <div *ngIf="showError('nombres')" class="form-error-base">Este campo es requerido</div>
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Apellidos</label>
                <input type="text" formControlName="apellidos" class="form-input-base" placeholder="Ej: Pérez">
                <div *ngIf="showError('apellidos')" class="form-error-base">Este campo es requerido</div>
              </div>
              <div class="col-md-4 form-field">
                <label class="form-label-base">DNI</label>
                <input type="text" formControlName="dni" class="form-input-base" placeholder="8 dígitos">
                <div *ngIf="showError('dni')" class="form-error-base">DNI inválido (8 números)</div>
              </div>
              <div class="col-md-8 form-field">
                <label class="form-label-base">Email Personal / Corporativo</label>
                <input type="email" formControlName="email" class="form-input-base" placeholder="usuario@ejemplo.com">
                <div *ngIf="showError('email')" class="form-error-base">Ingrese un email válido</div>
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Teléfono de contacto</label>
                <input type="text" formControlName="telefono" class="form-input-base" placeholder="Ej: 987654321">
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Área o Departamento</label>
                <input type="text" formControlName="direccion" class="form-input-base" placeholder="Ej: Operaciones">
              </div>
              <div class="col-12">
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="activo" class="form-check-input mt-0" style="width: 18px; height: 18px;">
                  <span class="form-label-base mb-0" style="text-transform: none;">Trabajador con acceso activo</span>
                </label>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Procesando...' : (editData ? 'Actualizar Datos' : 'Registrar Trabajador') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .btn-close-modal {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      transition: var(--transition-fast);
      display: flex;
    }
    .btn-close-modal:hover {
      background: var(--bg-deep);
      color: var(--accent-danger);
    }
    .btn {
       padding: 0.6rem 1.25rem;
       border-radius: var(--border-radius-sm);
       font-weight: 600;
       font-size: 0.875rem;
       transition: var(--transition-fast);
       border: none;
    }
    .btn-light { background: #e2e8f0; color: #475569; }
    .btn-light:hover { background: #cbd5e1; }
    .cursor-pointer { cursor: pointer; }
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
