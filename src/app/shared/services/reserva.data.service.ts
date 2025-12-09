import { Injectable } from '@angular/core';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { TipoRecurso } from '../models/tipo-recurso.model';
import { Reserva, ReservaNueva } from '../models/reserva.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservaDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getReservas(body: any): Observable<Reserva[]> {
        return this.http.doPost<Reserva[]>(
            `${environment.apiUrl}transaccion/?skip=0&limit=100`,
            body
        );
    }

    updateReserva(body: any): Observable<any> {
        const url = `${environment.apiUrl}transaccion/cambioFechas`;

        return this.http.doPut<any>(url, body);
    }


}