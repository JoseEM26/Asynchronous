import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#14151e',
    color: '#ffffff',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  success(message: string): void {
    this.toast.fire({
      icon: 'success',
      title: message
    });
  }

  error(message: string): void {
    this.toast.fire({
      icon: 'error',
      title: message
    });
  }

  warning(message: string): void {
    this.toast.fire({
      icon: 'warning',
      title: message
    });
  }

  info(message: string): void {
    this.toast.fire({
      icon: 'info',
      title: message
    });
  }

  async confirm(title: string, text: string, confirmButtonText: string = 'Confirmar'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#475569',
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#1e293b',
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg',
        confirmButton: 'btn btn-primary-grad px-4 py-2 rounded-pill',
        cancelButton: 'btn btn-light px-4 py-2 rounded-pill ms-2'
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  }

  async showAnnouncements(htmlContent: string): Promise<void> {
    await Swal.fire({
      title: '📢 Avisos Importantes',
      html: `<div class="custom-scroll" style="max-height: 400px; overflow-y: auto;">${htmlContent}</div>`,
      confirmButtonText: 'Entendido, cerrar',
      confirmButtonColor: '#f97316',
      width: '600px',
      background: '#ffffff',
      color: '#1e293b',
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg',
        confirmButton: 'btn btn-primary-grad px-5 py-3 rounded-pill fw-bold mt-2'
      },
      buttonsStyling: false,
      allowOutsideClick: false
    });
  }
}
