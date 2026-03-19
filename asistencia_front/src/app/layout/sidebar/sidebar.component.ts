import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside class="sidebar-aside glass-card" [class.mobile-open]="sidebarService.isOpen$ | async">
      <div class="sidebar-logo">
        <div class="logo-flex">
          <div class="logo-circle">A</div>
          <span class="logo-name">Asynchronous</span>
        </div>
        <button class="btn-close-sidebar d-lg-none" (click)="sidebarService.close()">✕</button>
      </div>
      
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link" (click)="onLinkClick()">
          <span class="sidebar-icon">📊</span>
          <span class="sidebar-text">Dashboard</span>
        </a>
        <a routerLink="/trabajadores" routerLinkActive="active" class="sidebar-link" (click)="onLinkClick()">
          <span class="sidebar-icon">👥</span>
          <span class="sidebar-text">Trabajadores</span>
        </a>
        <a routerLink="/usuarios" routerLinkActive="active" class="sidebar-link" (click)="onLinkClick()">
          <span class="sidebar-icon">🔑</span>
          <span class="sidebar-text">Usuarios</span>
        </a>
        <a routerLink="/asistencias" routerLinkActive="active" class="sidebar-link" (click)="onLinkClick()">
          <span class="sidebar-icon">📅</span>
          <span class="sidebar-text">Asistencias</span>
        </a>
        <a routerLink="/configuracion" routerLinkActive="active" class="sidebar-link" (click)="onLinkClick()">
          <span class="sidebar-icon">⚙️</span>
          <span class="sidebar-text">Configuración</span>
        </a>
      </nav>

      <div class="sidebar-profile">
        <div class="profile-card">
          <div class="profile-avatar">AD</div>
          <div class="profile-info">
            <span class="profile-name">Administrador</span>
            <span class="profile-status">En línea</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-aside {
      width: var(--sidebar-width);
      height: calc(100vh - 40px);
      position: fixed;
      left: 20px;
      top: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: var(--transition-smooth);
      background: var(--bg-surface);
      border: 1px solid rgba(0,0,0,0.05);
    }

    [data-theme='dark'] .sidebar-aside {
      border-color: var(--glass-border);
      background: var(--glass-bg);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    .logo-flex {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-close-sidebar {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
    }

    .logo-circle {
      width: 40px;
      height: 40px;
      background: var(--grad-main);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
    }

    .logo-name {
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: -0.5px;
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 14px;
      text-decoration: none;
      color: var(--text-secondary);
      transition: var(--transition-smooth);
      font-weight: 500;
    }

    .sidebar-link span.sidebar-icon {
      font-size: 1.2rem;
    }

    .sidebar-link:hover {
      background: rgba(0, 0, 0, 0.03);
      color: var(--text-primary);
    }

    [data-theme='dark'] .sidebar-link:hover {
       background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-link.active {
      background: var(--grad-main);
      color: #fff;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }

    .sidebar-profile {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    [data-theme='dark'] .sidebar-profile {
      border-color: var(--glass-border);
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0,0,0,0.02);
      padding: 12px;
      border-radius: 16px;
    }

    [data-theme='dark'] .profile-card {
      background: rgba(255,255,255,0.03);
    }

    .profile-avatar {
      width: 40px;
      height: 40px;
      background: var(--grad-main);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      color: #fff;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .profile-name { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
    .profile-status { font-size: 0.75rem; color: #10b981; font-weight: 500; }

    @media (max-width: 1024px) {
      .sidebar-aside {
        left: 0;
        top: 0;
        height: 100vh;
        border-radius: 0;
        width: 280px;
        transform: translateX(-100%);
        box-shadow: 20px 0 50px rgba(0,0,0,0.1);
      }
      .sidebar-aside.mobile-open {
        transform: translateX(0);
        left: 0;
      }
    }
  `]
})
export class SidebarComponent {
  constructor(public sidebarService: SidebarService) { }

  onLinkClick(): void {
    if (window.innerWidth <= 1024) {
      this.sidebarService.close();
    }
  }
}
