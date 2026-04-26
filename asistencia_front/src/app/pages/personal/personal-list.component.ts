import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalService, PersonalUnificado } from '../../services/personal.service';
import { NotificationService } from '../../services/notification.service';
import { FormPersonalComponent } from './form-personal.component';
import { PersonalDetailComponent } from './personal-detail.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest, PaginatedResponse } from '../../models/pagination.interface';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [CommonModule, FormPersonalComponent, PersonalDetailComponent, FormsModule, PaginationComponent],
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
      <div class="glass-card mb-4 p-3 shadow-sm rounded-4" style="background: var(--bg-surface) !important; border: 1px solid var(--glass-border) !important;">
        <div class="row g-3 align-items-center">
          <div class="col-lg-6">
            <div class="search-input-group position-relative">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                class="form-control ps-5 rounded-pill border-0 shadow-none custom-input-theme" 
                placeholder="Buscar por Nombre, DNI o Usuario..."
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select rounded-pill border-0 shadow-none custom-input-theme" [(ngModel)]="filterModalidad" (change)="cargarPersonal()">
              <option [value]="0">Todas las Modalidades</option>
              <option value="1">Presencial</option>
              <option value="2">Virtual</option>
              <option value="3">Híbrido</option>
              <option value="4">Terreno</option>
              <option value="5">Exento / Admin</option>
            </select>
          </div>
          <div class="col-md-3 text-end">
             <button class="btn btn-link text-decoration-none text-secondary small p-0" (click)="limpiarFiltros()">
                <u>Limpiar Filtros</u>
             </button>
          </div>
        </div>
      </div>

      <div class="glass-card main-list-card" style="background: var(--bg-surface) !important;">
        <div class="position-relative">
          <div *ngIf="isLoading" class="loading-overlay rounded-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-custom mb-0" style="--bs-table-bg: transparent;">
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
                <tr *ngFor="let p of personal" class="list-row animate-slide-up" style="background: var(--bg-surface) !important;">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3 py-1">
                      <div class="avatar-box">
                        <span class="avatar-text">{{ p.nombres[0] }}</span>
                      </div>
                      <div class="user-info">
                        <div class="fw-bold text-primary-hover lh-1 mb-1" style="color: var(--text-main) !important;">{{ p.nombres }} {{ p.apellidos }}</div>
                        <div class="small fw-medium opacity-75" style="color: var(--text-secondary) !important;">@{{ p.username }}</div>
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
                    <span class="badge border fw-bold small px-3 rounded-pill" style="background: var(--bg-deep); color: var(--text-main); border-color: var(--glass-border) !important;">
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
                      <button class="action-btn detail" (click)="onVerDetalle(p)" title="Ver Detalle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button class="action-btn edit" (click)="onEditar(p)" title="Editar Personal">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                      <button class="action-btn toggle" 
                              [class.disable]="p.activo"
                              [class.enable]="!p.activo"
                              (click)="onToggleActivo(p)" 
                              [title]="p.activo ? 'Inhabilitar Acceso' : 'Habilitar Acceso'">
                        <svg *ngIf="p.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                        <svg *ngIf="!p.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="personal.length === 0 && !isLoading">
                  <td colspan="6" class="text-center py-5 opacity-75">No se encontró personal registrado.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination Footer -->
        <div class="pagination-footer px-4 py-3 border-top" style="border-color: var(--glass-border) !important;">
          <app-pagination
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalItems]="totalItems"
            [totalPages]="totalPages"
            [isLoading]="isLoading"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
            (refresh)="cargarPersonal()"
          ></app-pagination>
        </div>
      </div>

      <!-- Modales -->
      <app-form-personal 
        *ngIf="showForm"
        [editData]="selectedPersonal"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)"
      ></app-form-personal>

      <app-personal-detail
        *ngIf="showDetail"
        [data]="selectedPersonal"
        (close)="onCloseDetail()"
      ></app-personal-detail>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.05rem; }
    .search-input-group .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); opacity: 0.5; z-index: 5; }
    .icon-box-primary { padding: 10px; background: var(--grad-main); color: var(--bg-main); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25); }
    .glass-card { background: var(--glass-bg, var(--bg-surface)); }
    .table-custom tr.list-row { background: var(--bg-surface); transition: background 0.2s ease; border-bottom: 1px solid var(--glass-border); }
    .table-custom td { color: var(--text-main); }
    .main-list-card { border-radius: 20px; border: 1px solid var(--glass-border); box-shadow: var(--shadow-xl); background: transparent; }
    .custom-input-theme { background: var(--bg-deep); color: var(--text-primary); }
    .custom-input-theme::placeholder { color: var(--text-muted); }
    .avatar-box { width: 42px; height: 42px; background: var(--bg-deep); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--glass-border); color: var(--accent-primary); font-weight: 800; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--bg-deep); color: var(--text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .action-btn:hover { transform: scale(1.1); }
    .action-btn.detail:hover { background: rgba(3, 105, 161, 0.1); color: #0ea5e9; }
    .action-btn.edit:hover { background: rgba(180, 83, 9, 0.1); color: #f59e0b; }
    .action-btn.toggle.disable:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .action-btn.toggle.enable:hover { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .btn-primary-grad { background: var(--text-main) !important; color: var(--bg-main) !important; }
    .status-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; background: var(--bg-deep); color: var(--text-primary); border: 1px solid var(--glass-border); }
    .status-pill.active { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); }
    .active .status-dot { background: #10b981; }
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
  isLoading = false;
  showForm = false;
  showDetail = false;
  selectedPersonal: PersonalUnificado | null = null;
  
  // Pagination State
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filters
  searchQuery = '';
  filterModalidad = 0;
  private searchSubject = new Subject<string>();

  constructor(
    private personalService: PersonalService,
    private notify: NotificationService
  ) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchQuery = value;
      this.currentPage = 0;
      this.cargarPersonal();
    });
  }

  ngOnInit() {
    this.cargarPersonal();
  }

  cargarPersonal() {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC',
      filters: this.cleanupFilters()
    };

    this.personalService.listarPaginado(request).subscribe({
      next: (response: PaginatedResponse<PersonalUnificado>) => {
        this.personal = response.content || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: () => {
        this.notify.error('Error al cargar la lista de personal');
        this.isLoading = false;
      }
    });
  }

  private cleanupFilters(): any {
    const filters: any = {};
    if (this.searchQuery) filters['searchTerm'] = this.searchQuery;
    if (this.filterModalidad > 0) filters['modalidadId'] = this.filterModalidad;
    return filters;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cargarPersonal();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.cargarPersonal();
  }

  onSearchChange(val: string) {
    this.searchSubject.next(val);
  }

  limpiarFiltros() {
    this.searchQuery = '';
    this.filterModalidad = 0;
    this.currentPage = 0;
    this.cargarPersonal();
  }

  onNuevo() {
    this.selectedPersonal = null;
    this.showForm = true;
  }

  onEditar(p: PersonalUnificado) {
    this.selectedPersonal = p;
    this.showForm = true;
  }

  onVerDetalle(p: PersonalUnificado) {
    this.selectedPersonal = p;
    this.showDetail = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.selectedPersonal = null;
  }

  onCloseDetail() {
    this.showDetail = false;
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

  onToggleActivo(p: PersonalUnificado) {
    if (!p.id) return;
    
    const nuevoEstado = !p.activo;
    const msg = nuevoEstado 
      ? `¿Estás seguro de habilitar a ${p.nombres}? Volverá a tener acceso al sistema.` 
      : `¿Estás seguro de inhabilitar a ${p.nombres}? Perderá acceso inmediato a la Web y App Móvil.`;

    if (confirm(msg)) {
      this.isLoading = true;
      this.personalService.toggleEstado(p.id, nuevoEstado).subscribe({
        next: () => {
          this.notify.success(`Estado de ${p.nombres} actualizado.`);
          this.cargarPersonal();
        },
        error: () => {
          this.notify.error('Error al actualizar el estado del usuario');
          this.isLoading = false;
        }
      });
    }
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

