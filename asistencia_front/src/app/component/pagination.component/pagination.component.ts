// src/app/shared/components/pagination/pagination.component.ts
import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() currentPage: number = 0;
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 0;
  @Input() pageSize: number = 10;
  @Input() showInfo: boolean = true;
  @Input() showSizeSelector: boolean = true;
  @Input() showNavigation: boolean = true;
  @Input() showPageNumbers: boolean = true;
  @Input() showJumpToPage: boolean = true;
  @Input() pageSizes: number[] = [10, 20, 50, 100];
  @Input() align: 'start' | 'center' | 'end' = 'center';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() isLoading: boolean = false;
  @Input() autoHide: boolean = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  showJumpInput: boolean = false;
  jumpToPage: number = 1;
  isMobile: boolean = false;
  private resizeListener: any;
  Math = Math;
  ngOnInit(): void {
    this.checkIfMobile();
    this.jumpToPage = this.currentPage + 1;
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupResizeListener(): void {
    this.resizeListener = () => this.checkIfMobile();
    window.addEventListener('resize', this.resizeListener);
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
    // Cerrar modal de salto si cambia de móvil a desktop
    if (!this.isMobile && this.showJumpInput) {
      this.showJumpInput = false;
    }
  }

  get showingFrom(): number {
    if (!this.totalItems || this.totalItems === 0) return 0;
    const current = this.currentPage || 0;
    const size = this.pageSize || 10;
    return (current * size) + 1;
  }

  get showingTo(): number {
    if (!this.totalItems || this.totalItems === 0) return 0;
    const current = this.currentPage || 0;
    const size = this.pageSize || 10;
    return Math.min((current + 1) * size, this.totalItems);
  }

  get isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  get isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  get hasResults(): boolean {
    return this.totalItems > 0;
  }

  get shouldShow(): boolean {
    if (!this.autoHide) return true;
    return this.totalItems > 0 || this.isLoading;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.pageChange.emit(page);
      this.jumpToPage = page + 1; // Actualizar el input
    }
  }

  changePageSize(size: number): void {
    if (size > 0) {
      this.pageSizeChange.emit(size);
      // Ir a primera página cuando cambia el tamaño
      if (this.currentPage !== 0) {
        setTimeout(() => this.goToPage(0), 0);
      }
    }
  }

  goToFirstPage(): void {
    this.goToPage(0);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  goToPrevPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  jumpToSpecificPage(): void {
    const page = this.jumpToPage - 1;
    if (page >= 0 && page < this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.goToPage(page);
    }
    this.showJumpInput = false;
  }

  toggleJumpInput(): void {
    if (this.isMobile) {
      this.showJumpInput = !this.showJumpInput;
      if (this.showJumpInput) {
        this.jumpToPage = this.currentPage + 1;
        // Bloquear scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } else {
      this.showJumpInput = !this.showJumpInput;
      if (this.showJumpInput) {
        this.jumpToPage = this.currentPage + 1;
        setTimeout(() => {
          const input = document.querySelector('.jump-input') as HTMLInputElement;
          if (input) {
            input.focus();
            input.select();
          }
        }, 0);
      }
    }
  }

  onRefresh(): void {
    if (!this.isLoading) {
      this.refresh.emit();
    }
  }

  closeMobileModal(): void {
    this.showJumpInput = false;
    document.body.style.overflow = '';
  }

  // Método para manejar teclas en el input
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.showJumpInput = false;
    } else if (event.key === 'Enter') {
      this.jumpToSpecificPage();
    }
  }
}
