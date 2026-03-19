import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header glass-card">
      <div class="header-left">
        <button class="btn-menu d-lg-none" (click)="sidebarService.toggle()">
          <span class="icon-menu">☰</span>
        </button>
        <div class="search-bar d-none d-md-flex">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search operations..." />
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-icon">🔔</button>
        <button class="btn-icon d-none d-sm-block">⚙️</button>
        <div class="status-indicator d-none d-sm-flex">
          <span class="pulse"></span>
          System Online
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      margin: 20px 20px 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 900;
      background: var(--bg-surface);
      box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05);
    }

    [data-theme='dark'] .header {
      background: var(--glass-bg);
      box-shadow: var(--glass-shadow);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .btn-menu {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      transition: var(--transition-smooth);
    }

    .btn-menu:hover {
      background: rgba(0,0,0,0.05);
    }

    [data-theme='dark'] .btn-menu:hover {
      background: rgba(255,255,255,0.05);
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.03);
      padding: 8px 16px;
      border-radius: 12px;
      width: 300px;
    }

    [data-theme='dark'] .search-bar {
      background: rgba(255, 255, 255, 0.05);
    }

    .search-bar input {
      background: none;
      border: none;
      color: var(--text-primary);
      outline: none;
      width: 100%;
      font-size: 0.95rem;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-icon {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.25rem;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-icon:hover {
      color: var(--text-primary);
      transform: scale(1.1);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: var(--accent-secondary);
      background: rgba(0, 229, 255, 0.1);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .pulse {
      width: 8px;
      height: 8px;
      background: var(--accent-secondary);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--accent-secondary);
      animation: pulseAnim 2s infinite;
    }

    @keyframes pulseAnim {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class HeaderComponent {
  constructor(public sidebarService: SidebarService) {}
}
