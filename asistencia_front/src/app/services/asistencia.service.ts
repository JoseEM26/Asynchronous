import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsistenciaRequest, AsistenciaResponse } from '../models/asistencia.interface';
import { PageRequest, PageResponse } from '../models/pagination.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) {}

  registrar(request: AsistenciaRequest): Observable<AsistenciaResponse> {
    return this.http.post<AsistenciaResponse>(this.apiUrl, request);
  }

  listar(): Observable<AsistenciaResponse[]> {
    return this.http.get<AsistenciaResponse[]>(this.apiUrl);
  }

  listarPaginado(pageRequest: PageRequest): Observable<PageResponse<AsistenciaResponse>> {
    return this.http.post<PageResponse<AsistenciaResponse>>(`${this.apiUrl}/paged`, pageRequest);
  }

  listarPorTrabajador(id: number): Observable<AsistenciaResponse[]> {
    return this.http.get<AsistenciaResponse[]>(`${this.apiUrl}/trabajador/${id}`);
  }

  listarPorTrabajadorPaginado(id: number, pageRequest: PageRequest): Observable<PageResponse<AsistenciaResponse>> {
    return this.http.post<PageResponse<AsistenciaResponse>>(`${this.apiUrl}/trabajador/${id}/paged`, pageRequest);
  }
}
