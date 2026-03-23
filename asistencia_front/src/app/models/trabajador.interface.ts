export interface TrabajadorRequest {
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaIngreso: string;
  activo: boolean;
  modalidadId?: number;
  esJefeTerreno?: boolean;
  latitudVirtual?: number;
  longitudVirtual?: number;
  diasPresencial?: string;
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
  modalidadId?: number;
  esJefeTerreno?: boolean;
  latitudVirtual?: number;
  longitudVirtual?: number;
  diasPresencial?: string;
}
