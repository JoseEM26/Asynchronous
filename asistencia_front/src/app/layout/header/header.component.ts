import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="btn-menu d-lg-none" (click)="sidebarService.toggle()" aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="search-wrapper d-none d-md-flex">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search resources..." />
          <kbd class="search-kbd">/</kbd>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="status-badge d-none d-sm-flex">
          <span class="pulse-dot"></span>
          <span class="status-text">System Active</span>
        </div>
        <div class="divider d-none d-sm-block"></div>
        <button class="btn-action" title="Notifications">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
        <button class="btn-action d-none d-sm-flex" title="Settings">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: var(--header-height);
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 900;
      transition: var(--transition-smooth);
    }

    [data-theme='dark'] .header {
      background: var(--bg-surface);
      border-bottom-color: var(--glass-border);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-menu {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--border-radius-sm);
      transition: var(--transition-fast);
    }

    .btn-menu:hover {
      background: var(--bg-deep);
      border-color: var(--text-muted);
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-deep);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-sm);
      width: 320px;
      border: 1px solid transparent;
      transition: var(--transition-fast);
    }

    .search-wrapper:focus-within {
      background: var(--bg-surface);
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .search-icon {
      color: var(--text-muted);
    }

    .search-wrapper input {
      background: none;
      border: none;
      color: var(--text-primary);
      outline: none;
      width: 100%;
      font-size: 0.875rem;
    }

    .search-kbd {
      font-size: 0.75rem;
      padding: 2px 6px;
      background: var(--bg-surface);
      border: 1px solid var(--glass-border);
      border-radius: 4px;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-deep);
      padding: 0.375rem 0.875rem;
      border-radius: 99px;
      border: 1px solid var(--glass-border);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--accent-success);
      border-radius: 50%;
      position: relative;
    }

    .pulse-dot::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 2px solid var(--accent-success);
      animation: pulseAnim 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--glass-border);
    }

    .btn-action {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-sm);
      transition: var(--transition-fast);
    }

    .btn-action:hover {
      background: var(--bg-deep);
      color: var(--accent-primary);
    }

    @keyframes pulseAnim {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
  `]

})
export class HeaderComponent {
  constructor(public sidebarService: SidebarService) {}
}
