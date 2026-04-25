import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside class="sidebar" [class.mobile-open]="sidebarService.isOpen$ | async">
      <div class="sidebar-header">
        <div class="logo-area">
          <div class="logo-box">
             <img src="logo.jpeg" alt="Logo" class="logo-img-fluid" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
          </div>
          <div class="logo-text">
            <span class="logo-title">Geocheck</span>
            <span class="logo-subtitle">Management v2</span>
          </div>
        </div>
        <button class="btn-sidebar-close d-lg-none" (click)="sidebarService.close()" aria-label="Close sidebar">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div class="sidebar-content">
        <nav class="nav-section">
          <span class="nav-label">Main Menu</span>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="nav-text">Dashboard</span>
          </a>
          <a routerLink="/trabajadores" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span class="nav-text">Trabajadores</span>
          </a>
          <a routerLink="/usuarios" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span class="nav-text">Usuarios</span>
          </a>
          <a routerLink="/asistencias" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="nav-text">Asistencias</span>
          </a>
          <a routerLink="/qr-generator" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect></svg>
            <span class="nav-text">Generar QR</span>
          </a>
          <a routerLink="/comunicados" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span class="nav-text">Comunicados</span>
          </a>
        </nav>

        <nav class="nav-section">
          <span class="nav-label">System</span>
           <a routerLink="/configuracion" routerLinkActive="active" class="nav-link" (click)="onLinkClick()">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span class="nav-text">Configuración</span>
          </a>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="user-block">
          <div class="user-avatar" style="overflow: hidden;">
             <img src="logo.jpeg" alt="User" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="user-meta">
            <span class="user-role">Administrator</span>
            <span class="user-status"><span class="status-dot"></span> Active</span>
          </div>
          <button class="btn-logout" title="Logout" (click)="onLogout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: var(--bg-surface);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: var(--transition-smooth);
    }

    .dark-mode .sidebar {
      background: var(--bg-surface);
      border-right-color: var(--glass-border);
    }

    .sidebar-header {
      height: var(--header-height);
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-box {
      width: 38px;
      height: 38px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      padding: 2px;
    }

    .logo-img-fluid {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .logo-title {
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: -0.5px;
      color: var(--text-primary);
    }

    .logo-subtitle {
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sidebar-content {
      flex: 1;
      padding: 1.5rem 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-label {
      padding: 0 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition-fast);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .nav-link:hover {
      background: var(--bg-deep);
      color: var(--accent-primary);
    }

    .nav-link.active {
      background: rgba(37, 99, 235, 0.08);
      color: var(--accent-primary);
      font-weight: 600;
    }

    .nav-icon {
      flex-shrink: 0;
      opacity: 0.8;
    }

    .nav-link.active .nav-icon {
      color: var(--accent-primary);
      opacity: 1;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--glass-border);
      background: var(--bg-deep);
    }

    .user-block {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: var(--bg-surface);
      color: var(--text-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glass-border);
    }

    .user-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .user-status {
      font-size: 0.7rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--accent-success);
      border-radius: 50%;
    }

    .btn-logout {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: var(--transition-fast);
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--accent-danger);
    }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
        box-shadow: 20px 0 50px rgba(0,0,0,0.1);
      }
      .sidebar.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) { }

  onLinkClick(): void {
    if (window.innerWidth <= 1024) {
      this.sidebarService.close();
    }
  }

  onLogout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
