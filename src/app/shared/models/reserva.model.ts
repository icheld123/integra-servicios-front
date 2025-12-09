import { Recurso } from "./recurso.model";
import { Usuario } from "./usuario.model";

export interface ReservaNueva {
    fecha_inicio_transaccion: string;
    fecha_fin_transaccion: string;
    estado_transaccion: string;
    falla_servicio: string;
    id_tipo_transaccion: number;
    id_usuario: number;
    id_recurso: string;
    id_empleado_responsable?: number;
}

export interface Reserva {
    transaccion: number;
    estado_actual: string;
    fechas: {
        fecha_inicio_transaccion: string;
        fecha_fin_transaccion: string;
        fecha_creacion: string;
    };
    recurso: {
        id_recurso: number;
        nombre_recurso: string;
    };
    usuario: {
        id_usuario: number;
        nombre: string;
        apellido: string;
    };
    empleado_responsable: {
        id_usuario: number;
        nombre: string;
        apellido: string;
    } | null;
    falla_servicio: string | null;
}