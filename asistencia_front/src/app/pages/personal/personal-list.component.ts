import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalService, PersonalUnificado } from '../../services/personal.service';
import { NotificationService } from '../../services/notification.service';
import { FormPersonalComponent } from './form-personal.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [CommonModule, FormPersonalComponent, FormsModule],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">Gestión Unificada de Personal</h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">Administra trabajadores y sus accesos al sistema en un solo lugar.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-primary-grad shadow-sm d-inline-flex align-items-center gap-2" (click)="onNuevo()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Personal
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="glass-card mb-4 p-3 border border-1 border-white shadow-sm rounded-4 bg-white bg-opacity-75">
        <div class="row g-3 align-items-center">
          <div class="col-lg-6">
            <div class="search-input-group position-relative">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                class="form-control ps-5 rounded-pill border-0 bg-light-subtle shadow-none" 
                placeholder="Buscar por Nombre, DNI o Usuario..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select rounded-pill border-0 bg-light-subtle shadow-none" [(ngModel)]="filterModalidad" (change)="aplicarFiltros()">
              <option [value]="0">Todas las Modalidades</option>
              <option value="1">Presencial</option>
              <option value="2">Virtual</option>
              <option value="3">Híbrido</option>
              <option value="4">Terreno</option>
              <option value="5">Exento / Admin</option>
            </select>
          </div>
          <div class="col-md-3">
             <button class="btn btn-link text-decoration-none text-secondary small p-0" (click)="limpiarFiltros()">
                <u>Limpiar Filtros</u>
             </button>
          </div>
        </div>
      </div>

      <div class="glass-card main-list-card">
        <div class="position-relative">
          <div *ngIf="isLoading" class="loading-overlay rounded-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-custom mb-0">
              <thead>
                <tr>
                  <th class="ps-4 py-3 text-uppercase small ls-1">Personal / Usuario</th>
                  <th class="py-3 text-uppercase small ls-1">Identificación</th>
                  <th class="py-3 text-uppercase small ls-1">Modalidad</th>
                  <th class="py-3 text-uppercase small ls-1">Rol de Acceso</th>
                  <th class="py-3 text-uppercase small ls-1">Estado</th>
                  <th class="text-end pe-4 py-3 text-uppercase small ls-1">Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of personalFiltrado" class="list-row animate-slide-up">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3 py-1">
                      <div class="avatar-box">
                        <span class="avatar-text">{{ p.nombres[0] }}</span>
                      </div>
                      <div class="user-info">
                        <div class="fw-bold text-primary-hover lh-1 mb-1">{{ p.nombres }} {{ p.apellidos }}</div>
                        <div class="small text-secondary fw-medium opacity-75">@{{ p.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge-code">{{ p.dni }}</span>
                  </td>
                  <td>
                    <div class="modality-badge" [ngClass]="getModalidadClass(p.modalidadId)">
                      <span>{{ p.modalidadNombre }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border fw-bold small px-3 rounded-pill">
                      {{ p.rolNombre }}
                    </span>
                  </td>
                  <td>
                    <div class="status-pill" [class.active]="p.activo">
                      <span class="status-dot"></span>
                      {{ p.activo ? 'Vigente' : 'Inactivo' }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="action-btn edit" (click)="onEditar(p)" title="Editar Personal">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="personalFiltrado.length === 0 && !isLoading">
                  <td colspan="6" class="text-center py-5">
                    <div class="empty-state py-5">
                      <h5 class="fw-bold mb-1">Sin Registros</h5>
                      <p class="text-secondary small">No hay personal registrado que coincida con la búsqueda.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <app-form-personal 
        *ngIf="showForm"
        [editData]="selectedPersonal"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)"
      ></app-form-personal>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.05rem; }
    .search-input-group .search-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: var(--text-secondary); opacity: 0.5; z-index: 5;
    }
    .search-input-group .form-control { height: 45px; font-size: 0.9rem; border: 1px solid transparent !important; }
    .search-input-group .form-control:focus { background: white !important; border-color: var(--accent-primary) !important; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1) !important; }
    .icon-box-primary { padding: 10px; background: var(--grad-main); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25); }
    .main-list-card { border-radius: 20px; border: 1px solid var(--glass-border); box-shadow: var(--shadow-xl); background: var(--bg-surface); }
    .table-custom thead th { background: var(--bg-deep); border-bottom: 2px solid var(--glass-border); color: var(--text-secondary); font-weight: 700; }
    .list-row:hover { background: rgba(249,115,22,0.05); }
    .avatar-box { width: 42px; height: 42px; background: var(--bg-deep); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--glass-border); color: var(--accent-primary); font-weight: 800; }
    .badge-code { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600; background: var(--bg-deep); padding: 4px 10px; border-radius: 6px; }
    .status-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; color: #475569; }
    .status-pill.active { background: #ecfdf5; color: #065f46; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
    .active .status-dot { background: #10b981; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: none; background: #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .action-btn.edit:hover { background: #fef3c7; color: #b45309; }
    .modality-badge { padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; }
    .mod-presencial { background: #dcfce7; color: #166534; }
    .mod-virtual { background: #e0f2fe; color: #075985; }
    .mod-hibrido { background: #fef9c3; color: #854d0e; }
    .mod-terreno { background: #f3e8ff; color: #6b21a8; }
    .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
  `]
})
export class PersonalListComponent implements OnInit {
  personal: PersonalUnificado[] = [];
  personalFiltrado: PersonalUnificado[] = [];
  isLoading = false;
  showForm = false;
  selectedPersonal: PersonalUnificado | null = null;
  searchTerm = '';
  filterModalidad = 0;

  constructor(
    private personalService: PersonalService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.cargarPersonal();
  }

  cargarPersonal() {
    this.isLoading = true;
    console.log('📡 Cargando personal desde:', this.personalService['apiUrl']);
    this.personalService.listar().subscribe({
      next: (data) => {
        console.log('✅ Personal recibido:', data);
        this.personal = data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar la lista de personal:', err);
        this.notify.error('Error al cargar la lista de personal. Verifica la consola.');
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros() {
    this.personalFiltrado = this.personal.filter(p => {
      const matchSearch = !this.searchTerm || 
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.dni.includes(this.searchTerm) ||
        p.username.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchMod = this.filterModalidad == 0 || p.modalidadId == this.filterModalidad;
      
      return matchSearch && matchMod;
    });
  }

  onSearchChange(val: string) {
    this.searchTerm = val;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.filterModalidad = 0;
    this.aplicarFiltros();
  }

  onNuevo() {
    this.selectedPersonal = null;
    this.showForm = true;
  }

  onEditar(p: PersonalUnificado) {
    this.selectedPersonal = p;
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.selectedPersonal = null;
  }

  onSave(data: PersonalUnificado) {
    this.isLoading = true;
    this.personalService.guardar(data).subscribe({
      next: () => {
        this.notify.success('Personal guardado correctamente');
        this.onCloseForm();
        this.cargarPersonal();
      },
      error: () => {
        this.notify.error('Error al guardar personal');
        this.isLoading = false;
      }
    });
  }

  getModalidadClass(id?: number): string {
    switch (id) {
      case 1: return 'mod-presencial';
      case 2: return 'mod-virtual';
      case 3: return 'mod-hibrido';
      case 4: return 'mod-terreno';
      default: return 'bg-light text-muted';
    }
  }
}
