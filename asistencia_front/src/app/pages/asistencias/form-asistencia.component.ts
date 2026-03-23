import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsistenciaRequest, AsistenciaResponse } from '../../models/asistencia.interface';
import { TrabajadorResponse } from '../../models/trabajador.interface';
import { ModalidadResponse } from '../../models/modalidad.interface';
import { TrabajadorService } from '../../services/trabajador.service';
import { ModalidadService } from '../../services/modalidad.service';

@Component({
  selector: 'app-form-asistencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()" style="max-width: 480px;">
        <header class="modal-header-base">
          <h2 class="modal-title-base">Registrar Nueva Asistencia</h2>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base">
            <div class="row g-4">
              <div class="col-12 form-field">
                <label class="form-label-base">Seleccionar Trabajador</label>
                <select formControlName="trabajadorId" class="form-input-base">
                  <option [value]="null" disabled>Desfina el colaborador</option>
                  <option *ngFor="let t of trabajadores" [value]="t.id">
                    {{ t.dni }} — {{ t.nombres }} {{ t.apellidos }}
                  </option>
                </select>
              </div>

              <div class="col-12 form-field">
                <label class="form-label-base">Modalidad de Trabajo</label>
                <div class="selector-grid">
                  <button type="button" *ngFor="let m of modalidades" 
                    class="selector-opt"
                    [class.active]="form.get('modalidadId')?.value === m.id"
                    (click)="form.get('modalidadId')?.setValue(m.id)">
                    {{ m.nombre }}
                  </button>
                </div>
              </div>

              <div class="col-12 form-field">
                <label class="form-label-base">Tipo de Marcación</label>
                <div class="selector-grid">
                  <button type="button" 
                    class="selector-opt"
                    [class.active]="form.get('tipo')?.value === 'ENTRADA'"
                    (click)="form.get('tipo')?.setValue('ENTRADA')">
                    <span class="dot" style="background: #10b981;"></span>
                    Entrada
                  </button>
                  <button type="button" 
                    class="selector-opt"
                    [class.active]="form.get('tipo')?.value === 'SALIDA'"
                    (click)="form.get('tipo')?.setValue('SALIDA')">
                    <span class="dot" style="background: #ef4444;"></span>
                    Salida
                  </button>
                </div>
              </div>

              <div class="col-12">
                <div class="server-info">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-50"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                   <span>El registro usará la estampa de tiempo oficial del servidor corporativo.</span>
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Enviando...' : 'Confirmar Registro' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .btn-close-modal {
      background: none; border: none; color: var(--text-muted); cursor: pointer;
      display: flex; padding: 5px; border-radius: 6px; transition: var(--transition-fast);
    }
    .btn-close-modal:hover { background: var(--bg-deep); color: var(--accent-danger); }

    .selector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    
    .selector-opt {
      background: var(--bg-surface);
      border: 1.5px solid var(--glass-border);
      padding: 12px;
      border-radius: var(--border-radius-sm);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .selector-opt.active {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    .dot { width: 8px; height: 8px; border-radius: 50%; }

    .server-info {
      display: flex; align-items: center; gap: 10px; padding: 12px;
      background: rgba(37, 99, 235, 0.05); border-radius: 8px;
      color: var(--accent-primary); font-size: 0.75rem; font-weight: 500;
    }

    .btn { padding: 0.6rem 1.25rem; border-radius: var(--border-radius-sm); font-weight: 600; font-size: 0.875rem; border: none; }
    .btn-light { background: #e2e8f0; color: #475569; }
  `]

})
export class FormAsistenciaComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AsistenciaRequest>();

  form: FormGroup;
  trabajadores: TrabajadorResponse[] = [];
  modalidades: ModalidadResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private modalidadService: ModalidadService
  ) {
    this.form = this.fb.group({
      trabajadorId: [null, Validators.required],
      modalidadId: [null, Validators.required],
      tipo: ['ENTRADA', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarMetadata();
  }

  cargarMetadata(): void {
    this.trabajadorService.listar().subscribe(data => this.trabajadores = data);
    this.modalidadService.listar().subscribe(data => this.modalidades = data);
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
