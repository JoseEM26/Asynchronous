import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
    console.log(`🔐 Intentando login para usuario: ${username} en la URL: ${this.apiUrl}/login`);
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap({
        next: (user) => {
          console.log('✅ Login exitoso:', user);
          localStorage.setItem('asistencia_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        },
        error: (err) => {
          console.error('❌ Error en el login:', err);
        }
      })
    );
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
