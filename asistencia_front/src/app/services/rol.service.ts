import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolResponse } from '../models/rol.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(this.apiUrl);
  }
}
