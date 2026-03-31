import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsistenciaRequest } from '../../models/asistencia.interface';
import { TrabajadorResponse } from '../../models/trabajador.interface';
import { ModalidadResponse } from '../../models/modalidad.interface';
import { TrabajadorService } from '../../services/trabajador.service';
import { ModalidadService } from '../../services/modalidad.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-asistencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()" style="max-width: 500px;">
        <header class="modal-header-base">
          <div class="d-flex align-items-center gap-2">
            <div class="icon-circle bg-soft-primary text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h2 class="modal-title-base">Registro Administrativo</h2>
          </div>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base">
            <div class="row g-4">
              <!-- Selección de Trabajador -->
              <div class="col-12 form-field">
                <label class="form-label-base">Colaborador</label>
                <select formControlName="trabajadorId" class="form-input-base" [class.is-valid]="form.get('trabajadorId')?.valid">
                  <option [ngValue]="null" disabled>Seleccione un trabajador...</option>
                  <option *ngFor="let t of trabajadores" [value]="t.id">
                    {{ t.dni }} — {{ t.nombres }} {{ t.apellidos }}
                  </option>
                </select>
                <div *ngIf="showError('trabajadorId')" class="form-error-base">Debe seleccionar un trabajador</div>
              </div>

              <!-- Fecha y Hora Manual -->
              <div class="col-12 form-field">
                <label class="form-label-base">Fecha y Hora del Suceso</label>
                <div class="input-with-icon">
                   <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                   <input type="datetime-local" formControlName="fechaHoraManual" class="form-input-base ps-5">
                </div>
                <small class="text-muted mt-1 d-block">Indique el momento exacto en que ocurrió la marcación.</small>
              </div>

              <!-- Modalidad Automática (Read Only Info) -->
              <div class="col-12 animate-fade" *ngIf="selectedWorker">
                <div class="p-3 rounded-4 border bg-light d-flex align-items-center justify-content-between">
                   <div class="d-flex align-items-center gap-3">
                      <div class="icon-box-small bg-white shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </div>
                      <div>
                        <span class="d-block extra-small text-muted text-uppercase fw-bold">Modalidad Detectada</span>
                        <span class="fw-bold text-dark">{{ selectedWorker.modalidadNombre || 'No definida' }}</span>
                      </div>
                   </div>
                   <span class="badge bg-soft-primary text-primary border-primary border opacity-75">AUTO</span>
                </div>
              </div>

              <div class="col-12 form-field">
                <label class="form-label-base">Tipo de Marcación</label>
                <div class="selector-grid">
                  <button type="button" 
                    class="selector-opt"
                    [class.active]="form.get('tipo')?.value === 'ENTRADA'"
                    (click)="form.get('tipo')?.setValue('ENTRADA')">
                    <div class="status-marker bg-success"></div>
                    Entrada
                  </button>
                  <button type="button" 
                    class="selector-opt"
                    [class.active]="form.get('tipo')?.value === 'SALIDA'"
                    (click)="form.get('tipo')?.setValue('SALIDA')">
                    <div class="status-marker bg-danger"></div>
                    Salida
                  </button>
                </div>
              </div>

              <div class="col-12 form-field">
                <label class="form-label-base">Notas Adicionales (Opcional)</label>
                <textarea formControlName="notas" class="form-input-base" rows="2" placeholder="Motivo del registro manual..."></textarea>
              </div>

              <div class="col-12">
                <div class="alert-info-mini p-3 rounded-4 d-flex gap-3">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   <p class="mb-0 small">Este registro se guardará con coordenadas <b>(0,0)</b> al ser una entrada administrativa manual.</p>
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="form.invalid || isLoading">
              <svg *ngIf="!isLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {{ isLoading ? 'Procesando...' : 'Guardar Registro' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .icon-circle { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .bg-soft-primary { background: rgba(37, 99, 235, 0.1); }
    .icon-box-small { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .extra-small { font-size: 0.65rem; }
    
    .input-with-icon { position: relative; }
    .field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--accent-primary); opacity: 0.6; }
    
    .selector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .selector-opt {
      border: 1.5px solid var(--glass-border); padding: 14px; border-radius: 12px;
      font-weight: 700; color: var(--text-secondary); transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 10px; background: white;
    }
    .selector-opt.active {
      background: var(--bg-deep); border-color: var(--accent-primary); color: var(--accent-primary);
      box-shadow: var(--shadow-sm);
    }
    .status-marker { width: 8px; height: 8px; border-radius: 50%; }
    
    .alert-info-mini { background: #f0f9ff; border: 1px solid #e0f2fe; color: #0369a1; }
    .btn-primary-grad { background: var(--grad-main); border: none; color: white; border-radius: 12px; font-weight: 700; }
    .form-error-base { color: #ef4444; font-size: 0.75rem; margin-top: 4px; }
  `]
})
export class FormAsistenciaComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AsistenciaRequest>();

  form: FormGroup;
  trabajadores: TrabajadorResponse[] = [];
  selectedWorker: TrabajadorResponse | null = null;
  private sub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService
  ) {
    // Inicializamos con la hora local actual en formato ISO para el datetime-local
    const now = new Date();
    const localISO = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    this.form = this.fb.group({
      trabajadorId: [null, Validators.required],
      modalidadId: [null, Validators.required],
      fechaHoraManual: [localISO, Validators.required],
      tipo: ['ENTRADA', Validators.required],
      notas: [''],
      latitud: [0],
      longitud: [0]
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();

    // Escuchamos cambios en el trabajador para automatizar la modalidad
    this.sub = this.form.get('trabajadorId')?.valueChanges.subscribe(id => {
      this.autoUpdateModality(Number(id));
    }) || null;
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  cargarTrabajadores(): void {
    this.trabajadorService.listar().subscribe(data => this.trabajadores = data);
  }

  autoUpdateModality(workerId: number): void {
    this.selectedWorker = this.trabajadores.find(t => t.id === workerId) || null;
    if (this.selectedWorker) {
      this.form.patchValue({
        modalidadId: this.selectedWorker.modalidadId
      });
    }
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
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
