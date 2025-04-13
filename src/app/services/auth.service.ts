import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  // Guardar el token después del login
  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Eliminar el token en logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener el token actual (por si lo necesitas en otros servicios)
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
