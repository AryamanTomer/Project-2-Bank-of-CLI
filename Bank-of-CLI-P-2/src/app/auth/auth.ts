import { Component, input, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  selector: 'app-auth',
  styleUrl: './auth.css',
  templateUrl: './auth.html',
})
export class Auth {
  heading = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  footerText = input.required<string>();
  footerActionText = input.required<string>();
  footerActionLink = input.required<string>();
  callback = input.required<() => Promise<string>>();

  protected showPassword = signal(false);
  protected isLoading = signal(false);
  protected errorText = signal('');

  protected togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  protected async submit(): Promise<void> {
    this.isLoading.set(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const error = await this.callback()();

      if (!error) {
        return;
      }

      this.errorText.set(error);
    } catch (err) {
      this.errorText.set('An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
