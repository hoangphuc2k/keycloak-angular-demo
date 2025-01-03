import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(private readonly keycloak: KeycloakService) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    } else {
      this.keycloak.login();
    }
  }

  public logout() {
    this.keycloak.logout();
  }
}
