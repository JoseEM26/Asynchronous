import { RolResponse } from './rol.interface';
import { TrabajadorResponse } from './trabajador.interface';

export interface UsuarioRequest {
  username: string;
  password?: string;
  rolId: number;
  trabajadorId: number;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  rol: RolResponse;
  trabajador: TrabajadorResponse;
}
