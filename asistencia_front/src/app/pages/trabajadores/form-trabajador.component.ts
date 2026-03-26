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
          <h2 class="modal-title-base">{{ editData ? 'Editar Trabajador' : 'Nuevo Trabajador' }}</h2>
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
                <label class="form-label-base">Email Corporativo</label>
                <input type="email" formControlName="email" class="form-input-base" placeholder="usuario@ejemplo.com">
                <div *ngIf="showError('email')" class="form-error-base">Ingrese un email válido</div>
              </div>

              <!-- Configuración de Modalidad -->
              <div class="col-12 mt-2">
                <div class="p-3 bg-deep rounded-4 border">
                  <h6 class="fw-bold mb-3 text-primary">Esquema de Trabajo</h6>
                  <div class="row g-3">
                    <div class="col-md-6 form-field">
                      <label class="form-label-base">Modalidad</label>
                      <select formControlName="modalidadId" class="form-input-base">
                        <option [ngValue]="null" disabled>Seleccione modalidad...</option>
                        <option *ngFor="let mod of modalidades" [value]="mod.id">{{ mod.nombre }}</option>
                      </select>
                    </div>

                    <!-- Condicional para Híbrido -->
                    <div class="col-md-6 form-field" *ngIf="form.get('modalidadId')?.value == 3">
                      <label class="form-label-base">Días Presencial</label>
                      <input type="text" formControlName="diasPresencial" class="form-input-base" placeholder="Ej: Lunes, Miércoles">
                    </div>

                    <!-- Condicional para Terreno -->
                    <div class="col-md-6" *ngIf="form.get('modalidadId')?.value == 4">
                       <label class="d-flex align-items-center gap-2 cursor-pointer pb-2">
                          <input type="checkbox" formControlName="esJefeTerreno" class="form-check-input mt-0" style="width: 20px; height: 20px;">
                          <span class="form-label-base mb-0" style="text-transform: none;">Este trabajador es <b>Jefe de Terreno</b></span>
                       </label>

                       <!-- Asignación de Jefe (si no es jefe él mismo) -->
                       <div class="mt-2" *ngIf="!form.get('esJefeTerreno')?.value">
                         <label class="form-label-base">Grupo / Jefe de Terreno</label>
                         <select formControlName="jefeId" class="form-input-base">
                           <option [ngValue]="null">Sin jefe (Independiente)</option>
                           <option *ngFor="let jefe of jefesTerreno" [value]="jefe.id">
                             {{ jefe.nombres }} {{ jefe.apellidos }}
                           </option>
                         </select>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 form-field">
                <label class="form-label-base">Teléfono</label>
                <input type="text" formControlName="telefono" class="form-input-base" placeholder="Ej: 987654321">
              </div>
              <div class="col-md-6 form-field">
                <label class="form-label-base">Rol / Cargo del Sistema</label>
                <select formControlName="rolId" class="form-input-base">
                  <option [ngValue]="null" disabled selected>Seleccione un rol...</option>
                  <option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</option>
                </select>
                <div *ngIf="showError('rolId')" class="form-error-base">Debe asignar un rol</div>
              </div>
              
              <div class="col-12">
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="activo" class="form-check-input mt-0" style="width: 18px; height: 18px;">
                  <span class="form-label-base mb-0" style="text-transform: none;">Trabajador con acceso activo al sistema</span>
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
    .form-error-base { color: var(--accent-danger); font-size: 0.75rem; margin-top: 4px; }
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

  constructor(
    private fb: FormBuilder,
    private modalidadService: ModalidadService,
    private trabajadorService: TrabajadorService,
    private rolService: RolService
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      rolId: [null, Validators.required],
      activo: [true],
      modalidadId: [null, Validators.required],
      esJefeTerreno: [false],
      jefeId: [null],
      diasPresencial: ['']
    });
  }

  ngOnInit(): void {
    this.loadModalidades();
    this.loadJefes();
    this.loadRoles();
    if (this.editData) {
      // Si tiene jefe o rol, extraemos los IDs para el formulario
      const data = { 
        ...this.editData, 
        jefeId: this.editData.jefe?.id || null,
        rolId: this.editData.rol?.id || null
      };
      this.form.patchValue(data);
    }
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

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload = { ...this.form.value };
      // Ajuste de tipos si es necesario
      if (payload.modalidadId) payload.modalidadId = Number(payload.modalidadId);
      this.save.emit(payload);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
