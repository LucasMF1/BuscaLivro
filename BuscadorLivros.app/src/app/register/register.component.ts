import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // Certifique-se de incluir o FormsModule aqui
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não correspondem.');
      return;
    }

    this.authService.register(this.username, this.password)
      .subscribe({
        next: () => {
          alert('Registro bem-sucedido!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao registrar:', error); // Log do erro completo
          const errorMessage = error?.error?.message || 'Erro ao registrar.';
          alert(errorMessage);
        }
      });
  }
}
