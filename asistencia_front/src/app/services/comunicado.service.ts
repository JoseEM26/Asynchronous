import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComunicadoRequest, ComunicadoResponse } from '../models/comunicado.interface';
import { PageRequest, PaginatedResponse } from '../models/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {
  private apiUrl = `${environment.apiUrl}/comunicados`;

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<ComunicadoResponse[]> {
    return this.http.get<ComunicadoResponse[]>(`${this.apiUrl}/activos`);
  }

  listarPaginado(request: PageRequest): Observable<PaginatedResponse<ComunicadoResponse>> {
    return this.http.post<PaginatedResponse<ComunicadoResponse>>(`${this.apiUrl}/paged`, request);
  }

  crear(request: ComunicadoRequest): Observable<ComunicadoResponse> {
    return this.http.post<ComunicadoResponse>(this.apiUrl, request);
  }

  actualizar(id: number, request: ComunicadoRequest): Observable<ComunicadoResponse> {
    return this.http.put<ComunicadoResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
