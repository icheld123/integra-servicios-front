import { Injectable } from '@angular/core';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrestamoDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    setPrestamo(body: any): Observable<any> {
        return this.http.doPut<any[]>(
            `${environment.apiUrl}transaccion/prestamo`,
            body
        );
    }
    setDevolucion(body: any): Observable<any> {
        return this.http.doPut<any[]>(
            `${environment.apiUrl}transaccion/devolucion`,
            body
        );
    }
}