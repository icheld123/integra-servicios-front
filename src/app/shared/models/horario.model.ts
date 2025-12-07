export interface Dia{
    dia: string;
    horarios: Horario[];
}

export interface Horario{
    hora_inicio: string;
    hora_fin: string;
}