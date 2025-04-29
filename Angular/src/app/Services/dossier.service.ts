import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DossierMedical } from '../model/dossier-medical';

@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private baseUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend

  constructor(private http: HttpClient) { }
  uploadFile(file: File, idUser: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('idUser', idUser.toString());

    return this.http.post<any>(`${this.baseUrl}/upload`, formData);
  }

  saveDossierMedical(email: string, formData: FormData): Observable<any> {
    const url = `your-api-endpoint/${email}`;
    return this.http.post<any>(`${this.baseUrl}/save/${email}`, formData);
  }

  downloadFiles(fileName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fileName}`, { responseType: 'arraybuffer' });
  }
  getDossierMedicalByEmail(email: string): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.baseUrl}/dossiermedical`, { params: { email } });
  }
}
