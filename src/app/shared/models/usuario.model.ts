export interface Usuario {
  sub: string;
  nombre: string;
  apellido: string;
  id_usuario: number;
  id_tipo_usuario: number;
  tipo_usuario: string;
  id_unidad: number;
  unidad: string;
}

export interface UsuarioResponse {
  usuario: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  unidad: any | null;
  tipo: {
    id_tipo_usuario: number;
    nombre_tipo_usuario: string;
  };
}
