import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para o ngModel

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username  = '';
  password  = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    // Verifica as credenciais de login
    if (this.username === 'admin' && this.password === 'password') {
      // Armazena o estado de login no localStorage
      localStorage.setItem('loggedIn', 'true');

      // Redireciona para a página de livros
      this.router.navigate(['/books']);
    } else {
      alert('Credenciais inválidas');
    }
  }
}