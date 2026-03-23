import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajadorService } from '../../services/trabajador.service';
import { NotificationService } from '../../services/notification.service';
import { TrabajadorRequest, TrabajadorResponse } from '../../models/trabajador.interface';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest, PageResponse } from '../../models/pagination.interface';
import { FormTrabajadorComponent } from './form-trabajador.component';

@Component({
  selector: 'app-trabajadores-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormTrabajadorComponent],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">Gestión de Trabajadores</h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">Administra el personal, sus niveles de acceso y estado actual en la plataforma.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-primary-grad shadow-sm d-inline-flex align-items-center gap-2" (click)="onNuevo()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Trabajador
          </button>
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
                  <th class="ps-4 py-3 text-uppercase small ls-1">Información Personal</th>
                  <th class="py-3 text-uppercase small ls-1">Identificación</th>
                  <th class="py-3 text-uppercase small ls-1">Modalidad</th>
                  <th class="py-3 text-uppercase small ls-1 d-none d-lg-table-cell">Contacto</th>
                  <th class="py-3 text-uppercase small ls-1">Estado</th>
                  <th class="text-end pe-4 py-3 text-uppercase small ls-1">Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of (trabajadores || [])" class="list-row animate-slide-up">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3 py-1">
                      <div class="avatar-box">
                        <span class="avatar-text">{{ t.nombres ? t.nombres[0] : '?' }}</span>
                        <div *ngIf="t.esJefeTerreno" class="leader-badge" title="Jefe de Terreno">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        </div>
                      </div>
                      <div class="user-info">
                        <div class="fw-bold text-primary-hover lh-1 mb-1">{{ t.nombres }}</div>
                        <div class="small text-secondary fw-medium opacity-75">{{ t.apellidos }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge-code">{{ t.dni }}</span>
                  </td>
                  <td>
                    <div class="modality-badge" [ngClass]="getModalidadClass(t.modalidadId)">
                      <i [innerHTML]="getModalidadIcon(t.modalidadId)"></i>
                      <span>{{ getModalidadLabel(t.modalidadId) }}</span>
                    </div>
                  </td>
                  <td class="d-none d-lg-table-cell">
                    <div class="d-flex flex-column">
                      <span class="small fw-semibold">{{ t.email }}</span>
                      <span class="text-muted extra-small">Email Laboral</span>
                    </div>
                  </td>
                  <td>
                    <div class="status-pill" [class.active]="t.activo">
                      <span class="status-dot"></span>
                      {{ t.activo ? 'Vigente' : 'Inactivo' }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="action-btn edit" (click)="onVer(t)" title="Editar Perfil">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                      <button class="action-btn delete" (click)="onEliminar(t)" title="Eliminar de DB">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="(trabajadores.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state py-5">
                      <div class="empty-icon-box mx-auto mb-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-25"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </div>
                      <h5 class="fw-bold mb-1">Sin Registros</h5>
                      <p class="text-secondary small">No hay trabajadores que coincidan con los criterios actuales.</p>
                      <button class="btn btn-outline-primary btn-sm mt-3 px-4 rounded-pill" (click)="onNuevo()">Registrar el primero</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pagination-footer px-4 py-3 border-top">
          <app-pagination
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalItems]="totalItems"
            [totalPages]="totalPages"
            [isLoading]="isLoading"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
            (refresh)="cargarTrabajadores()"
          ></app-pagination>
        </div>
      </div>

      <app-form-trabajador 
        *ngIf="showForm"
        [editData]="selectedTrabajador"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)"
      ></app-form-trabajador>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.05rem; }
    .ls-1 { letter-spacing: 0.05rem; }
    .ls-1 { letter-spacing: 0.05rem; }
    .extra-small { font-size: 0.65rem; }

    .icon-box-primary {
      padding: 10px; background: var(--grad-main); color: white;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }

    .main-list-card {
      border-radius: 20px; border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-xl); background: var(--bg-surface);
    }

    .table-custom { border-collapse: separate; border-spacing: 0; }
    .table-custom thead th {
      background: var(--bg-deep); border-bottom: 2px solid var(--glass-border);
      color: var(--text-secondary); font-weight: 700;
      text-transform: uppercase;
    }

    .list-row { transition: background 0.2s ease; border-bottom: 1px solid var(--glass-border); }
    .list-row:hover { background: rgba(37,99,235,0.02); }

    .avatar-box {
      width: 42px; height: 42px; background: var(--bg-deep);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--glass-border); color: var(--accent-primary);
      font-weight: 800; font-size: 1.1rem;
    }

    .badge-code {
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600;
      background: var(--bg-deep); padding: 4px 10px; border-radius: 6px;
      color: var(--text-primary);
    }

    .status-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700;
      background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;
    }
    .status-pill.active {
      background: #ecfdf5; color: #065f46; border-color: #a7f3d0;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
    .active .status-dot { background: #10b981; box-shadow: 0 0 8px #10b981; }

    .action-btn {
      width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--glass-border);
      background: white; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .action-btn.edit:hover { background: var(--accent-primary); color: white; border-color: var(--accent-primary); transform: scale(1.1); }
    .action-btn.delete:hover { background: #ef4444; color: white; border-color: #ef4444; transform: scale(1.1); }

    .empty-icon-box {
      width: 80px; height: 80px; background: var(--bg-deep);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }

    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
      z-index: 100;
    }

    .modality-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .mod-presencial { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .mod-virtual { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .mod-hibrido { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .mod-terreno { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

    .avatar-box { position: relative; }
    .leader-badge {
      position: absolute; bottom: -2px; right: -2px;
      width: 18px; height: 18px; background: #fbbf24; color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out forwards;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TrabajadoresListComponent implements OnInit {
  trabajadores: TrabajadorResponse[] = [];

  // Pagination State
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  // Form State
  showForm: boolean = false;
  selectedTrabajador: TrabajadorResponse | null = null;

  constructor(
    private trabajadorService: TrabajadorService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  getModalidadLabel(id?: number): string {
    switch(id) {
      case 1: return 'Presencial';
      case 2: return 'Virtual';
      case 3: return 'Híbrido';
      case 4: return 'Terreno';
      default: return 'No asignado';
    }
  }

  getModalidadClass(id?: number): string {
    switch(id) {
      case 1: return 'mod-presencial';
      case 2: return 'mod-virtual';
      case 3: return 'mod-hibrido';
      case 4: return 'mod-terreno';
      default: return 'bg-light text-muted';
    }
  }

  getModalidadIcon(id?: number): string {
    switch(id) {
      case 1: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>';
      case 2: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
      case 3: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 3h5v5"></path><path d="M8 3H3v5"></path><path d="M12 21v-4"></path><path d="M8 21h8"></path><path d="M3 11h18"></path></svg>';
      case 4: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
      default: return '';
    }
  }

  cargarTrabajadores(): void {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC'
    };

    this.trabajadorService.listarPaginado(request).subscribe({
      next: (response) => {
        this.trabajadores = response.content || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: () => {
        this.notify.error('Error al cargar la lista de trabajadores');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarTrabajadores();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page
    this.cargarTrabajadores();
  }

  onNuevo(): void {
    this.selectedTrabajador = null;
    this.showForm = true;
  }

  onVer(t: TrabajadorResponse): void {
    this.selectedTrabajador = t;
    this.showForm = true;
  }

  onCloseForm(): void {
    this.showForm = false;
    this.selectedTrabajador = null;
  }

  onSave(request: TrabajadorRequest): void {
    this.isLoading = true;
    const observer = {
      next: () => {
        this.notify.success(this.selectedTrabajador ? 'Trabajador actualizado' : 'Trabajador creado');
        this.onCloseForm();
        this.cargarTrabajadores();
      },
      error: () => {
        this.notify.error('Error al guardar trabajador');
        this.isLoading = false;
      }
    };

    if (this.selectedTrabajador) {
      this.trabajadorService.actualizar(this.selectedTrabajador.id, request).subscribe(observer);
    } else {
      this.trabajadorService.crear(request).subscribe(observer);
    }
  }

  async onEliminar(t: TrabajadorResponse): Promise<void> {
    const confirm = await this.notify.confirm(
      '¿Estás seguro?',
      `Deseas eliminar a ${t.nombres}.Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    );

    if (confirm) {
      this.isLoading = true;
      this.trabajadorService.eliminar(t.id).subscribe({
        next: () => {
          this.notify.success('Trabajador eliminado');
          this.cargarTrabajadores();
        },
        error: () => {
          this.notify.error('No se pudo eliminar el trabajador');
          this.isLoading = false;
        }
      });
    }
  }
}
