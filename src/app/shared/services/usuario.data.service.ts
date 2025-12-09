import { Injectable } from '@angular/core';
import { HttpgeneralService } from '../../core/services/http-general.service';
import { environment } from '../../../assets/environment/env';
import { Observable } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioDataService {
    constructor(protected http: HttpgeneralService,) {
    }

    getUsuarioByEmail(email: any): Observable<UsuarioResponse> {
        return this.http.doGet<UsuarioResponse>(
            `${environment.apiUrl}usuario/${email}`
        );
    }

    createUsuario(body: any): Observable<any> {
        return this.http.doPost<any[]>(
            `${environment.apiUrl}usuario/sing-in`,
            body
        );
    }

}