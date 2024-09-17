import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
import { FavoritesComponent } from './favorites/favorites.component'; // Importando o FavoritesComponent


interface Book {
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_sentence?: string;
  description?: string;
  key?: string;
  isFavorited?: boolean;  // Adicionando a propriedade para indicar se é favoritado
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule, FavoritesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BuscadorLivros.app';
  books: Book[] = [];
  loggedIn = false;
  username = '';
  password = '';
  activePage = 'books';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loggedIn = localStorage.getItem('loggedIn') === 'true';
    this.username = localStorage.getItem('username') || '';
  
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.activePage = 'books'; 
    }
  }
  
  onSubmit() {
    if (this.username && this.password) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', this.username);
      this.loggedIn = true;
      this.router.navigate(['/']); 
    } else {
      alert('Nome de usuário e senha são obrigatórios!');
    }
  }

  navigateToFavorites(): void {
    this.activePage = 'favorites';
  }

  navigateToBooks(): void {
    this.activePage = 'books';
  }

  navigateToAbout(): void {
    this.activePage = 'about';
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  search(query: string, searchBy: string): void {
    console.log('Query:', query, 'Search By:', searchBy);  // Log para depuração
    
    if (query && (searchBy === 'title' || searchBy === 'author')) {
      const apiUrl = `https://openlibrary.org/search.json?${searchBy}=${query}`;
      this.http.get<{ docs: Book[] }>(apiUrl)
        .subscribe((data) => {
          this.books = data.docs.map(book => ({
            ...book,
            description: book.first_sentence || book.description || 'Descrição não disponível'
          }));
  
          // Após obter os livros, verificamos se algum deles já está nos favoritos
          this.checkFavorites();
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
  
        // Verificar se algum livro está favoritado
        this.checkFavorites();
      });
    } else {
      alert('Por favor, insira uma consulta válida.');
    }
  }
  
  // Novo método para verificar se os livros estão favoritados
  checkFavorites(): void {
    const userId = localStorage.getItem('userId');  // Presume-se que o ID do usuário esteja salvo no localStorage
    if (!userId) {
      return;
    }
  
    this.authService.getFavorites(parseInt(userId, 10)).subscribe(favorites => {
      this.books.forEach(book => {
        const bookId = book.key ? book.key.replace('/works/', '') : book.cover_i?.toString();
        if (favorites.some(fav => fav.book_id === bookId)) {
          book.isFavorited = true;  // Marca o livro como favoritado
        }
      });
    });
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
    return 'assets/images/default-cover.jpg';
  }

  addToFavorites(book: Book): void {
    const ratingInput = prompt('Dê uma avaliação (1-5):');

    if (ratingInput !== null) {
      const rating = parseInt(ratingInput, 10);

      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        const personalNote = prompt('Escreva uma nota pessoal sobre o livro:');
        const tags = prompt('Adicione algumas tags (separadas por vírgulas):');

        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert('Você precisa estar logado para favoritar um livro.');
          return;
        }

        const bookId = book.key ? book.key.replace('/works/', '') : book.cover_i?.toString();
        if (!bookId || !bookId.trim()) {  // Verificação adicional de valores em branco
          alert('ID do livro não encontrado.');
          return;
        }
        

        this.authService.addFavorite(parseInt(userId), bookId, personalNote || '', rating, tags || '', book.cover_i)
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

  toggleFavorite(book: Book): void {
    if (!book.isFavorited) {
      // Marcar como favoritado
      book.isFavorited = true;
  
      const ratingInput = prompt('Dê uma avaliação (1-5):');
  
      if (ratingInput !== null) {
        const rating = parseInt(ratingInput, 10);
  
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
          const personalNote = prompt('Escreva uma nota pessoal sobre o livro:');
          const tags = prompt('Adicione algumas tags (separadas por vírgulas):');
  
          const userId = localStorage.getItem('userId');
          if (!userId) {
            alert('Você precisa estar logado para favoritar um livro.');
            return;
          }
  
          const bookId = book.key ? book.key.replace('/works/', '') : book.cover_i?.toString();
          if (!bookId) {
            alert('ID do livro não encontrado.');
            return;
          }
  
          this.authService.addFavorite(parseInt(userId), bookId, personalNote || '', rating, tags || '', book.cover_i)
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

  // Função para limitar a descrição a 40 palavras
  truncateDescription(description: string, wordLimit: number): string {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  } 

// Propriedades para o modal
isModalOpen = false;
currentBook: Book | null = null;
rating = 1;
personalNote = '';
tags = '';

// Abre o modal ao clicar no coração
openModal(book: Book): void {
  this.isModalOpen = true;
  this.currentBook = book;
}

// Fecha o modal
closeModal(): void {
  this.isModalOpen = false;
  this.currentBook = null;
  this.rating = 1;
  this.personalNote = '';
  this.tags = '';
}

// Salva o favorito
saveFavorite(): void {
  if (this.currentBook) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Você precisa estar logado para favoritar um livro.');
      return;
    }

    const bookId = this.currentBook.key ? this.currentBook.key.replace('/works/', '') : this.currentBook.cover_i?.toString();
    if (!bookId) {
      alert('ID do livro não encontrado.');
      return;
    }

    this.authService.addFavorite(parseInt(userId), bookId, this.personalNote, this.rating, this.tags, this.currentBook.cover_i)
      .subscribe(() => {
        alert(`Livro "${this.currentBook?.title}" foi favoritado com sucesso!`);

        // Verifica se currentBook não é nulo antes de alterar a propriedade
        if (this.currentBook) {
          this.currentBook.isFavorited = true;
        }

        // Fecha o modal
        this.closeModal();
      }, () => {
        alert('Erro ao favoritar o livro.');
      });
  }
}


}
