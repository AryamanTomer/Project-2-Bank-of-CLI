import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly authService = inject(AuthService);
  private readonly isLoggedIn = !!this.authService.getCurrentUser();
  private readonly buttonMessage = this.isLoggedIn ? 'Back to Dashboard' : 'Back to Login';
}
