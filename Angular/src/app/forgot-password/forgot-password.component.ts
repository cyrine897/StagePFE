import { Component } from '@angular/core';
import { PasswordResetService } from '../Services/password-reset.service';
import { RegisterRequest } from '../model/register-request';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
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
  token: string='';
  newPassword: string='';
  resetTokenSent: boolean = false;
  resetSuccess: boolean = false;
  errorMessage: string='';

  constructor(private passwordService: PasswordResetService) { }

  // Méthode appelée lorsque l'utilisateur soumet le formulaire pour oublier le mot de passe
  onSubmitForgotPassword() {
    this.passwordService.forgotPassword(this.registerRequest.email).subscribe(
      response => {
        this.resetTokenSent = true;
      },
      error => {
        console.error('Erreur lors de l\'envoi du token de réinitialisation : ', error);
        // Gérer l'erreur ici
      }
    );
  }

  // Méthode appelée lorsque l'utilisateur soumet le formulaire pour réinitialiser le mot de passe
  onSubmitResetPassword() {
    this.passwordService.resetPassword(this.token, this.newPassword).subscribe(
      response => {
        this.resetSuccess = true;
      },
      error => {
        console.error('Erreur lors de la réinitialisation du mot de passe : ', error);
        this.errorMessage = error.error; // Afficher le message d'erreur à l'utilisateur
      }
    );
  }
}
