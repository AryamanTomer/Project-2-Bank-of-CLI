import { Component } from '@angular/core';
import { AuthPage } from '../../shared/components/auth-page/auth-page';
import {
  ActionResult,
  AuthCallback,
  AuthFields,
  FormEntries,
} from '../../shared/components/auth/auth';

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
  readonly fields: AuthFields = [
    {
      name: 'accountId',
      label: 'Account ID',
      type: 'text',
    },
    {
      name: 'accountPin',
      label: 'Account PIN',
      type: 'password',
    },
  ];
  readonly callback: AuthCallback = async <T>(formEntries: FormEntries): ActionResult<T> => {
    console.log(formEntries);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // return {
    //   success: false,
    //   errors: ['Invalid credentials. Please try again.'],
    // };
    return {
      success: true,
      redirect: '/dashboard',
    };
  };
}
