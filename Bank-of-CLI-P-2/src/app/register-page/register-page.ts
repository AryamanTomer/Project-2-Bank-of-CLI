import { Component } from '@angular/core';
import { AuthPage } from '../auth-page/auth-page';

@Component({
  imports: [AuthPage],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  readonly heading = 'Register Account';
  readonly description =
    'Get started with a new account. Fill in your details below to set up your secure dashboard.';
  readonly buttonText = 'Register';
  readonly footerText = 'Already have an account?';
  readonly footerActionText = 'Login';
  readonly footerActionLink = '/login';
  readonly callback = async () => {
    return Promise.resolve('Account ID already exists. Please try a different account ID.');
  };
}
