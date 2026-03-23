import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-qr-asistencia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid animate-fade">
      <div class="row min-vh-75 align-items-center justify-content-center">
        <div class="col-md-6 col-lg-5 text-center">
          <div class="glass-card p-5 qr-card">
            <h2 class="display-6 fw-bold mb-2">QR de Asistencia</h2>
            <p class="text-secondary mb-5">Escanea este código desde la App Móvil para registrar tu entrada/salida.</p>

            <div class="qr-wrapper mb-5" [class.animate-pulse-slow]="!isRefreshing">
              <img [src]="qrUrl" alt="QR Code" class="qr-image shadow-lg" *ngIf="qrUrl">
              <div class="qr-placeholder" *ngIf="!qrUrl && !isRefreshing">
                 <p class="text-muted">No se pudo cargar el QR</p>
              </div>
              <div class="qr-overlay" *ngIf="isRefreshing">
                 <div class="spinner-border text-primary" role="status"></div>
              </div>
            </div>

            <div class="timer-container p-3 mb-2">
              <div class="d-flex justify-content-between mb-2 px-2">
                <span class="text-secondary small fw-bold">PROXIMA ACTUALIZACIÓN</span>
                <span class="text-primary small fw-bold">{{ timeLeftDisplay }}</span>
              </div>
              <div class="progress-base">
                <div class="progress-bar-fill" [style.width.%]="progressWidth"></div>
              </div>
            </div>

            <p class="small text-muted mt-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Seguridad de Backend — Válido por 5 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-card {
      border: 1px solid var(--glass-border);
      background: var(--bg-surface);
      box-shadow: var(--shadow-xl);
    }
    .qr-wrapper {
      position: relative;
      display: inline-block;
      padding: 20px;
      background: white;
      border-radius: 24px;
      box-shadow: var(--shadow-md);
      min-width: 320px;
      min-height: 320px;
    }
    .qr-image {
      width: 280px;
      height: 280px;
      display: block;
    }
    .qr-placeholder {
      display: flex; align-items: center; justify-content: center; height: 280px; width: 280px;
    }
    .qr-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 24px;
    }
    .timer-container {
      background: var(--bg-deep);
      border-radius: 16px;
    }
    .progress-base {
      height: 6px;
      background: rgba(0,0,0,0.05);
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
      50% { transform: scale(1.02); }
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
        const data = JSON.stringify({
          system: 'ASYNCHRONOUS',
          token: resp.token,
          ts: resp.timestamp,
          source: 'BACKEND'
        });
        
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}&bgcolor=FFFFFF&color=0F172A&margin=2`;
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
