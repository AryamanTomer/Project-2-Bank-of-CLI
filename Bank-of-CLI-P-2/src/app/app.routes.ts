import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { LoginPage } from './login-page/login-page';
import { RegisterPage } from './register-page/register-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
];
