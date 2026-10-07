import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Docs } from './pages/docs/docs';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  { path: 'docs', component: Docs },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
    { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' }, // must stay last
];
