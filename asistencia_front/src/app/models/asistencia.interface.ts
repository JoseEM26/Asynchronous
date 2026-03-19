import { TrabajadorResponse } from './trabajador.interface';
import { ModalidadResponse } from './modalidad.interface';

export type TipoAsistencia = 'ENTRADA' | 'SALIDA';

export interface AsistenciaRequest {
  trabajadorId: number;
  modalidadId: number;
  tipo: TipoAsistencia;
  latitud: number;
  longitud: number;
  notas: string;
}

export interface AsistenciaResponse {
  id: number;
  trabajador: TrabajadorResponse;
  fechaHora: string;
  tipo: TipoAsistencia;
  modalidad: ModalidadResponse;
  latitud: number;
  longitud: number;
  notas: string;
}
