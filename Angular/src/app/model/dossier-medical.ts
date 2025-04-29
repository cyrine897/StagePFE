import { SafeUrl } from "@angular/platform-browser";
import { ActivitePhysique } from "./activite-physique";
import { Consommation } from "./consommation";

export interface DossierMedical {

 

    idDossier: number;
    fichier: string;
    fileName: string | null;
    name: string | null;
    nomUrgence: string | null; // Vérifiez si c'est 'NomUrgence' ou 'nomUrgence'
    numeroUrgence: number; // Vérifiez si c'est 'NumeroUrgence' ou 'numeroUrgence'
    taille: number;
    poids: number;
    anticedentsMedicaments: string ;
    vaccination: string;
    dateVaccination: Date | null; // Date ou null
    description: string;
    type: string;
    filePath: string;
    activitePhysique : ActivitePhysique[];
    consommation : Consommation[];
}
