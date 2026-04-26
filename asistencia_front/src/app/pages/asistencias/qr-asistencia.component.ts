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
                <span class="text-primary small fw-bold font-monospace">{{ timeLeftDisplay }}</span>
              </div>
              <div class="progress-base">
                <div class="progress-bar-fill" [style.width.%]="progressWidth"></div>
              </div>
            </div>

            <div class="d-flex justify-content-center gap-4 mt-2">
              <p class="small text-muted mb-0 d-inline-flex align-items-center px-4 py-2 rounded-pill border shadow-sm" style="background: var(--bg-deep);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Válido por 5 minutos
              </p>
              <p class="small text-muted mb-0 d-inline-flex align-items-center px-4 py-2 rounded-pill border shadow-sm" style="background: var(--bg-deep);">
                <span class="text-primary fw-bold me-2">{{ totalScansToday }}</span> Escaneos hoy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-card {
      border: 1px solid var(--glass-border);
      background: var(--bg-surface);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
      border-radius: 32px;
    }
    .accent-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 8px;
      background: var(--text-main);
    }
    .qr-wrapper {
      position: relative;
      display: inline-block;
      padding: 30px;
      background: white; /* QR codes usually need white background to be scannable */
      border-radius: 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--glass-border);
    }
    .qr-image { width: 250px; height: 250px; display: block; border-radius: 12px; }
    .qr-placeholder { display: flex; align-items: center; justify-content: center; height: 250px; width: 250px; }
    .qr-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.8);
      display: flex; align-items: center; justify-content: center; border-radius: 32px;
      backdrop-filter: blur(4px);
    }
    .timer-container {
      background: var(--bg-deep);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      max-width: 320px;
    }
    .progress-base {
      height: 8px;
      background: #f1f5f9;
      border-radius: 10px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--text-main);
      /* Use linear transition for the bar to make it feel smooth between updates */
      transition: width 0.1s linear;
    }
    .font-monospace { font-variant-numeric: tabular-nums; letter-spacing: 0.5px; }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.02); opacity: 0.95; }
    }
    .animate-pulse-slow { animation: pulse 4s infinite ease-in-out; }
  `]
})
export class QrAsistenciaComponent implements OnInit, OnDestroy {
  qrUrl: string = '';
  isRefreshing: boolean = false;
  totalScansToday: number = 312; // Realistic mock value
  
  private totalTimeMs = 300000; // 5 minutes in ms
  private timeRemainingMs = 300000;
  private lastTickTimestamp: number = 0;
  private timerId: any;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.generateQR();
    this.startFluidTimer();
  }

  ngOnDestroy(): void {
    if (this.timerId) cancelAnimationFrame(this.timerId);
  }

  generateQR(): void {
    this.isRefreshing = true;
    this.asistenciaService.obtenerQr().subscribe({
      next: (resp) => {
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${resp.token}&bgcolor=FFFFFF&color=0f172a&margin=2`;
        // Normalize to 5 mins if not provided
        const expiresInSeconds = resp.expiresIn || 300;
        this.totalTimeMs = expiresInSeconds * 1000;
        this.timeRemainingMs = this.totalTimeMs;
        this.lastTickTimestamp = performance.now();
        this.isRefreshing = false;
      },
      error: () => {
        this.isRefreshing = false;
        // Mock for demo if error
        this.qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=error&bgcolor=FFFFFF&color=0f172a&margin=2';
        this.timeRemainingMs = 300000;
        this.lastTickTimestamp = performance.now();
      }
    });
  }

  private startFluidTimer(): void {
    const tick = (timestamp: number) => {
      if (!this.lastTickTimestamp) this.lastTickTimestamp = timestamp;
      
      const elapsed = timestamp - this.lastTickTimestamp;
      this.lastTickTimestamp = timestamp;

      if (!this.isRefreshing) {
        this.timeRemainingMs -= elapsed;
        
        if (this.timeRemainingMs <= 0) {
          this.timeRemainingMs = 0;
          this.generateQR();
        }
      }

      this.timerId = requestAnimationFrame(tick);
    };

    this.timerId = requestAnimationFrame(tick);
  }

  get timeLeftDisplay(): string {
    const totalSeconds = Math.ceil(this.timeRemainingMs / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  get progressWidth(): number {
    const progress = (this.timeRemainingMs / this.totalTimeMs) * 100;
    return Math.max(0, Math.min(100, progress));
  }
}
