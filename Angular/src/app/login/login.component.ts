import { Component } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { JwtResponse } from '../model/jwt-response';
import { RegisterRequest } from '../model/register-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: '',
    email:''
  };
  message: string = '';
  token: string = '';

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  /*login() {
    
    const loginRequest = { username: this.loginRequest.username, password: this.loginRequest.password };
    this.authService.login(this.loginRequest.username, this.loginRequest.password, this.loginRequest.email).subscribe(
      response => {
        this.message = 'Connexion réussie'; // Message de succès
        console.log(response);

        // Gérer la réponse JWT ou autre retour du serveur
        console.log(this.message);
        this.router.navigate(['/home']); 
        // Redirection vers la page home après une connexion réussie
      },
      error => {
        // Gérer les erreurs
        console.error(error);
      }
    );
  }*/
    login() {
      const { username, password, email } = this.loginRequest;
      console.log('Attempting login with:', this.loginRequest);
    
      this.authService.login(username, password, email).subscribe(
        (response: JwtResponse) => {
          this.message = 'Connexion réussie'; // Success message
          console.log('Login successful:', response);
    
          // Redirect to the profile page after a successful login
          this.navigateToProfile(email);
    
          // Fetch the user's profile after login
          this.getUserProfile(email);
        },
        error => {
          // Handle login errors
          console.error('Login error:', error);
          if (error.status === 401) {
            this.message = 'Invalid credentials. Please try again.'; // Specific message for unauthorized error
          } else {
            this.message = 'An error occurred. Please try again later.';
          }
        }
      );
    }
    
    getUserProfile(email: string) {
      console.log('Fetching user profile for email:', email);
    
      this.authService.getUserProfile(email).subscribe(
        response => {
          console.log('User profile:', response);
          // Handle profile data here
        },
        error => {
          console.error('Error fetching user profile:', error);
          // Handle profile fetch error here, e.g., display an error message to the user
        }
      );
    }
    
    navigateToProfile(email: string) {
      console.log('Navigating to profile page with email:', email);
      this.router.navigate(['/profile', email]); // Utilisation de la route avec le paramètre email
    }
    
    
 
}


  
 

