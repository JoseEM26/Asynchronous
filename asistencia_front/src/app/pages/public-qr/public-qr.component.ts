import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-public-qr',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-qr-container">
      <div class="content-box animate-fade">
        <header class="text-center mb-5">
           <img src="logo.jpeg" alt="Logo" class="main-logo mb-3">
           <h1 class="display-5 fw-bold text-dark mb-1">Registro de Asistencia</h1>
           <p class="text-secondary lead">Escanea el código con tu App Geocheck</p>
        </header>

        <div class="qr-display-area">
           <div class="qr-card shadow-lg" [class.refreshing]="isRefreshing">
              <img [src]="qrUrl" alt="QR Code" class="qr-img" *ngIf="qrUrl">
              <div class="refresh-overlay" *ngIf="isRefreshing">
                 <div class="spinner-border text-primary" role="status"></div>
              </div>
           </div>
        </div>

        <footer class="text-center mt-5">
           <div class="timer-badge">
              <span class="pulse-dot"></span>
              Actualizando en: <strong>{{ timeLeftDisplay }}</strong>
           </div>
           <p class="small text-muted mt-4 opacity-50">SISTEMA DE ASISTENCIA — SEGURIDAD BIOMÉTRICA ACTIVA</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .public-qr-container {
      min-height: 100vh;
      width: 100%;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .content-box {
      width: 100%;
      max-width: 600px;
    }
    .main-logo {
      width: 100px;
      height: 100px;
      border-radius: 20px;
      object-fit: cover;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .qr-display-area {
      display: flex;
      justify-content: center;
      margin: 3rem 0;
    }
    .qr-card {
      background: white;
      padding: 30px;
      border-radius: 40px;
      border: 1px solid #e2e8f0;
      position: relative;
      transition: all 0.3s ease;
    }
    .qr-img {
      width: 350px;
      height: 350px;
      display: block;
    }
    .refresh-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 40px;
    }
    .timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 25px;
      background: white;
      border-radius: 50px;
      border: 1px solid #e2e8f0;
      font-size: 1.1rem;
      color: #64748b;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class PublicQrComponent implements OnInit, OnDestroy {
  qrUrl: string = '';
  isRefreshing: boolean = false;
  currentTime = 300;
  private timer: any;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.generateQR();
    this.timer = setInterval(() => {
      this.currentTime--;
      if (this.currentTime <= 0) this.generateQR();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  generateQR(): void {
    this.isRefreshing = true;
    this.asistenciaService.obtenerQr().subscribe({
      next: (resp) => {
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${resp.token}&bgcolor=FFFFFF&color=1e293b&margin=2`;
        this.currentTime = resp.expiresIn || 300;
        this.isRefreshing = false;
      },
      error: () => this.isRefreshing = false
    });
  }

  get timeLeftDisplay(): string {
    const min = Math.floor(this.currentTime / 60);
    const sec = this.currentTime % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
}
