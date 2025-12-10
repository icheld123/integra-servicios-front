export interface TipoRecurso {
  tipo_recurso: {
    id_tipo_recurso: number;
    nombre_tipo_recurso: string;
    codigo_tipo_recurso: string;
  };
  unidad: {
    id_unidad: number;
    nombre_unidad: string;
  };
  horario: string;
}
