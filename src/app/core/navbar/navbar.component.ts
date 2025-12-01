import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Usuario } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  modalAbierto = false;
  usuarioLogueado: any = null;
  private tokenExpireTimeout: any = null;

  constructor(
    private auth: AuthService
  ) {
    this.usuarioLogueado = this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.checkAuthState();
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  logout() {
    this.clearSessionData();
    window.location.href = '/';
  }

  private getTokenFromStorage(): string | null {
    const candidateKeys = ['token', 'access_token', 'auth_token', 'jwt'];
    for (const k of candidateKeys) {
      const t = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (t) return t;
    }
    return null;
  }

  private scheduleTokenExpiry(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      if (!payload.exp) return;

      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const msUntilExpire = expiresAt - now;

      if (msUntilExpire <= 0) {
        this.handleTokenExpired();
        return;
      }

      if (this.tokenExpireTimeout) {
        clearTimeout(this.tokenExpireTimeout);
      }

      this.tokenExpireTimeout = setTimeout(() => {
        this.handleTokenExpired();
      }, msUntilExpire + 500);
    } catch (e) {
      // no es JWT o parseo fallido: no programamos expiración
    }
  }

  private handleTokenExpired() {
    this.clearSessionData();
    window.location.href = '/';
  }

  private clearSessionData() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    this.usuarioLogueado = null;
    if (this.tokenExpireTimeout) {
      clearTimeout(this.tokenExpireTimeout);
      this.tokenExpireTimeout = null;
    }
  }

  checkAuthState() {
    const token = this.getTokenFromStorage();
    if (token) {
      // intentar extraer claims si es JWT
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
          this.usuarioLogueado = JSON.parse(payloadJson);
        } else {
          // si no es JWT, marcar que existe sesión (sin claims)
          this.usuarioLogueado = { sub: 'Usuario' };
        }
      } catch {
        this.usuarioLogueado = { sub: 'Usuario' };
      }

      this.scheduleTokenExpiry(token);
    } else {
      this.usuarioLogueado = null;
      if (this.tokenExpireTimeout) {
        clearTimeout(this.tokenExpireTimeout);
        this.tokenExpireTimeout = null;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.tokenExpireTimeout) {
      clearTimeout(this.tokenExpireTimeout);
      this.tokenExpireTimeout = null;
    }
  }
}
