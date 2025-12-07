import { Dia } from "./horario.model";

export interface Recurso {
  nombre_recurso: string;
  descripcion_recurso: string;
  estado_recurso: string;
  id_recurso: string;
  id_tipo_recurso: number;
  foto_recurso: string;
  nombre_tipo: string;
  horario_disponible?: Dia[];
}