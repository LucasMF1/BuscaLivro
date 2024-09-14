import { Component, OnInit } from '@angular/core'; // Adicionando OnInit
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Verifica se o usuário está logado
    this.loggedIn = localStorage.getItem('loggedIn') === 'true';
    
    // Redireciona para a página de login caso não esteja logado
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
  }
  
    // Função de logout
    logout(): void {
      localStorage.removeItem('loggedIn'); // Remove o estado de login
      this.loggedIn = false;
      this.router.navigate(['/login']); // Redireciona para a tela de login
    }

  // Função para realizar o login e armazenar o estado de autenticação no localStorage
  login(username: string, password: string): void {
    if (username === 'admin' && password === 'password') {
      this.loggedIn = true;
      localStorage.setItem('loggedIn', 'true'); // Armazena o estado de login
      this.router.navigate(['/books']); // Redireciona para a página de livros
    } else {
      alert('Credenciais inválidas');
    }
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

  addToFavorites(book: Book): void {
    // Solicita uma avaliação ao usuário
    const ratingInput = prompt('Dê uma avaliação (1-5):');
    
    // Verifica se o usuário forneceu uma avaliação válida
    if (ratingInput !== null) {
      const rating = parseInt(ratingInput, 10);
  
      // Valida se a avaliação está entre 1 e 5
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        
        // Solicita uma nota pessoal
        const personalNote = prompt('Escreva uma nota pessoal sobre o livro:');
        
        // Adiciona o livro aos favoritos com a avaliação e a nota
        const favoriteBook = {
          ...book,
          rating: rating,
          note: personalNote || '' // Se o usuário não fornecer uma nota, armazena uma string vazia
        };
  
        // Aqui você pode salvar os dados no servidor ou no localStorage
        console.log(`Livro favoritado: ${book.title}, Avaliação: ${rating}, Nota: ${personalNote}`);
        
        // Exemplo de como armazenar no localStorage (substitua por uma chamada de API para um backend se necessário)
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites.push(favoriteBook);
        localStorage.setItem('favorites', JSON.stringify(favorites));
  
        alert(`Livro "${book.title}" foi favoritado com sucesso!`);
      } else {
        alert('Por favor, insira uma avaliação válida entre 1 e 5.');
      }
    } else {
      alert('A ação de favoritar foi cancelada.');
    }
  }
  
  
}