import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadorRequest, TrabajadorResponse } from '../../models/trabajador.interface';
import { ModalidadService } from '../../services/modalidad.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { RolService } from '../../services/rol.service';
import { ModalidadResponse } from '../../models/modalidad.interface';
import { RolResponse } from '../../models/rol.interface';

@Component({
  selector: 'app-form-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()">
        <header class="modal-header-base">
          <h2 class="modal-title-base">
            {{ isReadOnly ? 'Detalle del Trabajador' : (editData ? 'Editar Trabajador' : 'Nuevo Trabajador') }}
          </h2>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base">
            <div class="row g-4">
              <!-- Datos Personales -->
              <div class="col-md-6 form-field">
                <label class="form-label-base">Nombres</label>
                <input type="text" formControlName="nombres" class="form-input-base" [class.is-invalid]="showError('nombres')" placeholder="Ej: Juan">
                <div *ngIf="showError('nombres')" class="form-error-base">El nombre es obligatorio</div>
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Apellidos</label>
                <input type="text" formControlName="apellidos" class="form-input-base" [class.is-invalid]="showError('apellidos')" placeholder="Ej: Pérez">
                <div *ngIf="showError('apellidos')" class="form-error-base">El apellido es obligatorio</div>
              </div>
              <div class="col-md-4 form-field">
                <label class="form-label-base">DNI</label>
                <input type="text" 
                       formControlName="dni" 
                       class="form-input-base" 
                       [class.is-invalid]="showError('dni')" 
                       placeholder="8 dígitos"
                       maxlength="8"
                       (keypress)="onlyNumbers($event)">
                <div *ngIf="showError('dni')" class="form-error-base">DNI inválido (8 números)</div>
              </div>
              <div class="col-md-8 form-field">
                <label class="form-label-base">Email Corporativo</label>
                <input type="email" formControlName="email" class="form-input-base" [class.is-invalid]="showError('email')" placeholder="usuario@ejemplo.com">
                <div *ngIf="showError('email')" class="form-error-base">Ingrese un email válido</div>
              </div>

              <!-- Configuración de Modalidad -->
              <div class="col-12 mt-2">
                <div class="modality-config-panel p-3 rounded-4 border" [class.highlight]="form.get('modalidadId')?.valid">
                  <h6 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    Esquema de Trabajo y Jornada
                  </h6>
                  <div class="row g-3">
                    <div class="col-md-6 form-field">
                      <label class="form-label-base">Categoría de Asistencia</label>
                      <select formControlName="modalidadId" class="form-input-base" [class.is-invalid]="showError('modalidadId')">
                        <option [ngValue]="null" disabled selected>Seleccione modalidad...</option>
                        <option *ngFor="let mod of modalidades" [value]="mod.id">{{ mod.nombre }}</option>
                      </select>
                      <div *ngIf="showError('modalidadId')" class="form-error-base">Seleccione una modalidad</div>
                    </div>

                    <!-- Selector Triple de Días -->
                    <div class="col-12 animate-fade" *ngIf="form.get('modalidadId')?.value && form.get('modalidadId')?.value != 5">
                      <label class="form-label-base mb-3">Definición de Jornada Semanal</label>
                      <div class="days-selector-grid-enhanced">
                        <div *ngFor="let day of DAYS" class="day-card" [ngClass]="getDayClass(day)">
                          <span class="day-name">{{ day }}</span>
                          <div class="state-buttons-triple">
                            <button type="button" class="btn-triple ofc" [class.active]="getDayState(day) === 'OFC'" (click)="!isReadOnly && setDayState(day, 'OFC')" [disabled]="isReadOnly">OFC</button>
                            <button type="button" class="btn-triple rem" [class.active]="getDayState(day) === 'REM'" (click)="!isReadOnly && setDayState(day, 'REM')" [disabled]="isReadOnly">REM</button>
                            <button type="button" class="btn-triple lib" [class.active]="getDayState(day) === 'LIB'" (click)="!isReadOnly && setDayState(day, 'LIB')" [disabled]="isReadOnly">LIB</button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Weekly Summary -->
                      <div class="mt-3 p-3 bg-white rounded-3 border-start border-primary border-4 shadow-sm">
                        <p class="mb-1 text-muted small d-flex align-items-center gap-2">
                           <span class="badge bg-primary text-white">Oficina/Presencial</span> 
                           <b class="text-dark">{{ selectedPresencial.length > 0 ? selectedPresencial.join(', ') : 'Ninguno' }}</b>
                        </p>
                        <p class="mb-1 text-muted small d-flex align-items-center gap-2">
                           <span class="badge bg-secondary text-white">Remoto/Virtual</span> 
                           <b class="text-dark">{{ selectedRemoto.length > 0 ? selectedRemoto.join(', ') : 'Ninguno' }}</b>
                        </p>
                        <p class="mb-0 text-muted small d-flex align-items-center gap-2">
                           <span class="badge bg-light text-dark border">No Labora/Libre</span> 
                           <b class="text-dark">{{ getLibreDays().length > 0 ? getLibreDays().join(', ') : 'Ninguno' }}</b>
                        </p>
                      </div>
                    </div>

                    <!-- Mensaje para Exento -->
                    <div class="col-12 animate-fade" *ngIf="form.get('modalidadId')?.value == 5">
                       <div class="alert alert-info border-0 shadow-sm rounded-4 d-flex align-items-center gap-3">
                         <div class="icon-circle bg-info text-white">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                         </div>
                         <div>
                           <h6 class="mb-1 fw-bold">Modalidad Exenta</h6>
                           <p class="mb-0 small opacity-75">Esta persona no requiere configuración de jornada semanal ni marcación de asistencia.</p>
                         </div>
                       </div>
                    </div>

                    <!-- Condicional para Terreno -->
                    <div class="col-md-11 animate-fade" *ngIf="form.get('modalidadId')?.value == 4">
                       <label class="d-flex align-items-center gap-2 cursor-pointer pb-2">
                          <input type="checkbox" formControlName="esJefeTerreno" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                          <span class="form-label-base mb-0" style="text-transform: none;">Este trabajador es <b>Jefe de Terreno</b></span>
                       </label>

                       <!-- Asignación de Jefe -->
                       <div class="mt-2" *ngIf="!form.get('esJefeTerreno')?.value">
                         <label class="form-label-base">Grupo / Jefe de Terreno</label>
                         <select formControlName="jefeId" class="form-input-base" [class.is-invalid]="showError('jefeId')">
                           <option [ngValue]="null" disabled>Seleccione líder del grupo...</option>
                           <option *ngFor="let jefe of jefesTerreno" [value]="jefe.id">
                             {{ jefe.nombres }} {{ jefe.apellidos }}
                           </option>
                         </select>
                         <div *ngIf="showError('jefeId')" class="form-error-base">Debe asignar un líder de grupo</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 form-field">
                <label class="form-label-base">Teléfono</label>
                <input type="text" formControlName="telefono" class="form-input-base" [class.is-invalid]="showError('telefono')" placeholder="Ej: 987654321">
                <div *ngIf="showError('telefono')" class="form-error-base">Formato de teléfono inválido</div>
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Rol / Cargo del Sistema</label>
                <select formControlName="rolId" class="form-input-base" [class.is-invalid]="showError('rolId')">
                  <option [ngValue]="null" disabled selected>Seleccione un rol...</option>
                  <option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</option>
                </select>
                <div *ngIf="showError('rolId')" class="form-error-base">Debe asignar un rol de acceso</div>
              </div>
            </div>
          </div>

          <footer class="modal-footer-base" *ngIf="!isReadOnly">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="isLoading">
              {{ isLoading ? 'Procesando...' : (editData ? 'Actualizar Datos' : 'Registrar Trabajador') }}
            </button>
          </footer>
          <footer class="modal-footer-base" *ngIf="isReadOnly">
            <button type="button" class="btn btn-primary-grad px-5 shadow-sm" (click)="onClose()">Entendido, Cerrar Detalle</button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .btn-close-modal { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 5px; border-radius: 6px; transition: var(--transition-fast); display: flex; }
    .btn-close-modal:hover { background: var(--bg-deep); color: var(--accent-danger); }
    .btn { padding: 0.6rem 1.25rem; border-radius: var(--border-radius-sm); font-weight: 600; font-size: 0.875rem; transition: var(--transition-fast); border: none; }
    .btn-light { background: #e2e8f0; color: #475569; }
    .btn-light:hover { background: #cbd5e1; }
    .form-error-base { color: #ef4444; font-size: 0.75rem; margin-top: 4px; font-weight: 500; }
    .modality-config-panel { background: #f8fafc; transition: all 0.3s ease; }
    .modality-config-panel.highlight { border-color: rgba(37, 99, 235, 0.2); background: rgba(37, 99, 235, 0.01); }
    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .days-selector-grid-enhanced {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 10px;
    }
    .day-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s;
    }
    .day-card.card-ofc { border-color: #3b82f6; background: #eff6ff; }
    .day-card.card-rem { border-color: #64748b; background: #f8fafc; }
    .day-card.card-lib { border-color: #e2e8f0; opacity: 0.7; }
    
    .day-name { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; }
    .card-ofc .day-name { color: #3b82f6; }
    
    .state-buttons-triple { display: flex; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .btn-triple {
      flex: 1;
      border: none;
      padding: 6px 2px;
      font-size: 0.65rem;
      font-weight: 700;
      cursor: pointer;
      background: #f8fafc;
      color: #94a3b8;
      transition: all 0.2s;
    }
    .btn-triple.ofc.active { background: #3b82f6; color: white; }
    .btn-triple.rem.active { background: #64748b; color: white; }
    .btn-triple.lib.active { background: #cbd5e1; color: #475569; }
    .btn-triple:not(.active):hover:not(:disabled) { background: #f1f5f9; }
    .btn-triple:disabled { cursor: default; }

    .icon-circle {
      width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
  `]
})
export class FormTrabajadorComponent implements OnInit {
  @Input() editData: TrabajadorResponse | null = null;
  @Input() isLoading: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TrabajadorRequest>();

  form: FormGroup;
  modalidades: ModalidadResponse[] = [];
  jefesTerreno: TrabajadorResponse[] = [];
  roles: RolResponse[] = [];
  
  readonly DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedPresencial: string[] = [];
  selectedRemoto: string[] = [];

  constructor(
    private fb: FormBuilder,
    private modalidadService: ModalidadService,
    private trabajadorService: TrabajadorService,
    private rolService: RolService
  ) {
    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9+ ]{7,15}$')]],
      direccion: [''],
      rolId: [null, Validators.required],
      activo: [true],
      modalidadId: [null, Validators.required],
      esJefeTerreno: [false],
      jefeId: [null],
      diasPresencial: [''],
      diasRemotos: ['']
    });

    this.form.get('modalidadId')?.valueChanges.subscribe(() => {
      this.updateDynamicValidators();
    });

    this.form.get('esJefeTerreno')?.valueChanges.subscribe(() => {
      this.updateDynamicValidators();
    });
  }

  ngOnInit(): void {
    this.loadModalidades();
    this.loadJefes();
    this.loadRoles();
    if (this.editData) {
      if (this.editData.diasPresencial) {
        this.selectedPresencial = this.editData.diasPresencial.split(',').map(d => d.trim()).filter(d => d);
      }
      if (this.editData.diasRemotos) {
        this.selectedRemoto = this.editData.diasRemotos.split(',').map(d => d.trim()).filter(d => d);
      }
      
      // Mapeo perfecto usando los IDs directos del backend
      this.form.patchValue(this.editData);
      this.updateDynamicValidators();
    }

    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  private updateDynamicValidators() {
    if (this.isReadOnly) return;
    const val = this.form.get('modalidadId')?.value;
    const esJefe = this.form.get('esJefeTerreno')?.value;
    const jefeCtrl = this.form.get('jefeId');
    
    if (val == 4 && !esJefe) {
      jefeCtrl?.setValidators([Validators.required]);
    } else {
      jefeCtrl?.clearValidators();
    }
    jefeCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  loadModalidades(): void {
    this.modalidadService.listar().subscribe({
      next: (data) => this.modalidades = data,
      error: (err) => console.error('Error cargando modalidades', err)
    });
  }

  loadRoles(): void {
    this.rolService.listar().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  loadJefes(): void {
    this.trabajadorService.listar().subscribe({
      next: (data) => {
        this.jefesTerreno = data.filter(t => t.esJefeTerreno && t.id !== this.editData?.id);
      },
      error: (err) => console.error('Error cargando jefes', err)
    });
  }

  getDayState(day: string): string {
    if (this.selectedPresencial.includes(day)) return 'OFC';
    if (this.selectedRemoto.includes(day)) return 'REM';
    return 'LIB';
  }

  setDayState(day: string, state: string): void {
    if (this.isReadOnly) return;
    this.selectedPresencial = this.selectedPresencial.filter(d => d !== day);
    this.selectedRemoto = this.selectedRemoto.filter(d => d !== day);

    if (state === 'OFC') this.selectedPresencial.push(day);
    else if (state === 'REM') this.selectedRemoto.push(day);
    
    this.form.get('diasPresencial')?.setValue(this.selectedPresencial.join(', '));
    this.form.get('diasRemotos')?.setValue(this.selectedRemoto.join(', '));
  }

  getDayClass(day: string): any {
    const state = this.getDayState(day);
    return {
      'card-ofc': state === 'OFC',
      'card-rem': state === 'REM',
      'card-lib': state === 'LIB'
    };
  }

  getLibreDays(): string[] {
    return this.DAYS.filter(d => !this.selectedPresencial.includes(d) && !this.selectedRemoto.includes(d));
  }

  getWorkingDaysCount(): number {
    return this.selectedPresencial.length + this.selectedRemoto.length;
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.isReadOnly) return;

    if (this.form.get('modalidadId')?.value == 5) {
      this.selectedPresencial = [];
      this.selectedRemoto = [];
    }

    const finalPresencial = this.DAYS.filter(d => this.selectedPresencial.includes(d)).join(', ');
    const finalRemoto = this.DAYS.filter(d => this.selectedRemoto.includes(d)).join(', ');

    if (this.form.valid) {
      const payload = { 
        ...this.form.getRawValue(),
        diasPresencial: finalPresencial,
        diasRemotos: finalRemoto
      };
      if (payload.modalidadId) payload.modalidadId = Number(payload.modalidadId);
      this.save.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
