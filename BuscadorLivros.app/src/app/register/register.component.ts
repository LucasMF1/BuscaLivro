import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Função para registro
  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não correspondem. Por favor, tente novamente.');
      return;
    }

    this.authService.register(this.username, this.password)
      .subscribe({
        next: () => {
          alert('Registro bem-sucedido! Você será redirecionado para a tela de login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao registrar:', error);
          const errorMessage = error?.error?.message || 'Houve um erro no registro. Por favor, tente novamente.';
          alert(errorMessage);
        }
      });
  }

  // Função de cancelamento
  onCancel(): void {
    this.router.navigate(['/login']); // Redireciona para a página de login ou outra página de sua escolha
  }
}
 