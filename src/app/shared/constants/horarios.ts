export const HORARIOS: Record<string, any> = {

  horario_default: {
    Lunes:    { apertura: "08:00:00", cierre: "18:00:00" },
    Martes:   { apertura: "08:00:00", cierre: "18:00:00" },
    Miércoles:{ apertura: "08:00:00", cierre: "18:00:00" },
    Jueves:   { apertura: "08:00:00", cierre: "18:00:00" },
    Viernes:  { apertura: "08:00:00", cierre: "18:00:00" },
    Sábado:   { apertura: "00:00:00", cierre: "00:00:00" },
    Domingo:  { apertura: "00:00:00", cierre: "00:00:00" }
  },

  horario_extendido: {
    Lunes:    { apertura: "07:00:00", cierre: "22:00:00" },
    Martes:   { apertura: "07:00:00", cierre: "22:00:00" },
    Miércoles:{ apertura: "07:00:00", cierre: "22:00:00" },
    Jueves:   { apertura: "07:00:00", cierre: "22:00:00" },
    Viernes:  { apertura: "07:00:00", cierre: "22:00:00" },
    Sábado:   { apertura: "08:00:00", cierre: "20:00:00" },
    Domingo:  { apertura: "08:00:00", cierre: "20:00:00" }
  },

  horario_nocturno: {
    Lunes:    { apertura: "18:00:00", cierre: "23:59:59" },
    Martes:   { apertura: "18:00:00", cierre: "23:59:59" },
    Miércoles:{ apertura: "18:00:00", cierre: "23:59:59" },
    Jueves:   { apertura: "18:00:00", cierre: "23:59:59" },
    Viernes:  { apertura: "18:00:00", cierre: "23:59:59" },
    Sábado:   { apertura: "18:00:00", cierre: "23:59:59" },
    Domingo:  { apertura: "18:00:00", cierre: "23:59:59" }
  },

  horario_fin_semana: {
    Lunes:    { apertura: "00:00:00", cierre: "00:00:00" },
    Martes:   { apertura: "00:00:00", cierre: "00:00:00" },
    Miércoles:{ apertura: "00:00:00", cierre: "00:00:00" },
    Jueves:   { apertura: "00:00:00", cierre: "00:00:00" },
    Viernes:  { apertura: "00:00:00", cierre: "00:00:00" },
    Sábado:   { apertura: "08:00:00", cierre: "22:00:00" },
    Domingo:  { apertura: "08:00:00", cierre: "20:00:00" },
  },

  horario_medio_tiempo: {
    Lunes:    { apertura: "08:00:00", cierre: "12:00:00" },
    Martes:   { apertura: "08:00:00", cierre: "12:00:00" },
    Miércoles:{ apertura: "08:00:00", cierre: "12:00:00" },
    Jueves:   { apertura: "08:00:00", cierre: "12:00:00" },
    Viernes:  { apertura: "08:00:00", cierre: "12:00:00" },
    Sábado:   { apertura: "00:00:00", cierre: "00:00:00" },
    Domingo:  { apertura: "00:00:00", cierre: "00:00:00" }
  },

  horario_24_7: {
    Lunes:    { apertura: "00:00:00", cierre: "23:59:59" },
    Martes:   { apertura: "00:00:00", cierre: "23:59:59" },
    Miércoles:{ apertura: "00:00:00", cierre: "23:59:59" },
    Jueves:   { apertura: "00:00:00", cierre: "23:59:59" },
    Viernes:  { apertura: "00:00:00", cierre: "23:59:59" },
    Sábado:   { apertura: "00:00:00", cierre: "23:59:59" },
    Domingo:  { apertura: "00:00:00", cierre: "23:59:59" }
  }

};
