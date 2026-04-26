import { RolResponse } from './rol.interface';
import { TrabajadorResponse } from './trabajador.interface';

export interface UsuarioRequest {
  username: string;
  password?: string;
  rolId: number;
  trabajadorId: number;
  activo?: boolean;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  activo: boolean;
  rol: RolResponse;
  trabajador: TrabajadorResponse;
  require2FA?: boolean;
  setup2FA?: boolean;
  qrCodeData?: string;
  tempToken?: string;
}
