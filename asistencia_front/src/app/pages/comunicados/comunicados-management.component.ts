import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicadoService } from '../../services/comunicado.service';
import { ComunicadoResponse, ComunicadoRequest } from '../../models/comunicado.interface';
import { FormComunicadoComponent } from './form-comunicado.component';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest, PaginatedResponse } from '../../models/pagination.interface';
import { NotificationService } from '../../services/notification.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-comunicados-management',
  standalone: true,
  imports: [CommonModule, FormComunicadoComponent, PaginationComponent, ReactiveFormsModule],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">Gestión de Comunicados</h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">Cree y administre avisos, alertas y noticias para la aplicación móvil iOS.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-primary-grad shadow-sm d-inline-flex align-items-center gap-2" (click)="onNuevo()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Comunicado
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
                class="form-control ps-5 pe-5 rounded-pill border-0 bg-light-subtle shadow-none" 
                placeholder="Buscar comunicado por título..."
                [formControl]="searchControl"
              >
              <button 
                *ngIf="searchFilter"
                class="btn-clear-search" 
                (click)="limpiarFiltros()"
                aria-label="Limpiar búsqueda">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
          <div class="col-lg-6 text-end">
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
                  <th class="ps-4 py-3 text-uppercase small ls-1">Fecha Pub.</th>
                  <th class="py-3 text-uppercase small ls-1">Comunicado</th>
                  <th class="py-3 text-uppercase small ls-1">Tipo</th>
                  <th class="py-3 text-uppercase small ls-1">Vigencia</th>
                  <th class="py-3 text-uppercase small ls-1">Estado</th>
                  <th class="text-end pe-4 py-3 text-uppercase small ls-1">Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of comunicados" class="list-row animate-slide-up">
                  <td class="ps-4">
                    <span class="small fw-bold text-secondary">{{ item.fechaPublicacion | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-bold text-primary-hover mb-0">{{ item.titulo }}</span>
                      <small class="text-muted text-truncate" style="max-width: 300px;">{{ item.contenido }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(item.tipo)">{{ item.tipo }}</span>
                  </td>
                  <td>
                    <span class="small text-secondary">{{ item.fechaExpiracion ? (item.fechaExpiracion | date:'dd/MM/yyyy') : 'Permanente' }}</span>
                  </td>
                  <td>
                    <div class="status-pill" [class.active]="item.activo">
                      <span class="status-dot"></span>
                      {{ item.activo ? 'Publicado' : 'Borrador' }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="action-btn edit" (click)="onEditar(item)" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                      <button 
                        class="action-btn" 
                        [class.status-deactivate]="item.activo" 
                        [class.status-activate]="!item.activo" 
                        (click)="onToggleActivo(item)" 
                        [title]="item.activo ? 'Desactivar' : 'Activar'">
                        <svg *ngIf="item.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                        <svg *ngIf="!item.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                      <button class="action-btn btn-delete-red" (click)="onEliminar(item)" title="Eliminar Permanentemente">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="comunicados.length === 0 && !isLoading">
                  <td colspan="6" class="text-center py-5">
                    <div class="empty-state py-5">
                      <div class="empty-icon-box mx-auto mb-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-25"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </div>
                      <h5 class="fw-bold mb-1">Sin Comunicados</h5>
                      <p class="text-secondary small">No hay anuncios registrados que coincidan con la búsqueda.</p>
                      <button class="btn btn-outline-primary btn-sm mt-3 px-4 rounded-pill" (click)="onNuevo()">Crear el primero</button>
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
            (refresh)="cargar()"
          ></app-pagination>
        </div>
      </div>

      <app-form-comunicado *ngIf="showForm" 
        [editData]="selectedItem"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)">
      </app-form-comunicado>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.05rem; }
    .search-input-group .search-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: var(--text-secondary); opacity: 0.5; z-index: 5;
    }
    .search-input-group .form-control {
      height: 45px; font-size: 0.9rem; transition: all 0.2s ease;
      border: 1px solid transparent !important;
    }
    .search-input-group .form-control:focus {
      background: white !important; border-color: var(--accent-primary) !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1) !important;
    }
    .btn-clear-search {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: var(--text-muted); cursor: pointer;
      padding: 4px; display: flex; align-items: center; transition: 0.2s;
    }
    .btn-clear-search:hover { color: var(--accent-danger); }
    .icon-box-primary {
      padding: 10px; background: var(--grad-main); color: white;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .main-list-card {
      border-radius: 20px; border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-xl); background: var(--bg-surface);
    }
    .table-custom thead th {
      background: var(--bg-deep); border-bottom: 2px solid var(--glass-border);
      color: var(--text-secondary); font-weight: 700;
    }
    .status-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700;
      background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;
    }
    .status-pill.active { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
    .active .status-dot { background: #10b981; box-shadow: 0 0 8px #10b981; }
    
    .action-btn {
      width: 32px; height: 32px; border-radius: 8px; border: none;
      background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center;
      transition: 0.2s; cursor: pointer;
    }
    .action-btn.edit:hover { background: #fef3c7; color: #b45309; }
    .status-deactivate:hover { background: #fee2e2; color: #b91c1c; }
    .status-activate:hover { background: #dcfce7; color: #15803d; }
    .btn-delete-red:hover { background: #ef4444; color: white; }

    .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
    .bg-info { background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; }
    .bg-alert { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .bg-urgent { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .empty-icon-box {
      width: 80px; height: 80px; background: var(--bg-deep);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
  `]
})
export class ComunicadosManagementComponent implements OnInit {
  comunicados: ComunicadoResponse[] = [];
  isLoading = false;
  showForm = false;
  selectedItem: ComunicadoResponse | null = null;

  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  searchControl = new FormControl('');
  private searchSub?: Subscription;

  get searchFilter(): string {
    return this.searchControl.value || '';
  }

  constructor(
    private comunicadoService: ComunicadoService,
    private notify: NotificationService
  ) {
    this.searchSub = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.cargar();
    });
  }

  ngOnDestroy(): void {
    if (this.searchSub) this.searchSub.unsubscribe();
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC',
      filters: this.searchControl.value ? { q: this.searchControl.value } : {}
    };

    this.comunicadoService.listarPaginado(request).subscribe({
      next: (res: PaginatedResponse<ComunicadoResponse>) => {
        this.comunicados = res.content || [];
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.notify.error('Error al cargar comunicados');
        this.isLoading = false;
      }
    });
  }

  // onSearchChange removed, using valueChanges subscription

  onNuevo() {
    this.selectedItem = null;
    this.showForm = true;
  }

  onEditar(item: ComunicadoResponse) {
    this.selectedItem = item;
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.selectedItem = null;
  }

  onSave(formValue: ComunicadoRequest) {
    this.isLoading = true;
    
    // Copy the request to transform fields
    const req = { ...formValue };

    // Fix: Backend expects LocalDateTime (ISO format with time). 
    // If empty string, set to null to avoid parsing errors.
    if (req.fechaExpiracion && req.fechaExpiracion.trim() !== '') {
      req.fechaExpiracion = `${req.fechaExpiracion}T23:59:59`;
    } else {
      delete req.fechaExpiracion;
    }

    const observer = {
      next: () => {
        this.notify.success(this.selectedItem ? 'Comunicado actualizado' : 'Comunicado publicado');
        this.onCloseForm();
        this.cargar();
      },
      error: (err: any) => {
        console.error('Error saving announcement:', err);
        this.notify.error('Error al guardar comunicado. Verifique los datos.');
        this.isLoading = false;
      }
    };

    if (this.selectedItem) {
      this.comunicadoService.actualizar(this.selectedItem.id, req).subscribe(observer);
    } else {
      this.comunicadoService.crear(req).subscribe(observer);
    }
  }

  async onToggleActivo(item: ComunicadoResponse) {
    const action = item.activo ? 'desactivar' : 'activar';
    const confirm = await this.notify.confirm(
      item.activo ? '¿Poner en borrador?' : '¿Publicar comunicado?',
      `El aviso "${item.titulo}" ${item.activo ? 'dejará de ser' : 'será'} visible para todos.`,
      item.activo ? 'Sí, desactivar' : 'Sí, publicar'
    );

    if (confirm) {
      this.isLoading = true;
      const request: ComunicadoRequest = { ...item, activo: !item.activo };
      this.comunicadoService.actualizar(item.id, request).subscribe({
        next: () => {
          this.notify.success(`Comunicado ${action}ado con éxito`);
          this.cargar();
        },
        error: () => {
          this.notify.error('Error al cambiar estado');
          this.isLoading = false;
        }
      });
    }
  }

  async onEliminar(item: ComunicadoResponse) {
    const confirm = await this.notify.confirm(
      '¿Eliminar permanentemente?',
      `Esta acción no se puede deshacer. Se borrará el comunicado "${item.titulo}".`,
      'Sí, eliminar'
    );

    if (confirm) {
      this.isLoading = true;
      this.comunicadoService.eliminar(item.id).subscribe({
        next: () => {
          this.notify.success('Comunicado eliminado');
          this.cargar();
        },
        error: () => {
          this.notify.error('Error al eliminar');
          this.isLoading = false;
        }
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cargar();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.cargar();
  }

  limpiarFiltros() {
    this.searchControl.setValue('', { emitEvent: true });
    this.currentPage = 0;
    this.cargar();
  }

  getBadgeClass(tipo: string) {
    if (tipo === 'ALERTA') return 'bg-alert';
    if (tipo === 'URGENTE') return 'bg-urgent';
    return 'bg-info';
  }
}
