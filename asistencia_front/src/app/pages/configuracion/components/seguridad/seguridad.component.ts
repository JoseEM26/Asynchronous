import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../../../../services/configuracion.service';
import { NotificationService } from '../../../../services/notification.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-config-seguridad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})
export class SeguridadComponent implements OnInit {
  @Input() geoConfig: any = { qrRefreshTime: 5 };
  isAdmin: boolean = false;
  lastChangeDate: Date = new Date();

  constructor(
    private configService: ConfiguracionService,
    private notify: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 1;
  }

  saveSecurity(): void {
    if (this.geoConfig.qrRefreshTime) {
      localStorage.setItem('qrRefreshTime', this.geoConfig.qrRefreshTime.toString());
      this.lastChangeDate = new Date();
    }
    this.configService.actualizar(this.geoConfig).subscribe({
      next: () => {
        this.notify.success('Configuración de seguridad guardada');
      },
      error: () => this.notify.error('Error al guardar configuración')
    });
  }

  saveGeo(): void { // Alias for compatibility
    this.saveSecurity();
  }
}
