import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as qrcode from 'qrcode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <!-- Animated Background Shapes -->
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>

      <div class="login-card-wrapper animate-slide-up">
        <div class="login-card-glass premium-glow">
          <div class="text-center mb-5">
            <div class="logo-outer-ring mx-auto mb-4 pulse-animation">
              <div class="logo-inner-box">
                <img src="logo.jpeg" alt="Logo" class="login-logo">
              </div>
            </div>
            <h1 class="login-title gradient-text">GeoCheck</h1>
            <p class="login-subtitle">Acceso Seguro Avanzado</p>
          </div>

          <form *ngIf="step === 'credentials'" [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form animate-fade">
            <div class="form-group-modern mb-4">
              <label>Identificador de Usuario</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input type="text" formControlName="username" placeholder="Ingresa tu usuario" autocomplete="username">
              </div>
            </div>

            <div class="form-group-modern mb-5">
              <label>Contraseña Segura</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" autocomplete="current-password" style="padding-right: 48px;">
                <button type="button" class="password-toggle-btn" (click)="togglePassword()" tabindex="-1" title="Mostrar/Ocultar contraseña">
                  <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-submit-premium" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading">Acceder al Sistema</span>
              <div *ngIf="isLoading" class="spinner-border spinner-border-sm"></div>
            </button>

            <div class="error-msg-premium animate-fade" *ngIf="error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ error }}
            </div>
          </form>

          <form *ngIf="step === '2fa'" [formGroup]="twoFactorForm" (ngSubmit)="onVerify2FA()" class="login-form animate-fade">
            <div class="form-group-modern mb-4">
              <label>Código de Google Authenticator</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <input type="text" formControlName="code" placeholder="000000" maxlength="6" autocomplete="off" class="text-center text-tracking-widest">
              </div>
            </div>

            <button type="submit" class="btn-submit-premium mb-3" [disabled]="twoFactorForm.invalid || isLoading">
              <span *ngIf="!isLoading">Verificar Código</span>
              <div *ngIf="isLoading" class="spinner-border spinner-border-sm"></div>
            </button>
            
            <button type="button" class="btn-back-premium" (click)="goBack()" [disabled]="isLoading">
              Volver
            </button>

            <div class="error-msg-premium animate-fade" *ngIf="error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ error }}
            </div>

            <div class="mt-4 text-center">
              <button type="button" class="btn-recovery-link" (click)="onRecover2FA()">
                ¿Perdiste tu acceso 2FA? Recuperar aquí
              </button>
            </div>
          </form>
          <form *ngIf="step === 'setup-2fa'" [formGroup]="twoFactorForm" (ngSubmit)="onVerify2FA()" class="login-form animate-fade">
            <div class="qr-container mb-4 text-center">
              <div class="qr-wrapper mx-auto">
                <div class="qr-glass-border">
                  <img [src]="qrCodeImage" alt="QR Code 2FA" *ngIf="qrCodeImage" class="qr-image">
                </div>
              </div>
              <p class="qr-instructions mt-3">
                Escanea este código con tu app de <strong>Google Authenticator</strong> para vincular tu cuenta.
              </p>
            </div>

            <div class="form-group-modern mb-4">
              <label>Código de Confirmación</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <input type="text" formControlName="code" placeholder="000000" maxlength="6" autocomplete="off" class="text-center text-tracking-widest">
              </div>
            </div>

            <button type="submit" class="btn-submit-premium mb-3" [disabled]="twoFactorForm.invalid || isLoading">
              <span *ngIf="!isLoading">Confirmar Vinculación</span>
              <div *ngIf="isLoading" class="spinner-border spinner-border-sm"></div>
            </button>
            
            <button type="button" class="btn-back-premium" (click)="goBack()" [disabled]="isLoading">
              Cancelar
            </button>

            <div class="error-msg-premium animate-fade" *ngIf="error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ error }}
            </div>
          </form>
        </div>
        
        <div class="login-footer-text">
          &copy; 2024 Asynchronous Tech • <span class="badge-v">v2.4.0</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
      background: #000000; position: relative; overflow: hidden; font-family: 'Inter', sans-serif;
    }

    /* Animated background shapes */
    .shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 1; }
    .shape-1 { width: 400px; height: 400px; background: #f97316; top: -100px; right: -100px; animation: float 20s infinite alternate; }
    .shape-2 { width: 350px; height: 350px; background: #ea580c; bottom: -50px; left: -100px; animation: float 15s infinite alternate-reverse; }
    .shape-3 { width: 250px; height: 250px; background: #c2410c; top: 40%; left: 10%; animation: float 18s infinite alternate; }

    @keyframes float {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(50px, 50px) scale(1.1); }
    }

    .login-card-wrapper { position: relative; z-index: 10; width: 100%; max-width: 440px; padding: 20px; perspective: 1000px; }
    
    .login-card-glass {
      background: rgba(10, 10, 10, 0.65);
      backdrop-filter: blur(24px) saturate(150%);
      -webkit-backdrop-filter: blur(24px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      padding: 3.5rem 2.5rem; 
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .premium-glow::before {
      content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.6), rgba(234, 88, 12, 0.3), rgba(194, 65, 12, 0.6));
      border-radius: 34px; z-index: -1; filter: blur(15px); opacity: 0.6;
      animation: pulse-glow 4s ease-in-out infinite alternate;
    }

    @keyframes pulse-glow { 0% { opacity: 0.3; } 100% { opacity: 0.8; } }

    .logo-outer-ring {
      width: 90px; height: 90px; padding: 3px; border-radius: 24px;
      background: linear-gradient(135deg, #f97316, #c2410c);
      box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.5);
    }
    .pulse-animation { animation: ring-pulse 3s infinite; }
    @keyframes ring-pulse { 0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(249, 115, 22, 0); } 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } }

    .logo-inner-box {
      width: 100%; height: 100%; background: #000000; border-radius: 21px;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .login-logo { width: 100%; height: 100%; object-fit: cover; }

    .gradient-text {
      background: linear-gradient(to right, #ffffff, #fdba74);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .login-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 0; }
    .login-subtitle { color: #a1a1aa; font-size: 0.95rem; margin-top: 6px; font-weight: 500; }

    .form-group-modern label {
      display: block; color: #d4d4d8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-left: 4px;
    }
    .input-wrapper { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #71717a; }
    
    .input-wrapper input {
      width: 100%; background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px; padding: 14px 14px 14px 48px; color: white; font-size: 1rem;
      transition: all 0.2s;
    }
    .input-wrapper input:focus {
      outline: none; border-color: #f97316; background: rgba(0, 0, 0, 0.9);
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
    }

    .password-toggle-btn {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: #71717a; padding: 4px; outline: none; transition: color 0.2s ease;
    }
    .password-toggle-btn:hover { color: #f97316; }

    .btn-submit-premium {
      width: 100%; padding: 16px; border-radius: 14px; background: #f97316;
      color: white; font-weight: 700; border: none; cursor: pointer;
      transition: all 0.3s; box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.4);
      font-size: 1rem;
    }
    .btn-submit-premium:hover:not(:disabled) { background: #fb923c; transform: translateY(-2px); }
    .btn-submit-premium:active { transform: translateY(0); }
    .btn-submit-premium:disabled { opacity: 0.5; cursor: not-allowed; }

    .error-msg-premium {
      margin-top: 20px; padding: 12px; background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px;
      color: #fca5a5; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; justify-content: center;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
    }

    .login-footer-text { text-align: center; color: #71717a; font-size: 0.8rem; margin-top: 24px; font-weight: 500; letter-spacing: 0.5px; }
    .badge-v { background: rgba(249, 115, 22, 0.15); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; color: #fdba74; }

    /* Nuevos estilos 2FA & QR */
    .qr-wrapper { width: 180px; height: 180px; margin: 0 auto; }
    .qr-glass-border {
      padding: 10px; background: white; border-radius: 20px;
      box-shadow: 0 10px 25px rgba(249, 115, 22, 0.2), 0 0 0 1px rgba(249, 115, 22, 0.3);
    }
    .qr-image { width: 100%; height: 100%; border-radius: 12px; }
    .qr-instructions { color: #d4d4d8; font-size: 0.9rem; line-height: 1.4; }
    .qr-instructions strong { color: #f97316; font-weight: 600; }
    
    .text-tracking-widest { letter-spacing: 0.75rem; font-size: 1.5rem !important; font-weight: 700; color: #f97316 !important; }
    .text-tracking-widest::placeholder { letter-spacing: normal; font-size: 1rem; color: #475569; font-weight: 400; }
    
    .btn-back-premium {
      width: 100%; padding: 14px; border-radius: 14px; background: rgba(249, 115, 22, 0.05);
      color: #fdba74; font-weight: 600; border: 1px solid rgba(249, 115, 22, 0.2); cursor: pointer;
      transition: all 0.3s; font-size: 0.95rem;
    }
    .btn-back-premium:hover:not(:disabled) { background: rgba(249, 115, 22, 0.15); color: white; border-color: rgba(249, 115, 22, 0.4); }
    .btn-back-premium:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-recovery-link {
      background: none; border: none; color: #a1a1aa; font-size: 0.85rem;
      text-decoration: underline; cursor: pointer; transition: color 0.2s;
    }
    .btn-recovery-link:hover { color: #f97316; }

    .animate-fade { animation: fadeScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `]

})
export class LoginComponent {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  step: 'credentials' | '2fa' | 'setup-2fa' = 'credentials';
  tempToken: string = '';
  qrCodeImage: string = '';
  isLoading = false;
  showPassword = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: async (response) => {
          this.isLoading = false;
          
          if (response.setup2FA && response.qrCodeData) {
            this.tempToken = response.tempToken || '';
            try {
              this.qrCodeImage = await qrcode.toDataURL(response.qrCodeData, {
                width: 250,
                margin: 1,
                color: { dark: '#000000', light: '#ffffff' }
              });
              this.step = 'setup-2fa';
            } catch (err) {
              console.error('Error al generar QR:', err);
              this.error = 'No se pudo generar el código QR de configuración.';
            }
          } else if (response.require2FA) {
            this.tempToken = response.tempToken || '';
            this.step = '2fa';
          } else {
            console.log('🚀 Redirigiendo a Dashboard/Personal...');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error = err.error?.message || err.error || 'Credenciales inválidas';
          this.isLoading = false;
        }
      });
    }
  }

  onVerify2FA() {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      this.error = null;
      const code = this.twoFactorForm.value.code;

      this.authService.verify2FA(code, this.tempToken).subscribe({
        next: () => {
          console.log('🚀 Redirigiendo a Dashboard/Personal (2FA)...');
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || err.error || 'Código 2FA inválido';
          this.isLoading = false;
        }
      });
    }
  }
  
  onRecover2FA() {
    this.isLoading = true;
    const username = this.loginForm.value.username;
    this.authService.reset2FA(username).subscribe({
      next: () => {
        this.isLoading = false;
        alert('📧 Estado 2FA reseteado. Por favor, vuelve a ingresar tus credenciales para ver el nuevo código QR.');
        this.goBack();
      },
      error: () => {
        this.isLoading = false;
        this.error = 'No se pudo resetear el 2FA. Reintenta más tarde.';
      }
    });
  }

  goBack() {
    this.step = 'credentials';
    this.error = null;
    this.twoFactorForm.reset();
  }
}
