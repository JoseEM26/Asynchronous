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
    <div class="container-fluid animate-fade">
      <div class="row mb-4 align-items-center">
        <div class="col-md-7 text-start">
          <h1 class="display-6 fw-bold">Trabajadores</h1>
          <p class="text-secondary mb-0">Gestión de personal activo en el sistema.</p>
        </div>
        <div class="col-md-5 text-md-end mt-3 mt-md-0">
          <button class="btn btn-primary-grad px-4 py-2" (click)="onNuevo()">
            <span class="me-2">+</span> Nuevo Registro
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
                  <th class="ps-4">Trabajador</th>
                  <th>DNI</th>
                  <th class="d-none d-md-table-cell">Email</th>
                  <th>Estado</th>
                  <th class="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of (trabajadores || [])" class="align-middle">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-sm">{{ t.nombres ? t.nombres[0] : '?' }}</div>
                      <div>
                        <div class="fw-bold">{{ t.nombres }}</div>
                        <div class="small text-secondary">{{ t.apellidos }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-monospace">{{ t.dni }}</td>
                  <td class="d-none d-md-table-cell small text-secondary">{{ t.email }}</td>
                  <td>
                    <span class="status-badge" [class.active]="t.activo">
                      {{ t.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="btn btn-icon-light" (click)="onVer(t)" title="Ver">👁️</button>
                      <button class="btn btn-icon-light text-danger" (click)="onEliminar(t)" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="(trabajadores?.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="py-4">
                      <div class="mb-3 fs-1 opacity-25">📁</div>
                      <p class="text-secondary">No se encontraron trabajadores en la base de datos.</p>
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
    .btn-primary-grad:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(0,0,0,0.05);
      color: var(--text-secondary);
    }
    .status-badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }
    .avatar-sm {
      width: 32px;
      height: 32px;
      background: var(--grad-main);
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
      `Deseas eliminar a ${t.nombres}. Esta acción no se puede deshacer.`,
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
