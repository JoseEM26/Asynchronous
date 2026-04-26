import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsistenciaRequest, AsistenciaResponse, QrResponse } from '../models/asistencia.interface';
import { PageRequest, PaginatedResponse } from '../models/pagination.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) { }

  registrar(request: AsistenciaRequest): Observable<AsistenciaResponse> {
    return this.http.post<AsistenciaResponse>(this.apiUrl, request);
  }

  listar(): Observable<AsistenciaResponse[]> {
    return this.http.get<AsistenciaResponse[]>(this.apiUrl);
  }

  listarPaginado(request: PageRequest): Observable<PaginatedResponse<AsistenciaResponse>> {
    return this.http.post<PaginatedResponse<AsistenciaResponse>>(`${this.apiUrl}/paged`, request);
  }

  listarPaginadoPorTrabajador(trabajadorId: number, request: PageRequest): Observable<PaginatedResponse<AsistenciaResponse>> {
    return this.http.post<PaginatedResponse<AsistenciaResponse>>(`${this.apiUrl}/trabajador/${trabajadorId}/paged`, request);
  }

  listarPorTrabajador(id: number): Observable<AsistenciaResponse[]> {
    return this.http.get<AsistenciaResponse[]>(`${this.apiUrl}/trabajador/${id}`);
  }

  listarPorTrabajadorPaginado(id: number, pageRequest: PageRequest): Observable<PaginatedResponse<AsistenciaResponse>> {
    return this.http.post<PaginatedResponse<AsistenciaResponse>>(`${this.apiUrl}/trabajador/${id}/paged`, pageRequest);
  }

  obtenerQr(): Observable<QrResponse> {
    return this.http.get<QrResponse>(`${this.apiUrl}/qr`);
  }
}
