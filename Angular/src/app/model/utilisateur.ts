import { DossierMedical } from "./dossier-medical";
import { ERole } from "./erole";

export interface Utilisateur {
    idUser: number;
    nom: string;
    username: string;
    prenom: string;
    adresse: string;
    email: string;
    password: string;
    date_naissance: Date;
    numero: number;
    roles: ERole[]; //
    photo: string;
    dossierMedical?: DossierMedical;
    rolee: string;
     verifyMedecin : Boolean;
     userRoleMed: {
        numerodelicencedeMed: number;
        adresseMed: string;
        qualificationsMed: string;
        nomMed: string;
        pieceIdentiteMed: string;
    
    copiedelalicencedeMed: string;
    diplomesMed: string;
    dateObtentionDeLaLicenceMed:  Date;
    positionMed: string;
    numeroTelephoneMed: number;
    numerodelicencemedicale: number;
      };

      

}
