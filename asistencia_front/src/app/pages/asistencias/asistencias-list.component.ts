import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';
import { NotificationService } from '../../services/notification.service';
import { AsistenciaRequest, AsistenciaResponse } from '../../models/asistencia.interface';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest } from '../../models/pagination.interface';
import { FormAsistenciaComponent } from './form-asistencia.component';

@Component({
  selector: 'app-asistencias-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormAsistenciaComponent],
  template: `
    <div class="container-fluid animate-fade">
      <div class="row mb-4 align-items-center">
        <div class="col-md-7 text-start">
          <h1 class="display-6 fw-bold">Registro de Asistencias</h1>
          <p class="text-secondary mb-0">Historial completo de entradas y salidas.</p>
        </div>
        <div class="col-md-5 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
          <button class="btn btn-light-grad px-4 py-2" (click)="cargarAsistencias()">
            <span class="me-2">🔄</span> Actualizar
          </button>
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
                  <th>Fecha y Hora</th>
                  <th>Modalidad</th>
                  <th class="text-end pe-4">Movimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of (asistencias || [])" class="align-middle">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3" *ngIf="a.trabajador">
                      <div class="avatar-sm">{{ a.trabajador.nombres ? a.trabajador.nombres[0] : '?' }}</div>
                      <div>
                        <div class="fw-bold">{{ a.trabajador.nombres }} {{ a.trabajador.apellidos }}</div>
                        <div class="small text-secondary">{{ a.trabajador.dni }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-monospace small">
                    {{ a.fechaHora | date:'dd/MM/yyyy HH:mm:ss' }}
                  </td>
                  <td>
                    <span class="text-secondary small">{{ a.modalidad.nombre }}</span>
                  </td>
                  <td class="text-end pe-4">
                    <span class="badge" [ngClass]="a.tipo === 'ENTRADA' ? 'bg-soft-success' : 'bg-soft-danger'">
                      {{ a.tipo }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="(asistencias?.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="py-4">
                      <div class="mb-3 fs-1 opacity-25">📅</div>
                      <p class="text-secondary">No hay registros de asistencia hoy.</p>
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
            (refresh)="cargarAsistencias()"
          ></app-pagination>
        </div>
      </div>

      <app-form-asistencia
        *ngIf="showForm"
        [isLoading]="isLoading"
        (close)="onCloseForm()"
        (save)="onSave($event)"
      ></app-form-asistencia>
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
    }
    .btn-primary-grad:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
    
    .btn-light-grad {
      background: var(--bg-deep);
      border: 1px solid rgba(0,0,0,0.05);
      color: var(--text-primary);
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .btn-light-grad:hover { background: rgba(0,0,0,0.08); }

    .bg-soft-success { background: rgba(16, 185, 129, 0.1); color: #059669; }
    .bg-soft-warning { background: rgba(245, 158, 11, 0.1); color: #d97706; }
    .bg-soft-danger { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
    
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
export class AsistenciasListComponent implements OnInit {
  asistencias: AsistenciaResponse[] = [];

  // Pagination State
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  // Form State
  showForm: boolean = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias(): void {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC'
    };

    this.asistenciaService.listarPaginado(request).subscribe({
      next: (response) => {
        this.asistencias = response.content || [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: () => {
        this.notify.error('Error al cargar historial de asistencias');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarAsistencias();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.cargarAsistencias();
  }

  onNuevo(): void {
    this.showForm = true;
  }

  onCloseForm(): void {
    this.showForm = false;
  }

  onSave(request: AsistenciaRequest): void {
    this.isLoading = true;
    this.asistenciaService.registrar(request).subscribe({
      next: () => {
        this.notify.success('Asistencia registrada correctamente');
        this.onCloseForm();
        this.cargarAsistencias();
      },
      error: () => {
        this.notify.error('Error al registrar asistencia');
        this.isLoading = false;
      }
    });
  }

  onVer(a: AsistenciaResponse): void {
    this.notify.info(`Detalle: ${a.tipo} - ${a.trabajador.nombres}`);
  }
}
