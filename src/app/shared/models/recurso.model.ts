import { Dia } from "./horario.model";

export interface Recurso {
  id_recurso: string;
  nombre_recurso: string;
  descripcion_recurso: string;
  id_tipo: number;
  nombre_tipo: string;
  id_unidad: number;
  nombre_unidad: string;
  foto_recurso: string | null;
}
