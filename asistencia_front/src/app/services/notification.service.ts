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
      confirmButtonColor: '#7c4dff',
      cancelButtonColor: '#ff5252',
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      background: '#14151e',
      color: '#ffffff'
    });
    return result.isConfirmed;
  }
}
