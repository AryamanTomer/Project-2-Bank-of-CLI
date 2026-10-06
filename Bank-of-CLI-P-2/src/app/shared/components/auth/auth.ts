import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';

export type AuthFields = { name: string; label: string; type: string; placeholder?: string }[];

export type FormEntries = Record<string, FormDataEntryValue>;

@Component({
  imports: [RouterLink, Button],
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
  callback = input.required<(formEntries: FormEntries) => Promise<string>>();
  fields = input.required<AuthFields>();

  protected showPassword = signal(false);
  protected isLoading = signal(false);
  protected errorText = signal('');
  protected isFormValid = signal(false);

  protected togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  protected async submit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    this.isLoading.set(true);

    try {
      const formElement = e.currentTarget as HTMLFormElement;
      const formValues: FormEntries = Object.fromEntries(new FormData(formElement).entries());

      const error = await this.callback()(formValues);
      if (error) this.errorText.set(error);
    } catch (err) {
      this.errorText.set('An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
