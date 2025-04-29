import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private apiUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend

  constructor(private http: HttpClient) { }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Méthode pour réinitialiser le mot de passe avec le token et le nouveau mot de passe
  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}
