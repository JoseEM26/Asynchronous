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
          <div class="d-flex align-items-center gap-3">
             <div class="header-icon-box" [class.bg-edit]="editData" [class.bg-new]="!editData">
               <svg *ngIf="editData" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
               <svg *ngIf="!editData" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </div>
             <h2 class="modal-title-base mb-0">
               {{ editData ? 'Editar Trabajador' : 'Nuevo Registro de Personal' }}
             </h2>
          </div>
          <button class="btn-close-modal" (click)="onClose()" aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base custom-scrollbar">
            
            <!-- SECCIÓN 1: DATOS PERSONALES -->
            <div class="form-section mb-4">
              <h6 class="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Información Personal
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label-base">Nombres</label>
                  <input type="text" formControlName="nombres" class="form-input-base" [class.is-invalid]="showError('nombres')" placeholder="Ej: Juan">
                  <div *ngIf="showError('nombres')" class="form-error-base">El nombre es obligatorio</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label-base">Apellidos</label>
                  <input type="text" formControlName="apellidos" class="form-input-base" [class.is-invalid]="showError('apellidos')" placeholder="Ej: Pérez">
                  <div *ngIf="showError('apellidos')" class="form-error-base">El apellido es obligatorio</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label-base">DNI</label>
                  <input type="text" formControlName="dni" class="form-input-base" [class.is-invalid]="showError('dni')" placeholder="8 dígitos" maxlength="8" (keypress)="onlyNumbers($event)">
                  <div *ngIf="showError('dni')" class="form-error-base">8 dígitos numéricos</div>
                </div>
                <div class="col-md-8">
                  <label class="form-label-base">Email Corporativo</label>
                  <input type="email" formControlName="email" class="form-input-base" [class.is-invalid]="showError('email')" placeholder="usuario@ejemplo.com">
                  <div *ngIf="showError('email')" class="form-error-base">Ingrese un email válido</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label-base">Teléfono</label>
                  <input type="text" formControlName="telefono" class="form-input-base" [class.is-invalid]="showError('telefono')" placeholder="Ej: 987654321">
                </div>
                <div class="col-md-8">
                  <label class="form-label-base">Dirección de Residencia</label>
                  <input type="text" formControlName="direccion" class="form-input-base" placeholder="Av. Siempre Viva 123...">
                </div>
              </div>
            </div>

            <!-- SECCIÓN 2: INFORMACIÓN LABORAL -->
            <div class="form-section mb-4">
              <h6 class="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Información Laboral y Acceso
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label-base">Rol o Cargo</label>
                  <select formControlName="rolId" class="form-input-base" [class.is-invalid]="showError('rolId')">
                    <option [ngValue]="null" disabled selected>Seleccione un rol...</option>
                    <option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label-base">Fecha de Ingreso <small class="text-muted">(Automática)</small></label>
                  <input type="date" formControlName="fechaIngreso" class="form-input-base bg-light-subtle" readonly title="La fecha de ingreso no es editable">
                </div>
              </div>
            </div>

            <!-- SECCIÓN 3: MODALIDAD Y JORNADA -->
            <div class="form-section mb-4">
               <h6 class="section-title">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                 Esquema de Asistencia
               </h6>
               <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label-base">Categoría de Asistencia</label>
                    <select formControlName="modalidadId" class="form-input-base" [class.is-invalid]="showError('modalidadId')">
                      <option [ngValue]="null" disabled selected>Seleccione modalidad...</option>
                      <option *ngFor="let mod of modalidades" [value]="mod.id">{{ mod.nombre }}</option>
                    </select>
                  </div>

                  <!-- Selector de Días (Solo si no es exento) -->
                  <div class="col-12" *ngIf="form.get('modalidadId')?.value && form.get('modalidadId')?.value != 5">
                    <div class="days-container p-3 rounded-4 bg-light bg-opacity-50">
                      <label class="form-label-base mb-3 d-block">Configuración de Jornada Semanal</label>
                      <div class="days-selector-grid-enhanced">
                        <div *ngFor="let day of DAYS" class="day-card" [ngClass]="getDayClass(day)">
                          <span class="day-name">{{ day }}</span>
                          <div class="state-buttons-triple">
                            <button type="button" class="btn-triple ofc" [class.active]="getDayState(day) === 'OFC'" (click)="setDayState(day, 'OFC')">OFC</button>
                            <button type="button" class="btn-triple rem" [class.active]="getDayState(day) === 'REM'" (click)="setDayState(day, 'REM')">REM</button>
                            <button type="button" class="btn-triple lib" [class.active]="getDayState(day) === 'LIB'" (click)="setDayState(day, 'LIB')">LIB</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Configuración de Terreno -->
                  <div class="col-12" *ngIf="form.get('modalidadId')?.value == 4">
                    <div class="p-3 bg-terreno-soft rounded-4 border-start border-4 border-purple shadow-sm">
                       <label class="d-flex align-items-center gap-2 cursor-pointer mb-3">
                          <input type="checkbox" formControlName="esJefeTerreno" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                          <span class="fw-bold text-dark">¿Es Jefe de Terreno / Líder de Grupo?</span>
                       </label>
                       <div *ngIf="!form.get('esJefeTerreno')?.value">
                          <label class="form-label-base">Asignar a Líder de Terreno</label>
                          <select formControlName="jefeId" class="form-input-base" [class.is-invalid]="showError('jefeId')">
                            <option [ngValue]="null" disabled>Seleccione líder del grupo...</option>
                            <option *ngFor="let jefe of jefesTerreno" [value]="jefe.id">{{ jefe.nombres }} {{ jefe.apellidos }}</option>
                          </select>
                       </div>
                    </div>
                  </div>

                  <!-- Geolocalización Virtual -->
                  <div class="col-12" *ngIf="form.get('modalidadId')?.value == 2 || form.get('modalidadId')?.value == 3">
                    <div class="p-3 bg-info bg-opacity-10 rounded-4 border-start border-4 border-info">
                       <h6 class="fw-bold mb-3 d-flex align-items-center gap-2">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                         Coordenadas para Marcación Virtual (Opcional)
                       </h6>
                       <div class="row g-2">
                         <div class="col-6">
                           <input type="number" step="any" formControlName="latitudVirtual" class="form-input-base" placeholder="Latitud">
                         </div>
                         <div class="col-6">
                           <input type="number" step="any" formControlName="longitudVirtual" class="form-input-base" placeholder="Longitud">
                         </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="isLoading">
              {{ isLoading ? 'Procesando...' : (editData ? 'Actualizar Trabajador' : 'Crear Trabajador') }}
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
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

    .bg-terreno-soft { background: #faf5ff; }
    .border-purple { border-color: #9333ea !important; }

    .days-selector-grid-enhanced {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px;
    }
    .day-card {
      background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px;
      display: flex; flex-direction: column; gap: 8px; transition: all 0.2s;
    }
    .day-card.card-ofc { border-color: #3b82f6; background: #eff6ff; }
    .day-card.card-rem { border-color: #64748b; background: #f8fafc; }
    
    .day-name { font-weight: 700; font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; }
    .card-ofc .day-name { color: #3b82f6; }
    
    .state-buttons-triple { display: flex; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; height: 24px; }
    .btn-triple {
      flex: 1; border: none; padding: 0; font-size: 0.6rem; font-weight: 800; cursor: pointer;
      background: #f8fafc; color: #cbd5e1; transition: all 0.2s;
    }
    .btn-triple.ofc.active { background: #3b82f6; color: white; }
    .btn-triple.rem.active { background: #64748b; color: white; }
    .btn-triple.lib.active { background: #cbd5e1; color: #475569; }
  `]
})
export class FormTrabajadorComponent implements OnInit {
  @Input() editData: TrabajadorResponse | null = null;
  @Input() isLoading: boolean = false;
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
      fechaIngreso: [{ value: '', disabled: false }], // Siempre será readonly en UI, pero habilitado para patch
      rolId: [null, Validators.required],
      activo: [true],
      modalidadId: [null, Validators.required],
      esJefeTerreno: [false],
      jefeId: [null],
      latitudVirtual: [null],
      longitudVirtual: [null],
      diasPresencial: [''],
      diasRemotos: ['']
    });

    this.form.get('modalidadId')?.valueChanges.subscribe(() => this.updateDynamicValidators());
    this.form.get('esJefeTerreno')?.valueChanges.subscribe(() => this.updateDynamicValidators());
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
      
      const dataToPatch = { ...this.editData };
      if (dataToPatch.fechaIngreso) {
        dataToPatch.fechaIngreso = dataToPatch.fechaIngreso.split('T')[0];
      }

      this.form.patchValue(dataToPatch);
      this.updateDynamicValidators();
    } else {
      // Automatización de Fecha de Ingreso para NUEVOS
      const today = new Date().toISOString().split('T')[0];
      this.form.patchValue({ fechaIngreso: today });
    }
  }

  private updateDynamicValidators() {
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
