import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GeoConfig {
  id?: number;
  officeLat: number;
  officeLng: number;
  radius: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = `${environment.apiUrl}/configuracion`;

  constructor(private http: HttpClient) { }

  obtener(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  actualizar(config: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, config);
  }

  getTerreno(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/terreno`);
  }

  getRemotoTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/remoto/trabajadores`);
  }

  resetUbicacionVirtual(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remoto/trabajador/${id}`);
  }
}
