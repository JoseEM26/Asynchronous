import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';
import { NotificationService } from '../../services/notification.service';
import { AsistenciaRequest, AsistenciaResponse } from '../../models/asistencia.interface';
import { PaginationComponent } from '../../component/pagination.component/pagination.component';
import { PageRequest } from '../../models/pagination.interface';
import { FormAsistenciaComponent } from './form-asistencia.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-asistencias-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormAsistenciaComponent],
  template: `
    <div class="container-fluid animate-fade px-4 py-4">
      <div class="row mb-5 align-items-end">
        <div class="col-md-7">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="icon-box-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h1 class="h2 fw-bold mb-0">
              {{ isWorker ? 'Mis Asistencias' : 'Registro de Asistencias' }}
            </h1>
          </div>
          <p class="text-secondary fs-6 opacity-75">
            {{ isWorker ? 'Consulta tu historial personal de ingresos y salidas.' : 'Historial cronológico de registros de entrada y salida del personal.' }}
          </p>
        </div>
        <div class="col-md-5 text-md-end d-flex gap-3 justify-content-md-end">
          <button class="btn btn-light shadow-sm d-inline-flex align-items-center gap-2" (click)="cargarAsistencias()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Actualizar
          </button>
          <button *ngIf="!isWorker" class="btn btn-primary-grad shadow-sm d-inline-flex align-items-center gap-2" (click)="onNuevo()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Registro
          </button>
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
                  <th class="ps-4 py-3 text-uppercase small ls-1">Trabajador</th>
                  <th class="py-3 text-uppercase small ls-1">Fecha y Hora</th>
                  <th class="py-3 text-uppercase small ls-1">Modalidad</th>
                  <th class="text-end pe-4 py-3 text-uppercase small ls-1">Tipo de Movimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of (asistencias || [])" class="list-row animate-slide-up" style="background: var(--bg-surface) !important;">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3 py-1" *ngIf="a.trabajador">
                      <div class="avatar-box">
                        <span class="avatar-text">{{ a.trabajador.nombres ? a.trabajador.nombres[0] : '?' }}</span>
                      </div>
                      <div class="user-info">
                        <div class="fw-bold text-primary-hover lh-1 mb-1" style="color: var(--text-main) !important;">{{ a.trabajador.nombres }} {{ a.trabajador.apellidos }}</div>
                        <div class="small fw-medium opacity-75" style="color: var(--text-secondary) !important;">{{ a.trabajador.dni }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column lh-1">
                      <span class="fw-bold small text-primary mb-1">{{ a.fechaHora | date:'EEEE d, MMM' | uppercase }}</span>
                      <span class="badge-code">{{ a.fechaHora | date:'HH:mm:ss' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="modality-badge" [ngClass]="getModalidadClass(a.modalidad.id)">
                      <i [innerHTML]="getModalidadIcon(a.modalidad.id)"></i>
                      <span>{{ a.modalidad.nombre }}</span>
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="status-pill" [ngClass]="a.tipo === 'ENTRADA' ? 'active entrada' : 'salida'">
                      <span class="status-dot"></span>
                      {{ a.tipo }}
                    </div>
                  </td>
                </tr>
                <tr *ngIf="(asistencias.length || 0) === 0 && !isLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state py-5">
                      <div class="empty-icon-box mx-auto mb-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-25"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <h5 class="fw-bold mb-1">Sin Actividad</h5>
                      <p class="text-secondary small">No hay registros de asistencia para el período seleccionado.</p>
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
    .ls-1 { letter-spacing: 0.05rem; }

    .icon-box-primary {
      padding: 10px; background: var(--grad-main); color: var(--bg-main);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
    }

    .glass-card { background: var(--glass-bg, var(--bg-surface)); }
    .table-custom { border-collapse: separate; border-spacing: 0; width: 100%; }
    .table-custom tr.list-row { background: var(--bg-surface); transition: background 0.2s ease; border-bottom: 1px solid var(--glass-border); }
    .table-custom td { color: var(--text-main); }
    .list-row:hover { background: rgba(249,115,22,0.05); }

    .avatar-box {
      width: 42px; height: 42px; background: var(--bg-deep);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--glass-border); color: var(--accent-primary);
      font-weight: 800; font-size: 1.1rem;
    }

    .badge-code {
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600;
      background: var(--bg-deep); padding: 2px 8px; border-radius: 4px;
      color: var(--accent-primary); width: fit-content; border: 1px solid var(--glass-border);
    }

    .status-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700;
      background: var(--bg-deep); color: var(--text-primary); border: 1px solid var(--glass-border);
    }
    .status-pill.entrada { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
    .status-pill.salida { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); }
    .entrada .status-dot { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
    .salida .status-dot { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }

    .modality-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .mod-presencial { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .mod-virtual { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .mod-hibrido { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .mod-terreno { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

    .empty-icon-box {
      width: 80px; height: 80px; background: var(--bg-deep);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }

    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
      z-index: 100;
    }

    .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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

  isWorker: boolean = false;
  trabajadorId?: number;

  constructor(
    private asistenciaService: AsistenciaService,
    private notify: NotificationService,
    private authService: AuthService
  ) { 
    const user = this.authService.currentUserValue;
    const roleId = user?.rol?.id;
    // Roles 4 y 5 son trabajadores
    this.isWorker = roleId === 4 || roleId === 5;
    this.trabajadorId = user?.trabajador?.id;
  }

  ngOnInit(): void {
    this.cargarAsistencias();
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

  getModalidadIcon(id?: number): string {
    switch (id) {
      case 1: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>';
      case 2: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
      case 3: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 3h5v5"></path><path d="M8 3H3v5"></path><path d="M12 21v-4"></path><path d="M8 21h8"></path><path d="M3 11h18"></path></svg>';
      case 4: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
      default: return '';
    }
  }

  cargarAsistencias(): void {
    this.isLoading = true;
    const request: PageRequest = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'id',
      sortDir: 'DESC'
    };

    const observable = (this.isWorker && this.trabajadorId)
      ? this.asistenciaService.listarPaginadoPorTrabajador(this.trabajadorId, request)
      : this.asistenciaService.listarPaginado(request);

    observable.subscribe({
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
