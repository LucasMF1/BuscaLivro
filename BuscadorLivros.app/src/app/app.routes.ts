import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Importe o RegisterComponent
import { FavoritesComponent } from './favorites/favorites.component'; // Importe o FavoritesComponent

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
    path: 'register', // Rota para a página de registro
    component: RegisterComponent
  },
  {
    path: 'books', // Rota para a página de busca de livros
    component: AppComponent
  },
  {
    path: 'favorites', // Rota para a página de livros favoritados
    component: FavoritesComponent
  }
];
