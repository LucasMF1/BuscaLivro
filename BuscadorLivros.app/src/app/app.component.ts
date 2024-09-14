import { Component, OnInit } from '@angular/core'; // Adicionando OnInit
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service'; // Certifique-se de importar o AuthService

interface Book {
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_sentence?: string;
  description?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BuscadorLivros.app';
  books: Book[] = [];
  loggedIn = false; // Controle de login
  username = ''; // Variável para armazenar o nome de usuário

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Verifica se o usuário está logado
    this.loggedIn = localStorage.getItem('loggedIn') === 'true';
    this.username = localStorage.getItem('username') || ''; // Recupera o nome de usuário

    // Redireciona para a página de login caso não esteja logado
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  // Função de logout
  logout(): void {
    localStorage.removeItem('loggedIn'); // Remove o estado de login
    localStorage.removeItem('username'); // Remove o nome de usuário
    this.loggedIn = false;
    this.router.navigate(['/login']); // Redireciona para a tela de login
  }

  // Função para realizar a pesquisa por título, autor ou ambos
  search(query: string, searchBy: string): void {
    if (query && (searchBy === 'title' || searchBy === 'author')) {
      const apiUrl = `https://openlibrary.org/search.json?${searchBy}=${query}`;

      this.http.get<{ docs: Book[] }>(apiUrl)
        .subscribe((data) => {
          this.books = data.docs.map(book => ({
            ...book,
            description: book.first_sentence || book.description || 'Descrição não disponível'
          }));
        });
    } else if (query && searchBy === 'todo') {
      const titleRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?title=${query}`);
      const authorRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?author=${query}`);

      forkJoin([titleRequest, authorRequest]).subscribe(([titleData, authorData]) => {
        const combinedBooks = [...titleData.docs, ...authorData.docs];
        this.books = this.removeDuplicates(combinedBooks).map(book => ({
          ...book,
          description: book.first_sentence || book.description || 'Descrição não disponível'
        }));
      });
    } else {
      console.error('Tipo de pesquisa inválido');
    }
  }

  private removeDuplicates(books: Book[]): Book[] {
    const seen = new Set<string>();
    return books.filter(book => {
      const identifier = book.title + (book.author_name ? book.author_name.join(',') : '');
      if (seen.has(identifier)) {
        return false;
      }
      seen.add(identifier);
      return true;
    });
  }

  getBookCoverUrl(book: Book): string {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
    return 'assets/no-cover.jpg';
  }

  // Função para favoritar um livro e enviá-lo ao servidor
  addToFavorites(book: Book): void {
    const ratingInput = prompt('Dê uma avaliação (1-5):');

    if (ratingInput !== null) {
      const rating = parseInt(ratingInput, 10);

      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        const personalNote = prompt('Escreva uma nota pessoal sobre o livro:');
        const tags = prompt('Adicione algumas tags (separadas por vírgulas):');

        const userId = localStorage.getItem('userId'); // Obtém o ID do usuário logado
        if (!userId) {
          alert('Você precisa estar logado para favoritar um livro.');
          return;
        }

        // Envia os dados para o servidor via AuthService
        this.authService.addFavorite(parseInt(userId), book.title, personalNote || '', rating, tags || '')
          .subscribe(
            () => {
              alert(`Livro "${book.title}" foi favoritado com sucesso!`);
            },
            () => {
              alert('Erro ao favoritar o livro.');
            }
          );
      } else {
        alert('Por favor, insira uma avaliação válida entre 1 e 5.');
      }
    } else {
      alert('A ação de favoritar foi cancelada.');
    }
  }
}
