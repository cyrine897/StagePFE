export class JwtResponse {
    accessToken: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
    token: string; // Assurez-vous que cette propriété correspond à ce que votre backend renvoie

    constructor(accessToken: string, id: number, username: string, email: string, roles: string[],   token: string    ) {
      this.accessToken = accessToken;
      this.id = id;
      this.username = username;
      this.email = email;
      this.roles = roles;
      this.token=token;
    }
}
