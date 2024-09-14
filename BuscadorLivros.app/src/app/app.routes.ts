import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Importe o RegisterComponent

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register', // Adicione a rota para a página de registro
    component: RegisterComponent
  },
  {
    path: 'books',
    component: AppComponent
  }
];
