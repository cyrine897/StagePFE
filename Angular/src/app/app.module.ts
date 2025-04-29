import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MedecinComponent } from './medecin/medecin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPageComponent } from './Back/admin-page/admin-page.component';
import { TablesMedecinComponent } from './Back/tables-medecin/tables-medecin.component';
import { ChartsComponent } from './Back/charts/charts.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MedecinComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    PaginationComponent,
    AdminPageComponent,
    TablesMedecinComponent,
    ChartsComponent,
    WelcomepageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule ,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
