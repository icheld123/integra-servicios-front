export interface RecursoNuevo {
    fecha_inicio_transaccion: string;
    fecha_fin_transaccion: string;
    estado_transaccion: string;
    falla_servicio: string;
    id_tipo_transaccion: number;
    id_usuario: number;
    id_recurso: string;
    id_empleado_responsable?: number;
}