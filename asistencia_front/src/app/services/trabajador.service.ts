import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrabajadorRequest, TrabajadorResponse } from '../models/trabajador.interface';
import { PageRequest, PaginatedResponse } from '../models/pagination.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = `${environment.apiUrl}/trabajadores`;

  constructor(private http: HttpClient) { }

  listar(): Observable<TrabajadorResponse[]> {
    return this.http.get<TrabajadorResponse[]>(this.apiUrl);
  }

  listarPaginado(pageRequest: PageRequest): Observable<PaginatedResponse<TrabajadorResponse>> {
    return this.http.post<PaginatedResponse<TrabajadorResponse>>(`${this.apiUrl}/paged`, pageRequest);
  }

  obtener(id: number): Observable<TrabajadorResponse> {
    return this.http.get<TrabajadorResponse>(`${this.apiUrl}/${id}`);
  }

  crear(trabajador: TrabajadorRequest): Observable<TrabajadorResponse> {
    return this.http.post<TrabajadorResponse>(this.apiUrl, trabajador);
  }

  actualizar(id: number, trabajador: TrabajadorRequest): Observable<TrabajadorResponse> {
    return this.http.put<TrabajadorResponse>(`${this.apiUrl}/${id}`, trabajador);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
