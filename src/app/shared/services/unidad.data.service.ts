import { Injectable } from '@angular/core';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Observable } from 'rxjs';
import { Unidad } from '../models/unidad.model';


@Injectable({
  providedIn: 'root'
})
export class UnidadDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getUnidades(): Observable<Unidad[]> {
        return this.http.doGet<Unidad[]>(
            `${environment.apiUrl}unidad/?skip=0&limit=100`
        );
    }

    createUnidad(body: any): Observable<any> {
        return this.http.doPost<any[]>(
            `${environment.apiUrl}unidad/`,
            body
        );
    }
}