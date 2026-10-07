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
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  readonly heading = 'Register Account';
  readonly description =
    'Get started with a new account. Fill in your details below to set up your secure account dashboard.';
  readonly buttonText = 'Register';
  readonly footerText = 'Already have an account?';
  readonly footerActionText = 'Login';
  readonly footerActionLink = '/login';
  readonly fields: AuthFields = [
    {
      name: 'accountId',
      label: 'Account ID',
      type: 'text',
      placeholder: 'ACT-1001',
    },
    {
      name: 'nickname',
      label: 'Account Nickname',
      type: 'text',
      placeholder: 'Superman',
    },
    {
      name: 'accountPin',
      label: 'Account PIN',
      type: 'password',
      placeholder: '••••',
    },
  ];
  readonly callback: AuthCallback = async <T>(formEntries: FormEntries): ActionResult<T> => {
    // console.log(formEntries);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (formEntries['accountId'] === 'ACT-1001') {
      return {
        success: false,
        errors: ['Account ID already exists. Please try again.'],
      };
    }

    return {
      success: true,
      toast: 'Registration successful! You will be redirected to the login page in 3s.',
      redirect: '/login',
    };
  };
}
