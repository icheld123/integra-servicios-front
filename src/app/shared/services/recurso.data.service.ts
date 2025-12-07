import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Recurso } from '../models/recurso.model';
import { TipoRecurso } from '../models/tipo-recurso.model';
import { RecursoNuevo } from '../models/reserva.model';


@Injectable({
  providedIn: 'root'
})
export class RecursoDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getAllRecursos(skip: number, limit: number, filtros: any): Observable<Recurso[]> {
    return this.http
        .doPost<Recurso[]>(`${environment.apiUrl}recurso/?skip=${skip}&limit=${limit}`, filtros)
        .pipe(
        map(recursos => recursos.map(r => this.mapRecurso(r)))
        );
    }

    getTiposRecursos(filtros: any): Observable<TipoRecurso[]> {
        return this.http.doPost<TipoRecurso[]>(
            `${environment.apiUrl}tipo_recurso/?skip=0&limit=100`,
            filtros
        );
    }

    createReserva(body: RecursoNuevo) {
        return this.http.doPost(
            `${environment.apiUrl}transaccion/create`,
            body
        );
    }

    private mapRecurso(data: any): Recurso {
        const horarioArray = Object.keys(data.horario_disponible || {}).map(dia => ({
            dia,
            horarios: [
            {
                hora_inicio: data.horario_disponible[dia].hora_inicio,
                hora_fin: data.horario_disponible[dia].hora_fin
            }
            ]
        }));

        return {
            ...data,
            horario_disponible: horarioArray
        };
    }

}