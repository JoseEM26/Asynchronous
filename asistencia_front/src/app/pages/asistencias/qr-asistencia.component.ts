import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-qr-asistencia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid animate-fade">
      <div class="row min-vh-75 align-items-center justify-content-center pt-4">
        <div class="col-md-6 col-lg-5 text-center">
          <div class="glass-card p-5 qr-card position-relative overflow-hidden">
            <!-- Decorative Accent -->
            <div class="accent-top"></div>
            
            <h2 class="display-6 fw-bold mb-2 text-primary">Escaneo QR</h2>
            <p class="text-secondary mb-5">Utiliza la App Móvil para registrar tu marcación.</p>

            <div class="qr-wrapper mb-5" [class.animate-pulse-slow]="!isRefreshing">
              <img [src]="qrUrl" alt="QR Code" class="qr-image shadow-sm" *ngIf="qrUrl">
              <div class="qr-placeholder" *ngIf="!qrUrl && !isRefreshing">
                 <p class="text-muted">No se pudo cargar el QR</p>
              </div>
              <div class="qr-overlay" *ngIf="isRefreshing">
                 <div class="spinner-border text-primary" role="status"></div>
              </div>
            </div>

            <div class="timer-container p-3 mb-4 mx-auto">
              <div class="d-flex justify-content-between mb-2 px-2">
                <span class="text-secondary small fw-bold">PRÓXIMA ACTUALIZACIÓN</span>
                <span class="text-primary small fw-bold">{{ timeLeftDisplay }}</span>
              </div>
              <div class="progress-base">
                <div class="progress-bar-fill" [style.width.%]="progressWidth"></div>
              </div>
            </div>

            <p class="small text-muted mt-2 mb-0 d-inline-flex align-items-center bg-light px-4 py-2 rounded-pill border">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Seguridad de Backend — Válido por 5 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-card {
      border: 1px solid rgba(249, 115, 22, 0.2);
      background: var(--bg-surface);
      box-shadow: 0 10px 30px rgba(71, 85, 105, 0.08), 0 0 40px rgba(249, 115, 22, 0.05);
      border-radius: 28px;
    }
    .accent-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: var(--grad-main);
    }
    .qr-wrapper {
      position: relative;
      display: inline-block;
      padding: 24px;
      background: white;
      border-radius: 28px;
      box-shadow: 0 15px 35px rgba(249, 115, 22, 0.15), 0 5px 15px rgba(71, 85, 105, 0.1);
      min-width: 300px;
      min-height: 300px;
      border: 1px solid rgba(249, 115, 22, 0.1);
    }
    .qr-image {
      width: 250px;
      height: 250px;
      display: block;
      border-radius: 12px;
    }
    .qr-placeholder {
      display: flex; align-items: center; justify-content: center; height: 250px; width: 250px;
    }
    .qr-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 28px;
      backdrop-filter: blur(2px);
    }
    .timer-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      max-width: 280px;
    }
    .progress-base {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--grad-main);
      transition: width 1s linear;
    }
    .animate-pulse-slow {
      animation: pulse 4s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
  `]
})
export class QrAsistenciaComponent implements OnInit, OnDestroy {
  qrUrl: string = '';
  lastUpdate: Date = new Date();
  isRefreshing: boolean = false;
  
  private totalTime = 300; 
  private currentTime = 300;
  private timer: any;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.generateQR();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  generateQR(): void {
    this.isRefreshing = true;
    
    this.asistenciaService.obtenerQr().subscribe({
      next: (resp) => {
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${resp.token}&bgcolor=FFFFFF&color=475569&margin=2`;
        this.lastUpdate = new Date(resp.timestamp);
        this.currentTime = resp.expiresIn || this.totalTime;
        this.isRefreshing = false;
      },
      error: () => {
        this.isRefreshing = false;
        // Fallback or error handled by service
      }
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.currentTime--;
      if (this.currentTime <= 0) {
        this.generateQR();
      }
    }, 1000);
  }

  get timeLeftDisplay(): string {
    const min = Math.max(0, Math.floor(this.currentTime / 60));
    const sec = Math.max(0, this.currentTime % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  get progressWidth(): number {
    return Math.max(0, (this.currentTime / this.totalTime) * 100);
  }
}
