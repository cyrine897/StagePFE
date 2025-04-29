import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import {  HttpHeaders } from '@angular/common/http';
import { Utilisateur } from '../model/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private baseUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend
  

  constructor(private http: HttpClient , private router: Router) {
 
  }
  verifyMedecin(idUser: number  ): Observable<Utilisateur> {
    const url = `${this.baseUrl}/verify-medecin/${idUser}`;
    return this.http.put<Utilisateur>(url , {}, );
  }


  getUtilisateursAvecRoleMed(rolee: string): Observable<Utilisateur[]> {
    const params = new HttpParams().set('rolee', rolee);
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/utilisateurs`, { params });
  }
}
