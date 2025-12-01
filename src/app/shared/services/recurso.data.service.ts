import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Recurso } from '../models/recurso.model';
import { TipoRecurso } from '../models/tipo-recurso.model';


@Injectable({
  providedIn: 'root'
})
export class RecursoDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getAllRecursos(skip: number, limit: number, filtros: any): Observable<Recurso[]> {
        return this.http.doPost<Recurso[]>(
            `${environment.apiUrl}recurso/?skip=${skip}&limit=${limit}`,
            filtros
        );
    }


    getTiposRecursos(filtros: any): Observable<TipoRecurso[]> {
        return this.http.doPost<TipoRecurso[]>(
            `${environment.apiUrl}tipo_recurso/?skip=0&limit=100`,
            filtros
        );
    }
}