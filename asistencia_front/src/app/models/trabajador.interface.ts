export interface TrabajadorRequest {
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaIngreso: string;
  activo: boolean;
}

export interface TrabajadorResponse {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaIngreso: string;
  activo: boolean;
}
