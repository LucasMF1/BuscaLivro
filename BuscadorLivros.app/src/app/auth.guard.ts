import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Lógica simples para verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!loggedIn) {
      // Redireciona para a página de login se o usuário não estiver autenticado
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}