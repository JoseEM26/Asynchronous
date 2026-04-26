import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PuntoTerrenoRequest } from '../models/punto-terreno.interface';

@Injectable({
  providedIn: 'root'
})
export class PuntoTerrenoService {
  private apiUrl = `${environment.apiUrl}/mobile/puntos/terreno`;

  constructor(private http: HttpClient) { }

  registrar(request: PuntoTerrenoRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  listarPuntos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/configuracion/terreno/all`);
  }

  crearPunto(request: PuntoTerrenoRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/configuracion/terreno`, request);
  }
}
