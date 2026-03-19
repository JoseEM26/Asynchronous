import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModalidadResponse } from '../models/modalidad.interface';
import { PageRequest, PageResponse } from '../models/pagination.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {
  private apiUrl = `${environment.apiUrl}/modalidades`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ModalidadResponse[]> {
    return this.http.get<ModalidadResponse[]>(this.apiUrl);
  }

  listarPaginado(pageRequest: PageRequest): Observable<PageResponse<ModalidadResponse>> {
    return this.http.post<PageResponse<ModalidadResponse>>(`${this.apiUrl}/paged`, pageRequest);
  }
}
