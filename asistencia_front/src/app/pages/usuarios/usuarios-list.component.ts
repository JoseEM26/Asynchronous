import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { NotificationService } from '../../services/notification.service';
import { UsuarioRequest, UsuarioResponse } from '../../models/usuario.interface';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest, PaginatedResponse } from '../../models/pagination.interface';
import { FormUsuarioComponent } from './form-usuario.component';
import { DetailUsuarioComponent } from './detail-usuario.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, FormUsuarioComponent, DetailUsuarioComponent],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">Gestión de Accesos</h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">Configura las credenciales, roles y permisos de los usuarios administrativos.</p>
        </div>
        <div class="col-md-4">
          <div class="search-container position-relative">
            <input 
              type="text" 
              class="form-control search-input" 
              placeholder="Buscar por usuario o nombre..." 
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
            >
            <div class="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
        <div class="col-md-2 text-md-end">
          <button class="btn btn-primary-grad shadow-sm d-inline-flex align-items-center gap-2" (click)="onNuevo()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Acceso
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
                  <th class="ps-4 py-3 text-uppercase small ls-1">Usuario Vinculado</th>
                  <th class="py-3 text-uppercase small ls-1">Identificador</th>
                  <th class="py-3 text-uppercase small ls-1">Rol / Nivel</th>
                  <th class="py-3 text-uppercase small ls-1">Estado</th>
                  <th class="text-end pe-4 py-3 text-uppercase small ls-1">Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of (usuarios || [])" class="list-row animate-slide-up">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3 py-1">
                      <div class="avatar-box secondary">
                        <span class="avatar-text">{{ u.username ? u.username[0].toUpperCase() : '?' }}</span>
                      </div>
                      <div class="user-info" *ngIf="u.trabajador">
                        <div class="fw-bold text-primary-hover lh-1 mb-1">{{ u.trabajador.nombres }} {{ u.trabajador.apellidos }}</div>
                        <div class="small text-secondary fw-medium opacity-75">{{ u.trabajador.dni }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge-code">{{ u.username }}</span>
                  </td>
                  <td>
                    <span class="badge-role">{{ u.rol.nombre }}</span>
                  </td>
                  <td>
                    <div class="status-pill" [class.active]="u.activo">
                      <span class="status-dot"></span>
                      {{ u.activo ? 'Habilitado' : 'Suspendido' }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="action-btn view" (click)="onDetalle(u)" title="Ver Detalle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button class="action-btn edit" (click)="onEditar(u)" title="Editar Acceso">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                      <button 
                         class="action-btn" 
                         [class.delete]="u.activo" 
                         [class.activate]="!u.activo" 
                         (click)="onToggleActivo(u)" 
                         [title]="u.activo ? 'Desactivar Acceso' : 'Reactivar Acceso'">
                        <svg *ngIf="u.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                        <svg *ngIf="!u.activo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="(usuarios.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state py-5">
                      <div class="empty-icon-box mx-auto mb-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-25"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                      </div>
                      <h5 class="fw-bold mb-1">Sin Usuarios</h5>
                      <p class="text-secondary small">No hay cuentas de acceso configuradas todavía.</p>
                      <button class="btn btn-outline-primary btn-sm mt-3 px-4 rounded-pill" (click)="onNuevo()">Crear primer acceso</button>
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
            (refresh)="cargarUsuarios()"
          ></app-pagination>
        </div>
      </div>

      <app-form-usuario
        *ngIf="showForm"
        [editData]="selectedUsuario"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)"
      ></app-form-usuario>

      <app-detail-usuario
        *ngIf="showDetail"
        [usuario]="selectedUsuario"
        (close)="onCloseDetail()"
      ></app-detail-usuario>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.05rem; }
    .ls-1 { letter-spacing: 0.05rem; }
    .ls-1 { letter-spacing: 0.05rem; }

    .icon-box-secondary {
      padding: 10px; background: var(--grad-secondary); color: white;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
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
    .avatar-box.secondary { color: var(--accent-secondary); }

    .badge-code {
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600;
      background: var(--bg-deep); padding: 4px 10px; border-radius: 6px;
      color: var(--text-primary);
    }

    .badge-role {
      background: rgba(99, 102, 241, 0.1); color: #4f46e5;
      padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
    }

    .action-btn {
      width: 34px; height: 34px; border-radius: 10px; border: none;
      background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
    }
    .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    
    .action-btn.view:hover { background: #e0e7ff; color: #4338ca; }
    .action-btn.edit:hover { background: #fef3c7; color: #b45309; }
    .action-btn.delete:hover { background: #fee2e2; color: #b91c1c; }
    .action-btn.activate:hover { background: #dcfce7; color: #15803d; }

    .status-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700;
      background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;
    }
    .status-pill.active { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
    .status-pill.active .status-dot { background: #10b981; box-shadow: 0 0 8px #10b981; }

    .empty-icon-box {
      width: 80px; height: 80px; background: var(--bg-deep);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }

    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
      z-index: 100;
    }

    .search-container .search-input {
      padding-left: 45px; border-radius: 12px; border: 1px solid var(--glass-border);
      background: var(--bg-deep); transition: all 0.2s; height: 45px;
    }
    .search-container .search-input:focus {
      border-color: var(--accent-primary); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }
    .search-container .search-icon {
      position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
      color: var(--text-secondary); opacity: 0.5; pointer-events: none;
    }

    .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UsuariosListComponent implements OnInit, OnDestroy {
  usuarios: UsuarioResponse[] = [];

  // Pagination State
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  // Filter State
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Form State
  showForm: boolean = false;
  showDetail: boolean = false;
  selectedUsuario: UsuarioResponse | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.cargarUsuarios();
    });

    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC',
      filters: {
        q: this.searchTerm
      }
    };

    this.usuarioService.listarPaginado(request).subscribe({
      next: (response: PaginatedResponse<UsuarioResponse>) => {
        this.usuarios = response.content || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.currentPage || 0;
        this.isLoading = false;
      },
      error: () => {
        this.notify.error('Error al cargar usuarios');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarUsuarios();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.cargarUsuarios();
  }

  onNuevo(): void {
    this.selectedUsuario = null;
    this.showForm = true;
  }

  onDetalle(u: UsuarioResponse): void {
    this.selectedUsuario = u;
    this.showDetail = true;
  }

  onEditar(u: UsuarioResponse): void {
    this.selectedUsuario = u;
    this.showForm = true;
  }

  onCloseForm(): void {
    this.showForm = false;
    this.selectedUsuario = null;
  }

  onCloseDetail(): void {
    this.showDetail = false;
    this.selectedUsuario = null;
  }

  onSave(request: UsuarioRequest): void {
    this.isLoading = true;
    const observer = {
      next: () => {
        this.notify.success(this.selectedUsuario ? 'Acceso actualizado' : 'Acceso creado');
        this.onCloseForm();
        this.cargarUsuarios();
      },
      error: () => {
        this.notify.error('Error al guardar acceso');
        this.isLoading = false;
      }
    };

    if (this.selectedUsuario) {
      this.usuarioService.actualizar(this.selectedUsuario.id, request).subscribe(observer);
    } else {
      this.usuarioService.crear(request).subscribe(observer);
    }
  }

  async onToggleActivo(u: UsuarioResponse): Promise<void> {
    const action = u.activo ? 'desactivar' : 'reactivar';
    const confirm = await this.notify.confirm(
      u.activo ? '¿Desactivar acceso?' : '¿Reactivar acceso?',
      `Esta acción ${u.activo ? 'suspenderá' : 'restaurará'} el acceso para ${u.username}.`,
      u.activo ? 'Sí, desactivar' : 'Sí, reactivar'
    );

    if (confirm) {
      this.isLoading = true;
      if (u.activo) {
        this.usuarioService.desactivar(u.id).subscribe({
          next: () => {
            this.notify.success('Cuenta de usuario desactivada');
            this.cargarUsuarios();
          },
          error: () => {
            this.notify.error('Error al intentar desactivar');
            this.isLoading = false;
          }
        });
      } else {
        const request: UsuarioRequest = { ...u, trabajadorId: u.trabajador.id, rolId: u.rol.id, activo: true };
        this.usuarioService.actualizar(u.id, request).subscribe({
          next: () => {
            this.notify.success('Cuenta de usuario reactivada');
            this.cargarUsuarios();
          },
          error: () => {
            this.notify.error('Error al intentar reactivar');
            this.isLoading = false;
          }
        });
      }
    }
  }
}
