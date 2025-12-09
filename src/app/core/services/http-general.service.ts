import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HttpgeneralService {

  constructor(public http: HttpClient,
    public authService: AuthService
  ) {}

  public getHeader(){
      const token = this.authService.getToken();

      let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
      return headers;
  }

  public validateContentType(contentTypeValue?: string) {
    let header = this.getHeader();

    if (contentTypeValue) {
      header = header.append('Content-Type', contentTypeValue);
    }

    return header;
  }



  public doPost<T>(endpoint: string, body: any,  data?: any, contentTypeHeader?: string): Observable<T>{
    return this.http.post<T>(endpoint, body, {params: data, headers: this.validateContentType(contentTypeHeader)}) as Observable<T>;
  }

  public doPut<T>(endpoint: string, body: any,  data?: any): Observable<T>{
    return this.http.put<T>(endpoint, body, {params: data, headers: this.getHeader()}) as Observable<T>;
  }

  public doGet<T>(url: string, data?: any){
    return this.http.get<T>(url, {params: data, headers: this.getHeader()})
  }

  public doDelete<T>(endpoint: string){
    return this.http.delete<T>(endpoint, { headers: this.getHeader()})
  }

  getHttpHeaders(): HttpHeaders {
    return new HttpHeaders().set('xhr-name', 'consultar registros');
  }
}