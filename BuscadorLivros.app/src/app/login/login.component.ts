import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para o ngModel
import { AuthService } from '../auth.service'; // Importa o serviço de autenticação
import { RouterModule } from '@angular/router'; // Importar o RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    // Chama o serviço de login para verificar as credenciais
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Login bem-sucedido, armazena o estado de login
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', response.userId.toString()); // Armazena o ID do usuário
        localStorage.setItem('username', this.username); // Armazena o nome de usuário

        // Redireciona para a página de livros
        this.router.navigate(['/books']);
      },
      () => {
        // Em caso de erro de autenticação
        alert('Credenciais inválidas');
      }
    );
  }
}
