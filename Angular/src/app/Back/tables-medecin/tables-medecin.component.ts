import { Component, OnInit } from '@angular/core';
import { UserRoleMed } from 'src/app/model/user-role-med';
import { Utilisateur } from 'src/app/model/utilisateur';
import { AuthService } from 'src/app/Services/auth.service';
import { MedecinService } from 'src/app/Services/medecin.service';

@Component({
  selector: 'app-tables-medecin',
  templateUrl: './tables-medecin.component.html',
  styleUrls: ['./tables-medecin.component.css']
})
export class TablesMedecinComponent implements OnInit{
  constructor(private authService : AuthService , private medecinService: MedecinService){}
  utilisateur: Utilisateur = {
    username: '',
    password: '',
    email: '',
    idUser: 0,
    nom: '',
    prenom: '',
    adresse: '',
    numero: 0,
    rolee:'',
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
      filePath: '',
    },
    verifyMedecin: false,
    userRoleMed: {
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
  };
  utilisateurs: Utilisateur[] = []; // Tableau d'utilisateurs

  rolee: string = 'Medecin'; 
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
  ngOnInit(): void {
  this.getUtilisateur( );  }
 
  verifyMedecin(idUser: number): void {
    this.medecinService.verifyMedecin(idUser).subscribe(
      response => {
        console.log(response);
        this.utilisateur.verifyMedecin = true;
        alert('Medecin verified successfully!');

      },
      error => {
        console.error(error);
        alert('Error: User does not have a medecin role!');
      }
    );
  }





  getUtilisateur(): void {
  
    this.medecinService.getUtilisateursAvecRoleMed(this.rolee).subscribe(
      (data: Utilisateur[]) => {
        this.utilisateurs = data;
        console.log('Utilisateurs récupérés: ', this.utilisateurs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  
  
}
