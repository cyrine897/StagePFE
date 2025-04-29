import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RegisterRequest } from '../model/register-request';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ERole } from '../model/erole';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../model/utilisateur';
import { RoleService } from '../Services/role.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoleMed } from '../model/user-role-med';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private baseUrl = 'http://localhost:8089/sahty/api/auth'; // URL de votre API backend

  utilisateur: Utilisateur = {
    username: '',
    password: '',
    email: '',
    idUser: 0,
    nom: '',
    prenom: '',
    adresse: '',
    numero: 0,
    roles: [],
    photo: '',
    date_naissance: new Date(),
    dossierMedical: {
      idDossier: 0,
      fichier: '',
      fileName: '',
      name: '',
      nomUrgence: null,
      numeroUrgence: 0,
      taille: 0,
      poids: 0,
      anticedentsMedicaments: '',
      vaccination: '',
      dateVaccination: new Date(),
      description: '',
      consommation: [],
      activitePhysique: [],

      type: '',
      filePath: ''
    },
    rolee: '',
    verifyMedecin: false,
    userRoleMed: {
      numerodelicencedeMed: 0,
      adresseMed: '',
      qualificationsMed: '',
      nomMed: '',
      pieceIdentiteMed: '',
      copiedelalicencedeMed: '',
      diplomesMed: '',
      dateObtentionDeLaLicenceMed: new Date(),
      positionMed: '',
      numeroTelephoneMed: 0,
      numerodelicencemedicale: 0
    }
  };
  userRoleMed : UserRoleMed ={
    pieceIdentiteMed: '',
    copiedelalicencedeMed: '',
    diplomesMed: '',
    dateObtentionDeLaLicenceMed: new Date(),
    numerodelicencedeMed: 0,
    qualificationsMed: '',
    positionMed: '',
    numeroTelephoneMed: 0,
    adresseMed: '',
    nomMed: '',
    numerodelicencemedicale: 0
  }
  registerRequest: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    adresse: '',
    date_naissance: new Date(), // Initialisez avec une date par défaut
    numero: 0,
    rolee: '',
    pieceIdentitPharm: '',
    copiedelalicencedePharm: '',
    diplomesPharm: '',
    dateObtentionDeLaLicencePharm: new Date(),
    numerodelicencedePharm: 0,
    qualificationsPharm: '',
    positionPharm: '',
    numeroTelephonePharm: 0,
    adressePharm: '',
    nomPharm: '',
    numerodelicencePharm: 0,
    pieceIdentiteMed: '',
    copiedelalicencedeMed: '',
    diplomesMed: '',
    dateObtentionDeLaLicenceMed: new Date(),
    numerodelicencedeMed: 0,
    qualificationsMed: '',
    positionMed: '',
    numeroTelephoneMed: 0,
    adresseMed: '',
    nomMed: '',
    numerodelicencemedicale: 0
  };
  roles: string[] = Object.values(ERole);
  
  currentPage = 0;
  totalPages = 2; // Change this based on your sections
  message: string = '';
  confirmPassword = '';
  selectedRole: string = ''; // Rôle sélectionné

  selectedFile: File | null = null;
  confirmPassword1: string = '';

  passwordValid: boolean = true;
  passwordsMatch1: boolean = true;
  constructor(private fb: FormBuilder ,private authService: AuthService, private roleService :RoleService,private router: Router , private http : HttpClient) {
   
  }


  

  validatePassword() {
    const password = this.registerRequest.password;

    // Vérifier si le mot de passe contient au moins une lettre majuscule, une lettre minuscule, et un chiffre.
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    // Vérifier si le mot de passe ne contient pas de caractères spéciaux interdits.
    const noSpecialChar = /^[^.;§!?]*$/.test(password);

    this.passwordValid = hasUpperCase && hasLowerCase && hasNumber && noSpecialChar;

    // Vérifier si les mots de passe sont identiques.
    this.passwordsMatch1 = this.registerRequest.password === this.confirmPassword1;
  }
  


 



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.utilisateur.idUser !== null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('idUser', this.utilisateur.idUser.toString());

      this.http.post('http://localhost:8089/sahty/api/auth/uploadFileDiplome', formData, { responseType: 'text' })
        .subscribe(
          response => {
            console.log('File uploaded successfully:', response);
          },
          error => {
            console.error('Error uploading file:', error);
          }
        );
    }
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  
 register(role: string , event: Event) {
    event.preventDefault(); // Prevent default form submission

    this.registerRequest.rolee = role; // Définir le rôle basé sur l'onglet sélectionné
    console.log('Données d\'enregistrement :', this.registerRequest); // Afficher les données d'enregistrement dans la console

    this.authService.register(this.registerRequest).subscribe(
      response => {
        this.utilisateur.idUser = response.idUser; // Assign idUser from response
        console.log('Utilisateur enregistré avec succès, idUser:', this.utilisateur.idUser , this.registerRequest);
        this.changePage(this.currentPage + 1);
      },
      error => {
        console.error('Erreur lors de l\'enregistrement :', error);
      }
    );
    
  }


   

  // Méthode pour vérifier si les mots de passe correspondent
  passwordsMatch(): boolean {
    return this.registerRequest.password === this.confirmPassword;
  }

  // Méthode pour enregistrer les détails spécifiques au pharmacien
  onRegisterPharmacien() {
    this.authService.registerRolePharmacien(this.utilisateur.idUser, this.registerRequest)
      .subscribe(response => {
        console.log('Pharmacien details saved successfully', response);
      }, error => {
        console.error('Error registering Pharmacien', error);
      });
  }

  // Méthode pour enregistrer les détails spécifiques au médecin
  onRegisterMed(event: Event) {
    event.preventDefault(); // Prevent default form submission

    // Log the idUser to ensure it's correctly assigned
    console.log('Registering Médecin with idUser:', this.utilisateur.idUser, this.registerRequest);


   
    // Ensure idUser is not zero or undefined
    if (this.utilisateur.idUser && this.utilisateur.idUser > 0) {
      this.authService.registerRoleMedecin(this.utilisateur.idUser, this.registerRequest)
        .subscribe({
          next: (response) => {
            console.log('Médecin details saved successfully:', response);
            console.log('Contenu de registerRequest:', this.registerRequest);
            this.router.navigate(['/welcomepage'], { queryParams: { message: 'Votre compte est en cours de traitement, veuillez consulter votre email pour confirmation.' } });

          },
          error: (error) => {
            console.error('Error registering Médecin:', error);
          }
        });
    } else {
      console.error('Invalid idUser. Registration aborted.');
    }
    
  }
    

}