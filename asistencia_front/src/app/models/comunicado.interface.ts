export interface ComunicadoRequest {
  titulo: string;
  contenido: string;
  fechaExpiracion?: string;
  tipo: string;
  activo: boolean;
}

export interface ComunicadoResponse {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  fechaExpiracion?: string;
  tipo: string;
  activo: boolean;
}
