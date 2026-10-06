import { Component } from '@angular/core';
import { AuthPage } from '../auth-page/auth-page';

@Component({
  imports: [AuthPage],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  readonly heading = 'Account Login';
  readonly description =
    'Welcome back! Please enter your credentials to access your secure dashboard.';
  readonly buttonText = 'Login';
  readonly footerText = "Don't have an account?";
  readonly footerActionText = 'Register';
  readonly footerActionLink = '/register';
  readonly callback = async () => {
    return Promise.resolve('Invalid credentials. Please try again.');
  };
}
