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
    <div class="login-container">
      <div class="login-card animate-fade">
        <div class="text-center mb-5">
           <div class="logo-container mb-4 mx-auto">
              <img src="logo.jpeg" alt="Asistencia Logo" class="img-fluid shadow-sm" style="border-radius: 18px; width: 80px; height: 80px; object-fit: cover; border: 1px solid rgba(249, 115, 22, 0.1);">
           </div>
           <h1 class="h3 fw-bold mb-1" style="color: var(--accent-secondary);">Bienvenido de nuevo</h1>
           <p class="text-secondary small">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="form-label small fw-bold text-uppercase opacity-75">Usuario</label>
            <div class="input-group-custom">
                <i class="input-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></i>
                <input type="text" formControlName="username" class="form-control-custom" placeholder="ej: jdoe">
            </div>
          </div>

          <div class="mb-5">
            <label class="form-label small fw-bold text-uppercase opacity-75">Contraseña</label>
            <div class="input-group-custom">
                <i class="input-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></i>
                <input type="password" formControlName="password" class="form-control-custom" placeholder="••••••••">
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Autenticando...' : 'Iniciar Sesión' }}
          </button>

          <div class="alert alert-danger mt-4 small border-0 py-2 d-flex align-items-center gap-2" *ngIf="error">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: radial-gradient(circle at top right, #f8fafc 0%, #e2e8f0 100%);
      padding: 1.5rem;
    }
    .login-card {
      width: 100%; max-width: 420px; padding: 3rem 2.5rem; background: white;
      border-radius: 24px; box-shadow: 0 20px 50px -12px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.03);
    }
    .logo-container {
      width: 80px; height: 80px; border-radius: 18px;
      display: flex; align-items: center; justify-content: center; margin: 0 auto;
      box-shadow: 0 10px 25px rgba(249, 115, 22, 0.2);
    }
    .input-group-custom { position: relative; }
    .input-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: #94a3b8; pointer-events: none;
    }
    .form-control-custom {
      width: 100%; padding: 14px 14px 14px 48px; border-radius: 12px;
      border: 1.5px solid #edf2f7; background: #f8fafc; font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .form-control-custom:focus {
      outline: none; border-color: var(--accent-primary); background: white;
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.08);
    }
    .btn-login {
      width: 100%; padding: 14px; border-radius: 12px; background: var(--grad-main);
      color: white; font-weight: 700; border: none; cursor: pointer;
      transition: all 0.3s ease; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2);
    }
    .btn-login:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px -3px rgba(249, 115, 22, 0.3); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
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
