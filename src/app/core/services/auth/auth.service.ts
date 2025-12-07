import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, AuthUser } from './auth.models';
import { Usuario } from '../../../shared/models/usuario.model';
import { environment } from '../../../../assets/environment/env';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly AUTH_USER_KEY = 'auth_user';
  private readonly API_URL = `${environment.apiUrl}auth/token`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  public login(credentials: LoginCredentials): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('username', credentials.email);
    body.set('password', credentials.password);

    return this.http.post<AuthResponse>(this.API_URL, body.toString(), { headers }).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.decodeAndStoreUser(response.access_token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  public getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  public logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.AUTH_USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private decodeAndStoreUser(token: string): void {
    try {
      const decoded = jwt_decode.jwtDecode<any>(token);
      const user: Usuario = {
        sub: decoded.sub,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        id_usuario: decoded.id_usuario,
        id_tipo_usuario: decoded.id_tipo_usuario,
        tipo_usuario: decoded.tipo_usuario,
        id_unidad: decoded.id_unidad,
        unidad: decoded.unidad
      };
      localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (error) {
    }
  }

  private getStoredUser(): Usuario | null {
    const user = localStorage.getItem(this.AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwt_decode.jwtDecode<any>(token);
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate <= new Date();
    } catch (error) {
      return true;
    }
  }

  private checkTokenValidity(): void {
    if (this.hasToken() && this.isTokenExpired()) {
      this.logout();
    } else if (this.hasToken()) {
      this.isAuthenticatedSubject.next(true);
    }
  }
}
