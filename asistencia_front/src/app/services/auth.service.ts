import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioResponse } from '../models/usuario.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('asistencia_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<UsuarioResponse> {
    console.log(`🔐 Intentando login MOCK para usuario: ${username}`);
    const mockResponse: UsuarioResponse = {
      id: 1,
      username: username,
      activo: true,
      rol: { id: 1, nombre: 'ADMIN' } as any,
      trabajador: { id: 1, nombre: 'Demo', apellidos: 'User', nroDocumento: '12345678' } as any,
      setup2FA: true,
      qrCodeData: 'otpauth://totp/GeoCheck:DemoUser?secret=JBSWY3DPEHPK3PXP&issuer=GeoCheck',
      tempToken: 'mock-temp-token-123'
    };

    return new Observable<UsuarioResponse>(subscriber => {
      setTimeout(() => {
        if (mockResponse.setup2FA) {
          console.log('⚠️ Login parcial: requiere configurar 2FA');
        } else if (mockResponse.require2FA) {
          console.log('⚠️ Login parcial: requiere verificación 2FA');
        } else {
          console.log('✅ Login exitoso:', mockResponse);
          localStorage.setItem('asistencia_user', JSON.stringify(mockResponse));
          this.currentUserSubject.next(mockResponse);
        }
        subscriber.next(mockResponse);
        subscriber.complete();
      }, 800);
    });
  }

  verify2FA(code: string, tempToken: string): Observable<UsuarioResponse> {
    console.log(`🔐 Verificando código 2FA MOCK...`);
    const mockUser: UsuarioResponse = {
      id: 1,
      username: 'DemoUser',
      activo: true,
      rol: { id: 1, nombre: 'ADMIN' } as any,
      trabajador: { id: 1, nombre: 'Demo', apellidos: 'User', nroDocumento: '12345678' } as any
    };
    
    return new Observable<UsuarioResponse>(subscriber => {
      setTimeout(() => {
        console.log('✅ Login exitoso con 2FA MOCK:', mockUser);
        localStorage.setItem('asistencia_user', JSON.stringify(mockUser));
        this.currentUserSubject.next(mockUser);
        subscriber.next(mockUser);
        subscriber.complete();
      }, 800);
    });
  }

  logout() {
    localStorage.removeItem('asistencia_user');
    sessionStorage.removeItem('comunicados_mostrados');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): number | undefined {
    return this.currentUserSubject.value?.rol?.id;
  }

  getTrabajadorId(): number | undefined {
    return this.currentUserSubject.value?.trabajador?.id;
  }
}
