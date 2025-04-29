import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RegisterRequest } from '../model/register-request';
import { UserProfile } from '../model/user-profile';
import { Utilisateur } from '../model/utilisateur';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../Services/profile.service';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { DossierService } from '../Services/dossier.service';
import { DossierMedical } from '../model/dossier-medical';
import { ActivitePhysique } from '../model/activite-physique';
import { Consommation } from '../model/consommation';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
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
  errorMessage: string = '';
  editMode: boolean = false; // Initialiser le mode d'édition à false
  selectedFile: File | null = null;
  imageUrl: SafeUrl | undefined;
  previewUrl: SafeUrl | null = null;
  photoUrl: SafeUrl | null = null;
 dossierMedical: any;
 errorFetching = false;

 currentPage = 0;
 totalPages = 5; // Change this based on your sections
  constructor(private http:HttpClient ,private fb: FormBuilder,private dossierSevice : DossierService ,private authService: AuthService, private profileService:ProfileService, private route: ActivatedRoute , private sanitizer: DomSanitizer) {
    }
  activitePhysiques = Object.values(ActivitePhysique);
  consommations = Object.values(Consommation);
  ngOnInit(): void {
   
 const email = this.route.snapshot.paramMap.get('email');
 if (email) {
   this.getUserProfile(email);
   this.getDossierMedicalByEmail(email);

 } else {
   this.errorMessage = 'Email not found in route parameters.';
 }
    
  
   
  }

  getPhoto(email: string): void {
    if (email) {
      this.authService.getPhotoByEmail(email).subscribe(
        (blob: Blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          console.error('Error fetching photo', error);
        }
      );
    } else {
      this.photoUrl = null;
    }
  }

  getDossierMedicalByEmail(email: string): void {
    this.dossierSevice.getDossierMedicalByEmail(email).subscribe(
      (response: DossierMedical) => {
        this.dossierMedical = response;
      },
      error => {
        console.error('Error fetching medical record: ', error);
      }
    );
  }
  fetchDossierMedical(): void {
    this.authService.getDossierMedicalByUserId(this.utilisateur.idUser).subscribe(
      data => {
        this.dossierMedical = data;
      },
      error => {
        console.error('Erreur lors de la récupération du dossier médical', error);
      }
    );
  }

  
 
  getUserProfile(email: string): void {
    this.authService.getUserProfile(email).subscribe(
      (response: Utilisateur) => {
        this.utilisateur = response;
        // Une fois que vous avez récupéré le profil, appelez getPhoto pour charger l'image
        this.getPhoto(email);
      },
      error => {
        console.error('Error fetching user profile', error);
        this.errorMessage = 'Error fetching user profile.';
      }
    );
  }
 


  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveProfileChanges() {
   
  }

 
  UpdateAll(){
    this.onSubmit();
      }
 
 /* onSubmit() {
  
    this.editMode = !this.editMode;

    if (this.utilisateur) {
      this.authService.updateProfile(this.utilisateur.email, this.utilisateur)
        .subscribe(
          updatedUser => {
            console.log('Profil utilisateur mis à jour avec succès :', updatedUser);
            // Traitez la réponse ici si nécessaire
          },
          error => {
            console.error('Erreur lors de la mise à jour du profil :', error);
            // Gérez l'erreur ici
          }
        );
    } else {
      console.error('Utilisateur non défini lors de la soumission du formulaire.');
      // Handle this case appropriately, perhaps show an error message to the user
    }
  }*/
  
    onSubmit() {
      this.editMode = !this.editMode;
    
      if (this.utilisateur) {
        // Ensure dossierMedical is properly initialized
        const dossierMedical = this.utilisateur.dossierMedical ?? {
          idDossier: 0,
          fichier: '',
          fileName: '',
          name: '',
          nomUrgence: '',
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
        };
    
        // Replace null properties with default values
        dossierMedical.anticedentsMedicaments = dossierMedical.anticedentsMedicaments || '';
        dossierMedical.dateVaccination = dossierMedical.dateVaccination ?? new Date();
        dossierMedical.description = dossierMedical.description || '';
        dossierMedical.fileName = dossierMedical.fileName || '';
        dossierMedical.filePath = dossierMedical.filePath || '';
        dossierMedical.name = dossierMedical.name || '';
        dossierMedical.nomUrgence = dossierMedical.nomUrgence || '';
        dossierMedical.numeroUrgence = dossierMedical.numeroUrgence ?? 0;
        dossierMedical.poids = dossierMedical.poids ?? 0;
        dossierMedical.taille = dossierMedical.taille ?? 0;
        dossierMedical.type = dossierMedical.type || '';
        dossierMedical.vaccination = dossierMedical.vaccination || '';
        dossierMedical.activitePhysique = dossierMedical.activitePhysique || [];
        dossierMedical.consommation = dossierMedical.consommation || [];

        this.authService.updateProfile(this.utilisateur.email, {
          ...this.utilisateur,
          dossierMedical: dossierMedical
        })
        .subscribe(
          updatedUser => {
            console.log('Profil utilisateur mis à jour avec succès :', updatedUser);
            // Handle success if needed
          },
          error => {
            console.error('Erreur lors de la mise à jour du profil :', error);
            // Handle error if needed
          }
        );
      } else {
        console.error('Utilisateur non défini lors de la soumission du formulaire.');
        // Handle this case appropriately, perhaps show an error message to the user
      }
    }
    
    
  changePage(page: number) {
    this.currentPage = page;
  }
  

 /* onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }*/
    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
  
        // Affichage de l'image sélectionnée
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
    onFileSelectedDoss(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
  
        // Affichage de l'image sélectionnée
        const reader = new FileReader();
        reader.onload = () => {
          if (this.utilisateur && this.utilisateur.dossierMedical) {
            const safeUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
            this.utilisateur.dossierMedical.fichier = this.sanitizer.sanitize(SecurityContext.URL, safeUrl) as string;
            this.previewUrl = safeUrl;
          }
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  
  
 
 
  /*  onUpload() {
      if (this.utilisateur && this.utilisateur.idUser && this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
  
        this.http.post(`${this.baseUrl}/${this.utilisateur.idUser}/uploadDossier`, formData).subscribe(
          response => {
            console.log('File uploaded successfully');
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
      }
    }
 */

    selectedFiles?: FileList;
  description = '';


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

 
 

 
  handleFileInput(input: HTMLInputElement): void {
    const files = input.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }
  

  onUpload(): void {
    if (this.selectedFile) {
      this.dossierSevice.uploadFile(this.selectedFile, this.utilisateur.idUser)
        .subscribe(
          (response) => {
            console.log('File uploaded successfully:', response);
            // Traitez la réponse ici si nécessaire
          },
          (error) => {
            console.error('Error uploading file:', error);
            // Gérez les erreurs ici
          }
        );
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }
  onDossSelected(event: any, fileNameInput: HTMLInputElement): void {
    const file = event.target.files[0];
    if (file) {
      fileNameInput.value = file.name;
    }
  }

  downloadFile(fileName: string): void {
    this.dossierSevice.downloadFiles(fileName).subscribe(response => {
      this.saveFile(response, `${fileName}.pdf`);
    }, error => {
      console.error('Error downloading the file', error);
    }); 
  }

  private saveFile(data: Blob, fileName: string): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  
  logout() {
    this.authService.logout();
  }
}
