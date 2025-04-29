import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { JwtResponse } from '../model/jwt-response';
import { RegisterRequest } from '../model/register-request';
import { LoginRequest } from '../model/login-request';
import { Utilisateur } from '../model/utilisateur';
import { Route, Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient , private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string, email: string): Observable<JwtResponse> {
    const loginUrl = `${this.baseUrl}/signin`;
    return this.http.post<JwtResponse>(loginUrl, { username, password, email });
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/currentUser`);
  }
  getUsersByRole(rolee: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/utilisateurs?rolee=${rolee}`);
  }

 
  getDossierMedicalByUserId(idUser: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/dossierMedical/${idUser}`);
  }
 

  register(registerRequest: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/register`, registerRequest, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'inscription:', error);
          return throwError(error);
        })
      );
  }

 
  
  registerRoleMedecin(idUser: number, registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/role/medecin`, registerRequest, {
      params: { idUser: idUser.toString() }
    })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'enregistrement du rôle médecin:', error);
          return throwError(error);
        })
      );
  }

  registerRolePharmacien(idUser: number, registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/role/pharmacien`, registerRequest, {
      params: { idUser: idUser.toString() }
    });
  }
  getPhotoByEmail(email: string): Observable<Blob> {
    console.log('Requesting photo for email:', email); // Log the request
    const url = `${this.baseUrl}/photo/${email}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getUserProfile(email: string): Observable<any> {
    const profileUrl = `${this.baseUrl}/profile?email=${email}`;
    return this.http.get(profileUrl);
  }
  
  updateProfile(email: string, utilisateur: Utilisateur): Observable<Utilisateur> {
    const url = `${this.baseUrl}/updateProfile/${email}`;
    return this.http.put<Utilisateur>(url, utilisateur)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadFile(file: File, idUser: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('idUser', idUser.toString());

    return this.http.post<any>(`${this.baseUrl}/uploadFileDiplome`, formData);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur s\'est produite :', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Code d'erreur ${error.status}, ` +
        `Erreur : ${error.error}`);
    }
    // Retourne une erreur observable avec un message convivial
    return throwError(
      'Une erreur s\'est produite; veuillez réessayer plus tard.');
  }
  uploadPhoto(idUser: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/${idUser}/uploadPhoto`, formData);
  }
  logout() {
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(
      () => {
        localStorage.removeItem('token'); // Supprimer le token du stockage local (si utilisé)
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
      },
      error => {
        console.error('Error during logout', error);
      }
    );
  }
 
}
