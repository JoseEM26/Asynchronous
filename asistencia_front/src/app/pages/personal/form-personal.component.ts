import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalUnificado, PersonalService } from '../../services/personal.service';
import { ModalidadService } from '../../services/modalidad.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-form-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-panel animate-fade" (click)="$event.stopPropagation()">
        <header class="modal-header-base">
          <div class="d-flex align-items-center gap-3">
             <div class="header-icon-box" [class.bg-edit]="editData" [class.bg-new]="!editData">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             </div>
             <h2 class="modal-title-base mb-0">
               {{ editData ? 'Editar Personal' : 'Nuevo Registro Unificado' }}
             </h2>
          </div>
          <button class="btn-close-modal" (click)="onClose()">✕</button>
        </header>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body-base custom-scrollbar">
            
            <div class="row g-4">
              <!-- SECCIÓN 1: DATOS PERSONALES -->
              <div class="col-12">
                <h6 class="section-title">Información del Trabajador</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label-base">Nombres</label>
                    <input type="text" formControlName="nombres" class="form-input-base" [class.border-danger]="form.get('nombres')?.invalid && form.get('nombres')?.touched" placeholder="Nombres">
                    <div class="text-danger small mt-1" *ngIf="form.get('nombres')?.invalid && form.get('nombres')?.touched">Obligatorio</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label-base">Apellidos</label>
                    <input type="text" formControlName="apellidos" class="form-input-base" [class.border-danger]="form.get('apellidos')?.invalid && form.get('apellidos')?.touched" placeholder="Apellidos">
                    <div class="text-danger small mt-1" *ngIf="form.get('apellidos')?.invalid && form.get('apellidos')?.touched">Obligatorio</div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label-base">DNI</label>
                    <input type="text" formControlName="dni" class="form-input-base" [class.border-danger]="form.get('dni')?.invalid && form.get('dni')?.touched" placeholder="DNI" maxlength="8">
                    <div class="text-danger small mt-1" *ngIf="form.get('dni')?.hasError('required') && form.get('dni')?.touched">Obligatorio</div>
                    <div class="text-danger small mt-1" *ngIf="form.get('dni')?.hasError('pattern') && form.get('dni')?.touched">Debe tener 8 dígitos</div>
                  </div>
                  <div class="col-md-8">
                    <label class="form-label-base">Email Corporativo</label>
                    <input type="email" formControlName="email" class="form-input-base" [class.border-danger]="form.get('email')?.invalid && form.get('email')?.touched" placeholder="email@empresa.com">
                    <div class="text-danger small mt-1" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email inválido</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label-base">Modalidad</label>
                    <select formControlName="modalidadId" class="form-input-base">
                      <option *ngFor="let m of modalidades" [value]="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label-base">Teléfono</label>
                    <input type="text" formControlName="telefono" class="form-input-base" placeholder="Teléfono">
                  </div>
                  
                  <!-- HORARIOS -->
                  <div class="col-md-6">
                    <label class="form-label-base">Hora de Ingreso</label>
                    <input type="time" formControlName="horaIngreso" class="form-input-base">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label-base">Hora de Salida</label>
                    <input type="time" formControlName="horaSalida" class="form-input-base">
                  </div>

                  <!-- DÍAS SEGÚN MODALIDAD -->
                  <div class="col-md-12" *ngIf="showDiasPresencial">
                    <label class="form-label-base text-success">Días Presenciales <small class="text-muted fw-normal">(Click para seleccionar)</small></label>
                    <div class="d-flex flex-wrap gap-2">
                      <div *ngFor="let d of diasSemana" 
                           class="day-checkbox presencial" 
                           [class.selected]="isDiaSelected(d, 'presencial')"
                           (click)="toggleDia(d, 'presencial')">
                        {{ d.substring(0, 3) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12" *ngIf="showDiasRemotos">
                    <label class="form-label-base text-primary">Días Remotos (Virtual) <small class="text-muted fw-normal">(Click para seleccionar)</small></label>
                    <div class="d-flex flex-wrap gap-2">
                      <div *ngFor="let d of diasSemana" 
                           class="day-checkbox remoto" 
                           [class.selected]="isDiaSelected(d, 'remoto')"
                           (click)="toggleDia(d, 'remoto')">
                        {{ d.substring(0, 3) }}
                      </div>
                    </div>
                  </div>
                  <!-- FIN DÍAS -->
                </div>
              </div>

              <!-- SECCIÓN 2: ACCESO AL SISTEMA -->
              <div class="col-12 mt-5">
                <h6 class="section-title text-primary">Credenciales de Acceso</h6>
                <div class="p-3 rounded-4 bg-light bg-opacity-50 border border-primary border-opacity-10">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label-base">Nombre de Usuario</label>
                      <input type="text" formControlName="username" class="form-input-base" placeholder="usuario">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label-base">Rol en el Sistema</label>
                      <select formControlName="rolId" class="form-input-base">
                        <option *ngFor="let r of filteredRoles" [value]="r.id">{{ r.nombre }}</option>
                      </select>
                    </div>

                    <!-- SELECCIÓN DE JEFE (Solo para Trabajador Terreno) -->
                    <div class="col-md-12 animate-fade" *ngIf="showJefeSelection">
                      <label class="form-label-base text-warning fw-bold">Jefe de Terreno Asignado</label>
                      <select formControlName="jefeId" class="form-input-base border-warning border-opacity-50">
                        <option [value]="null">-- Seleccionar Jefe --</option>
                        <option *ngFor="let j of jefesDisponibles" [value]="j.id">{{ j.nombres }} {{ j.apellidos }}</option>
                      </select>
                      <div class="text-danger small mt-1" *ngIf="form.hasError('jefeMissing') && form.get('jefeId')?.touched">
                        Debes asignar un jefe para el personal de terreno.
                      </div>
                    </div>
                    <div class="col-md-12" *ngIf="!editData">
                      <label class="form-label-base">Contraseña Inicial</label>
                      <input type="password" formControlName="password" class="form-input-base" [class.border-danger]="form.get('password')?.invalid && form.get('password')?.touched" placeholder="Mínimo 6 caracteres">
                      <div class="text-danger small mt-1" *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</div>
                    </div>
                    <div class="col-md-12" *ngIf="editData">
                      <p class="small text-muted mb-0 italic">La contraseña solo se cambia si se ingresa una nueva.</p>
                      <input type="password" formControlName="password" class="form-input-base" [class.border-danger]="form.get('password')?.invalid && form.get('password')?.touched" placeholder="Nueva contraseña (opcional)">
                      <div class="text-danger small mt-1" *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</div>
                    </div>
                    <div class="col-md-12" *ngIf="!editData || form.get('password')?.value">
                      <label class="form-label-base">Confirmar Contraseña</label>
                      <input type="password" formControlName="confirmPassword" class="form-input-base" [class.border-danger]="form.hasError('mismatch') && form.get('confirmPassword')?.touched" placeholder="Repite la contraseña">
                      <div class="text-danger small mt-1" *ngIf="form.hasError('mismatch') && form.get('confirmPassword')?.touched">Las contraseñas no coinciden</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <footer class="modal-footer-base">
            <button type="button" class="btn btn-light" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn btn-primary-grad px-4" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Guardando...' : 'Guardar Personal Unificado' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;
    }
    .modal-panel {
      width: 100%; max-width: 800px; background: white; border-radius: 24px; overflow: hidden;
      display: flex; flex-direction: column; max-height: 90vh;
    }
    .modal-header-base {
      display: flex; justify-content: space-between; align-items: center; padding: 20px 24px;
      border-bottom: 1px solid var(--glass-border); background: var(--bg-surface);
    }
    .modal-title-base { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
    .btn-close-modal {
      background: transparent; border: none; font-size: 1.5rem; color: var(--text-secondary); opacity: 0.7; transition: 0.2s;
    }
    .btn-close-modal:hover { opacity: 1; transform: scale(1.1); }
    .modal-body-base { padding: 24px; overflow-y: auto; }
    .modal-footer-base {
      display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px;
      border-top: 1px solid var(--glass-border); background: var(--bg-surface);
    }
    .form-label-base { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; display: block; }
    .form-input-base {
      width: 100%; padding: 10px 16px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f8fafc;
      font-size: 0.95rem; color: #1e293b; transition: all 0.2s;
    }
    .form-input-base:focus { outline: none; border-color: var(--accent-primary); background: white; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .section-title { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 16px; }
    .header-icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; background: var(--grad-main); }
    .custom-scrollbar { max-height: 70vh; overflow-y: auto; padding-right: 8px; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 10px; font-weight: 600; }
    .day-checkbox {
      padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s;
      background: #f1f5f9; color: #64748b; border: 1px solid transparent; user-select: none;
    }
    .day-checkbox:hover { transform: translateY(-2px); }
    .day-checkbox.presencial.selected { background: #dcfce7; color: #166534; border-color: #4ade80; }
    .day-checkbox.remoto.selected { background: #e0f2fe; color: #0369a1; border-color: #38bdf8; }
  `]
})
export class FormPersonalComponent implements OnInit {
  @Input() editData: PersonalUnificado | null = null;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PersonalUnificado>();

  form: FormGroup;
  modalidades: any[] = [];
  roles: any[] = [];
  filteredRoles: any[] = [];
  jefesDisponibles: PersonalUnificado[] = [];

  constructor(
    private fb: FormBuilder,
    private modalidadService: ModalidadService,
    private rolService: RolService,
    private personalService: PersonalService
  ) {
    this.form = this.fb.group({
      id: [null],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9+ ]{7,15}$')]],
      direccion: [''],
      modalidadId: [1, Validators.required],
      activo: [true],
      esJefeTerreno: [false],
      jefeId: [null],
      diasPresencial: [''],
      diasRemotos: [''],
      horaIngreso: ['09:00'],
      horaSalida: ['18:00'],
      username: ['', [Validators.required, Validators.minLength(4)]],
      rolId: [2, Validators.required],
      password: [''],
      confirmPassword: [''],
      usuarioActivo: [true],
      permitirCambioUbicacion: [false]
    }, { validators: [this.passwordMatchValidator, this.jefeRequiredValidator] });
  }

  ngOnInit() {
    this.modalidadService.listar().subscribe(data => this.modalidades = data);
    
    this.rolService.listar().subscribe(data => {
      this.roles = data;
      this.actualizarRolesFiltrados();
    });

    this.personalService.listar().subscribe((data: PersonalUnificado[]) => {
      // Filtrar trabajadores que son Jefes de Terreno (Rol 3)
      this.jefesDisponibles = data.filter((p: PersonalUnificado) => p.rolId === 3);
    });

    if (this.editData) {
      this.form.patchValue(this.editData);
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    // Listen to modality changes
    this.form.get('modalidadId')?.valueChanges.subscribe(() => {
      this.actualizarRolesFiltrados();
    });

    // Listen to role changes
    this.form.get('rolId')?.valueChanges.subscribe(rolId => {
      const isJefe = rolId == 3;
      this.form.patchValue({ esJefeTerreno: isJefe });
      this.form.get('jefeId')?.updateValueAndValidity();
    });
  }

  actualizarRolesFiltrados() {
    const modId = this.form.get('modalidadId')?.value;
    if (modId == 4) { // Terreno
      this.filteredRoles = this.roles.filter(r => r.id === 3 || r.id === 4);
      // Si el rol actual no es de terreno, cambiarlo a Trabajador Terreno
      const currentRol = this.form.get('rolId')?.value;
      if (currentRol != 3 && currentRol != 4) {
        this.form.patchValue({ rolId: 4 });
      }
    } else {
      // Para otras modalidades, ocultar roles de terreno
      this.filteredRoles = this.roles.filter(r => r.id !== 3 && r.id !== 4);
      const currentRol = this.form.get('rolId')?.value;
      if (currentRol == 3 || currentRol == 4) {
        this.form.patchValue({ rolId: 2, jefeId: null });
      } else {
        this.form.patchValue({ jefeId: null });
      }
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    if (!password && !confirmPassword) return null;
    return password === confirmPassword ? null : { mismatch: true };
  }

  jefeRequiredValidator(g: FormGroup) {
    const rolId = g.get('rolId')?.value;
    const jefeId = g.get('jefeId')?.value;
    // Si es Trabajador Terreno (4), el jefe es obligatorio
    if (rolId == 4 && !jefeId) {
      return { jefeMissing: true };
    }
    return null;
  }

  diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  get showDiasPresencial(): boolean {
    const modId = this.form.get('modalidadId')?.value;
    return modId == 1 || modId == 3;
  }

  get showDiasRemotos(): boolean {
    const modId = this.form.get('modalidadId')?.value;
    return modId == 2 || modId == 3;
  }

  get showJefeSelection(): boolean {
    return this.form.get('rolId')?.value == 4; // Solo para Trabajador Terreno
  }

  toggleDia(dia: string, tipo: 'presencial'|'remoto') {
    const controlName = tipo === 'presencial' ? 'diasPresencial' : 'diasRemotos';
    const otherControlName = tipo === 'presencial' ? 'diasRemotos' : 'diasPresencial';
    
    const control = this.form.get(controlName);
    const otherControl = this.form.get(otherControlName);
    
    if (this.form.get('modalidadId')?.value == 3) {
      let otherStr = otherControl?.value || '';
      let otherArray = otherStr ? otherStr.split(',').map((d:string) => d.trim()) : [];
      if (otherArray.includes(dia)) {
        otherArray = otherArray.filter((d: string) => d !== dia);
        otherControl?.setValue(otherArray.join(','));
      }
    }

    let diasStr = control?.value || '';
    let diasArray = diasStr ? diasStr.split(',').map((d:string)=>d.trim()) : [];
    
    if (diasArray.includes(dia)) {
      diasArray = diasArray.filter((d: string) => d !== dia);
    } else {
      diasArray.push(dia);
      diasArray.sort((a:string, b:string) => this.diasSemana.indexOf(a) - this.diasSemana.indexOf(b));
    }
    control?.setValue(diasArray.join(','));
  }

  isDiaSelected(dia: string, tipo: 'presencial'|'remoto'): boolean {
    const controlName = tipo === 'presencial' ? 'diasPresencial' : 'diasRemotos';
    const control = this.form.get(controlName);
    let diasStr = control?.value || '';
    return diasStr.includes(dia);
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

