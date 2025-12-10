import { Usuario } from "../../../shared/models/usuario.model";

/**
 * Interfaz para la respuesta de autenticación del servidor
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;

}

/**
 * Interfaz para las credenciales de inicio de sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interfaz para los datos del usuario autenticado
 */
export interface AuthUser {
  email: string;
  tipo: number;
  id_usuario: number;
  unidad: number;
}
