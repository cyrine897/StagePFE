import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend

  constructor(private http:HttpClient) { }

  registerRoleMedecin(idUser: number, signUpRequest: any): Observable<any> {
    const url = `${this.baseUrl}/register/role/medecin`;
    const params = new HttpParams().set('idUser', idUser.toString());
    return this.http.post(url, signUpRequest, { params });
  }

  savePharmacienDetails(idUser: number, signUpRequest: any): Observable<any> {
    const url = `${this.baseUrl}/register/role/pharmacien`;
    const params = new HttpParams().set('idUser', idUser.toString());
    return this.http.post(url, signUpRequest, { params });
  }
}
