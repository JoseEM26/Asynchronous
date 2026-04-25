import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PersonalUnificado {
  id?: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaIngreso: string;
  activo: boolean;
  modalidadId: number;
  esJefeTerreno: boolean;
  latitudVirtual?: number;
  longitudVirtual?: number;
  diasPresencial?: string;
  diasRemotos?: string;
  permitirCambioUbicacion?: boolean;
  username: string;
  password?: string;
  rolId: number;
  usuarioActivo: boolean;
  modalidadNombre?: string;
  rolNombre?: string;
  usuarioId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = `${environment.apiUrl}/personal`;

  constructor(private http: HttpClient) { }

  listar(): Observable<PersonalUnificado[]> {
    return this.http.get<PersonalUnificado[]>(this.apiUrl);
  }

  guardar(personal: PersonalUnificado): Observable<void> {
    return this.http.post<void>(this.apiUrl, personal);
  }
}
