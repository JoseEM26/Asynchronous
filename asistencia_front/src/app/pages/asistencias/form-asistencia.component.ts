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
    <div class="modal-backdrop animate-fade" (click)="onClose()">
      <div class="modal-container glass-card scale-in" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="h4 mb-0">Registrar Asistencia</h2>
          <button class="btn-close-modal" (click)="onClose()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Trabajador</label>
              <select formControlName="trabajadorId" class="form-input">
                <option [value]="null" disabled>Seleccione trabajador</option>
                <option *ngFor="let t of trabajadores" [value]="t.id">
                  {{ t.dni }} - {{ t.nombres }} {{ t.apellidos }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Modalidad</label>
              <div class="d-flex gap-2">
                <button type="button" *ngFor="let m of modalidades" 
                  class="btn-select flex-grow-1"
                  [class.active]="form.get('modalidadId')?.value === m.id"
                  (click)="form.get('modalidadId')?.setValue(m.id)">
                  {{ m.nombre }}
                </button>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Tipo de Marcación</label>
              <div class="d-flex gap-2">
                <button type="button" 
                  class="btn-select flex-grow-1"
                  [class.active]="form.get('tipo')?.value === 'ENTRADA'"
                  (click)="form.get('tipo')?.setValue('ENTRADA')">
                  Entrada
                </button>
                <button type="button" 
                  class="btn-select flex-grow-1"
                  [class.active]="form.get('tipo')?.value === 'SALIDA'"
                  (click)="form.get('tipo')?.setValue('SALIDA')">
                  Salida
                </button>
              </div>
            </div>

            <div class="col-12 mt-3">
              <div class="info-alert small">
                <span class="me-2">ℹ️</span>
                La fecha y hora se registrarán automáticamente según el servidor.
              </div>
            </div>
          </div>

          <div class="modal-footer mt-4">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Registrando...' : 'Confirmar Marcación' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);
      z-index: 1100; display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-container { width: 100%; max-width: 450px; background: var(--bg-surface); border: 1px solid var(--glass-border); }
    .scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05); }
    .btn-close-modal { background: none; border: none; font-size: 1.25rem; color: var(--text-secondary); cursor: pointer; }
    
    .form-label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
    .form-input { 
      width: 100%; padding: 10px 16px; border-radius: 12px; 
      border: 1.5px solid rgba(0,0,0,0.08); background: var(--bg-deep); 
      color: var(--text-primary); transition: var(--transition-smooth);
    }
    
    .btn-select {
      background: var(--bg-deep);
      border: 1.5px solid rgba(0,0,0,0.05);
      padding: 10px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: var(--transition-smooth);
    }
    .btn-select.active {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .info-alert {
      padding: 12px;
      background: rgba(99, 102, 241, 0.05);
      border-radius: 10px;
      color: var(--accent-primary);
      border-left: 3px solid var(--accent-primary);
    }

    .btn { padding: 10px 24px; border-radius: 12px; font-weight: 600; transition: var(--transition-smooth); border: none; }
    .btn-light { background: var(--bg-deep); color: var(--text-primary); }
    .btn-primary-grad { background: var(--grad-main); color: white; box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
    .btn-primary-grad:disabled { opacity: 0.6; cursor: not-allowed; }
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
