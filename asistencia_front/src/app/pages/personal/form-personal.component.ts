import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalUnificado } from '../../services/personal.service';
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
                    <input type="text" formControlName="nombres" class="form-input-base" placeholder="Nombres">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label-base">Apellidos</label>
                    <input type="text" formControlName="apellidos" class="form-input-base" placeholder="Apellidos">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label-base">DNI</label>
                    <input type="text" formControlName="dni" class="form-input-base" placeholder="DNI" maxlength="8">
                  </div>
                  <div class="col-md-8">
                    <label class="form-label-base">Email Corporativo</label>
                    <input type="email" formControlName="email" class="form-input-base" placeholder="email@empresa.com">
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
                        <option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</option>
                      </select>
                    </div>
                    <div class="col-md-12" *ngIf="!editData">
                      <label class="form-label-base">Contraseña Inicial</label>
                      <input type="password" formControlName="password" class="form-input-base" placeholder="Mínimo 6 caracteres">
                    </div>
                    <div class="col-md-12" *ngIf="editData">
                      <p class="small text-muted mb-0 italic">La contraseña solo se cambia si se ingresa una nueva.</p>
                      <input type="password" formControlName="password" class="form-input-base" placeholder="Nueva contraseña (opcional)">
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
    .section-title { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 16px; }
    .header-icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; background: var(--grad-main); }
    .custom-scrollbar { max-height: 70vh; overflow-y: auto; padding-right: 8px; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 10px; font-weight: 600; }
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

  constructor(
    private fb: FormBuilder,
    private modalidadService: ModalidadService,
    private rolService: RolService
  ) {
    this.form = this.fb.group({
      id: [null],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      modalidadId: [1, Validators.required],
      activo: [true],
      esJefeTerreno: [false],
      username: ['', Validators.required],
      rolId: [2, Validators.required],
      password: [''],
      usuarioActivo: [true]
    });
  }

  ngOnInit() {
    this.modalidadService.listar().subscribe(data => this.modalidades = data);
    this.rolService.listar().subscribe(data => this.roles = data);

    if (this.editData) {
      this.form.patchValue(this.editData);
      this.form.get('password')?.clearValidators();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
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
