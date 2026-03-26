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
  jefeId?: number;
  rolId?: number;
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
  jefe?: TrabajadorResponse;
  jefeNombre?: string;
  rol?: any;
}
