import { ERole } from "./erole";

export class Role {
    idRole: number; // Déclarer le type 'number' pour idRole
    role: ERole; // Utiliser le type ERole importé

    constructor(idRole: number, role: ERole) {
        this.idRole = idRole;
        this.role = role;
    }
}
