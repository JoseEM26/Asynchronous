import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { NotificationService } from '../../services/notification.service';
import { UsuarioRequest, UsuarioResponse } from '../../models/usuario.interface';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest } from '../../models/pagination.interface';
import { FormUsuarioComponent } from './form-usuario.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormUsuarioComponent],
  template: `
    <div class="container-fluid animate-fade">
      <div class="row mb-4 align-items-center">
        <div class="col-md-7 text-start">
          <h1 class="display-6 fw-bold">Gestión de Usuarios</h1>
          <p class="text-secondary mb-0">Control de accesos y perfiles del sistema.</p>
        </div>
        <div class="col-md-5 text-md-end mt-3 mt-md-0">
          <button class="btn btn-primary-grad px-4 py-2" (click)="onNuevo()">
            <span class="me-2">+</span> Nuevo Usuario
          </button>
        </div>
      </div>

      <div class="glass-card overflow-hidden">
        <div class="position-relative">
          <div *ngIf="isLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th class="ps-4">Usuario</th>
                  <th>Username</th>
                  <th>Roles</th>
                  <th>Estado</th>
                  <th class="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of (usuarios || [])" class="align-middle">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-sm">{{ u.username ? u.username[0].toUpperCase() : '?' }}</div>
                      <div *ngIf="u.trabajador">
                        <div class="fw-bold">{{ u.trabajador.nombres }} {{ u.trabajador.apellidos }}</div>
                        <div class="small text-secondary">{{ u.trabajador.dni }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-monospace">{{ u.username }}</td>
                  <td>
                    <span class="badge bg-soft-primary">{{ u.rol.nombre }}</span>
                  </td>
                  <td>
                    <span class="status-badge active">Habilitado</span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="btn btn-icon-light" (click)="onVer(u)" title="Editar">✏️</button>
                      <button class="btn btn-icon-light text-danger" (click)="onEliminar(u)" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="(usuarios?.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="py-4">
                      <div class="mb-3 fs-1 opacity-25">👥</div>
                      <p class="text-secondary">No hay usuarios registrados que mostrar.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-3 border-top bg-light-subtle">
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
    </div>
  `,
  styles: [`
    h1 { background: var(--grad-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .btn-primary-grad {
      background: var(--grad-main);
      border: none;
      color: white;
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 600;
      transition: var(--transition-smooth);
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-primary-grad:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5); }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(0,0,0,0.05);
      color: var(--text-secondary);
    }
    .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
    
    .bg-soft-primary {
      background: rgba(99, 102, 241, 0.1);
      color: #4f46e5;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      background: var(--grad-secondary);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .btn-icon-light {
      background: rgba(0,0,0,0.03);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      transition: var(--transition-smooth);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-icon-light:hover { background: rgba(0,0,0,0.08); transform: translateY(-2px); }

    .loading-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];

  // Pagination State
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  // Form State
  showForm: boolean = false;
  selectedUsuario: UsuarioResponse | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC'
    };

    this.usuarioService.listarPaginado(request).subscribe({
      next: (response) => {
        this.usuarios = response.content || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
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

  onVer(u: UsuarioResponse): void {
    this.selectedUsuario = u;
    this.showForm = true;
  }

  onCloseForm(): void {
    this.showForm = false;
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
      this.usuarioService.crear(request).subscribe(observer);
    } else {
      this.usuarioService.crear(request).subscribe(observer);
    }
  }

  async onEliminar(u: UsuarioResponse): Promise<void> {
    const confirm = await this.notify.confirm(
      '¿Eliminar usuario?',
      `Esta acción suspenderá el acceso para ${u.username}.`,
      'Sí, eliminar'
    );

    if (confirm) {
      this.isLoading = true;
      this.usuarioService.eliminar(u.id).subscribe({
        next: () => {
          this.notify.success('Usuario eliminado');
          this.cargarUsuarios();
        },
        error: () => {
          this.notify.error('Error al eliminar');
          this.isLoading = false;
        }
      });
    }
  }
}
