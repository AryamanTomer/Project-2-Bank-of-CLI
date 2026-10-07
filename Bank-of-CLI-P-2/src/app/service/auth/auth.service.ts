import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';

// const FAKE_SECRET = 'a-string-secret-at-least-256-bits-long';
const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6MSwibmlja25hbWUiOiJKb2huIn0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjo5OTk5OTk5OTk5fQ.CS5z1eQwI7DDc7xKUmX1mLABiCpYzzUihZdlIXtFCIk';

export interface JwtPayload {
  user: {
    accountId: number;
    nickname: string;
  };
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private http = inject(HttpClient);
  // private apiUrl = 'https://api.yourdomain.com/auth';

  async login(credentials: { accountId: string; accountPin: string }): Promise<void> {
    // return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap(response => {
    //     // Save the JWT in localStorage (or sessionStorage)
    //     localStorage.setItem('jwt', response.token);
    //   })
    // );
    localStorage.setItem('jwt', FAKE_JWT);
    const decoded = jwtDecode<JwtPayload>(FAKE_JWT);
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getCurrentUser(): JwtPayload | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }
      return decoded;
    } catch (error) {
      // Invalid token format
      this.logout();
      return null;
    }
  }
}
