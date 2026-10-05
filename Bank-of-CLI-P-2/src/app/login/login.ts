import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  protected showPassword = signal(false);
  protected hasError = signal(false);
  protected isLoading = signal(false);

  protected togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  protected async login(): Promise<void> {
    this.isLoading.set(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.isLoading.set(false);
    this.hasError.set(true);
  }
}
