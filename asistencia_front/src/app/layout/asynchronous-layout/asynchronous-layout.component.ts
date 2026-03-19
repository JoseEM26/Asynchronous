import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asynchronous-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="layout-wrapper" [class.sidebar-open]="sidebarService.isOpen$ | async">
      <app-sidebar></app-sidebar>
      
      <div class="layout-main">
        <app-header></app-header>
        
        <main class="layout-content">
          <div class="content-container animate-fade">
             <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Backdrop for mobile -->
      <div class="mobile-backdrop" (click)="sidebarService.close()"></div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      width: 100%;
      min-height: 100vh;
      background: var(--bg-deep);
      transition: var(--transition-smooth);
    }

    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      min-width: 0;
      transition: var(--transition-smooth);
    }

    .layout-content {
      flex: 1;
      padding: 2rem;
      padding-top: 1rem;
      overflow-y: auto;
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      backdrop-filter: blur(4px);
      z-index: 950;
      opacity: 0;
      pointer-events: none;
      transition: var(--transition-smooth);
    }

    @media (max-width: 1024px) {
      .layout-main {
        margin-left: 0;
      }
      
      .sidebar-open .mobile-backdrop {
        opacity: 1;
        pointer-events: auto;
      }
    }

    @media (max-width: 768px) {
      .layout-content {
        padding: 1rem;
      }
    }
  `]
})
export class AsynchronousLayoutComponent {
  constructor(public sidebarService: SidebarService) { }
}
