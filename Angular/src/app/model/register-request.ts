import { ERole } from "./erole";

export interface RegisterRequest {
    username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  adresse: string;
  date_naissance: Date;
  rolee: string;

  numero: number;

    pieceIdentitPharm : string;

    copiedelalicencedePharm : string;
    diplomesPharm : string;

     dateObtentionDeLaLicencePharm  : Date;
     numerodelicencedePharm : number;
       qualificationsPharm : string;
    positionPharm : string;

      numeroTelephonePharm : number;
     adressePharm : string;
    nomPharm : string;
    numerodelicencePharm : number ;

    pieceIdentiteMed : string;

    copiedelalicencedeMed : string ;
   diplomesMed : string;

     dateObtentionDeLaLicenceMed : Date;
    numerodelicencedeMed  : number;
      qualificationsMed : string;
     positionMed : string;

      numeroTelephoneMed : number;
  adresseMed : string;
     nomMed : string;
      numerodelicencemedicale : number;


     roleMedData?: any; // Add this field if it's supposed to be part of the request


       
   
   
}
  
