import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
        <div class="login-card-glass">
          <div class="text-center mb-5">
            <div class="logo-outer-ring mx-auto mb-4">
              <div class="logo-inner-box">
                <img src="logo.jpeg" alt="Logo" class="login-logo">
              </div>
            </div>
            <h1 class="login-title">GeoCheck</h1>
            <p class="login-subtitle">Gestión de Asistencia Inteligente</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
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
                <input type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
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
        </div>
        
        <div class="login-footer-text">
          &copy; 2024 Asynchronous Tech • v2.4.0
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
      background: #0f172a; position: relative; overflow: hidden; font-family: 'Inter', sans-serif;
    }

    /* Animated background shapes */
    .shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 1; }
    .shape-1 { width: 400px; height: 400px; background: #f97316; top: -100px; right: -100px; animation: float 20s infinite alternate; }
    .shape-2 { width: 350px; height: 350px; background: #3b82f6; bottom: -50px; left: -100px; animation: float 15s infinite alternate-reverse; }
    .shape-3 { width: 250px; height: 250px; background: #8b5cf6; top: 40%; left: 10%; animation: float 18s infinite alternate; }

    @keyframes float {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(50px, 50px) scale(1.1); }
    }

    .login-card-wrapper { position: relative; z-index: 10; width: 100%; max-width: 440px; padding: 20px; }
    
    .login-card-glass {
      background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 32px;
      padding: 3.5rem 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .logo-outer-ring {
      width: 90px; height: 90px; padding: 4px; border-radius: 24px;
      background: linear-gradient(135deg, #f97316, #3b82f6);
    }
    .logo-inner-box {
      width: 100%; height: 100%; background: white; border-radius: 20px;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .login-logo { width: 100%; height: 100%; object-fit: cover; }

    .login-title { color: white; font-size: 2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 0; }
    .login-subtitle { color: #94a3b8; font-size: 0.95rem; margin-top: 4px; }

    .form-group-modern label {
      display: block; color: #cbd5e1; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-left: 4px;
    }
    .input-wrapper { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; }
    
    .input-wrapper input {
      width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px; padding: 14px 14px 14px 48px; color: white; font-size: 1rem;
      transition: all 0.2s;
    }
    .input-wrapper input:focus {
      outline: none; border-color: #f97316; background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
    }

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
      margin-top: 20px; padding: 12px; background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;
      color: #fca5a5; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; justify-content: center;
    }

    .login-footer-text { text-align: center; color: #475569; font-size: 0.75rem; margin-top: 24px; font-weight: 500; }
  `]

})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
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
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: () => {
          console.log('🚀 Redirigiendo a Dashboard/Personal...');
          this.router.navigate(['/dashboard']); // Vamos al Dashboard primero
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error || 'Credenciales inválidas';
          this.isLoading = false;
        }
      });
    }
  }
}
