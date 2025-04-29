import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../Services/password-reset.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onSubmit() {
    // Logique pour réinitialiser le mot de passe
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('New Password:', this.password);
    // Vous pouvez appeler un service pour envoyer les données au backend pour la réinitialisation du mot de passe
  }
}
