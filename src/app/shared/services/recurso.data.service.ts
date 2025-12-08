import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Recurso } from '../models/recurso.model';
import { TipoRecurso } from '../models/tipo-recurso.model';
import { ReservaNueva } from '../models/reserva.model';


@Injectable({
  providedIn: 'root'
})
export class RecursoDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getAllRecursos(skip: number, limit: number, filtros: any): Observable<Recurso[]> {
        return this.http
            .doPost<any[]>(
            `${environment.apiUrl}recurso/?skip=${skip}&limit=${limit}`,
            filtros
            )
            .pipe(map(recursos => recursos.map(r => this.mapRecurso(r))));
    }

    getTiposRecursos(filtros: any): Observable<TipoRecurso[]> {
        return this.http.doPost<TipoRecurso[]>(
            `${environment.apiUrl}tipo_recurso/?skip=0&limit=100`,
            filtros
        );
    }

    createReserva(body: ReservaNueva) {
        return this.http.doPost(
            `${environment.apiUrl}transaccion/create`,
            body
        );
    }
    

    private mapRecurso(data: any): Recurso {
        return {
            id_recurso: data.recurso.id_recurso,
            nombre_recurso: data.recurso.nombre_recurso,
            descripcion_recurso: data.recurso.descripcion_recurso,

            id_tipo: data.tipo_recurso.id_tipo_recurso,
            nombre_tipo: data.tipo_recurso.nombre_tipo_recurso,

            id_unidad: data.unidad.id_unidad,
            nombre_unidad: data.unidad.nombre_unidad,

            foto_recurso: data.foto_recurso ?? null,
        };
    }



}