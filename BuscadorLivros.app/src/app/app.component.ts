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
  totalBooksFound = 0;
  username = '';
  password = '';
  activePage = 'books';

  // Propriedades para controle de busca e paginação
  query = ''; // Propriedade para armazenar a consulta do usuário
  searchBy = 'title'; // Valor padrão para o tipo de busca (título ou autor)
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas disponíveis
  pageSize = 20;  // Limite de resultados por página

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

  // Função chamada quando o usuário muda o tamanho da página
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = Number(target.value);
    this.pageSize = newPageSize;  // Atualiza o tamanho da página com o valor selecionado
    this.search(this.query, this.searchBy, 1);  // Reinicia a busca na página 1 com o novo tamanho
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

  // Função de busca com suporte à paginação
  search(query: string, searchBy: string, page = 1): void {
    // Armazena a consulta e o tipo de busca no estado do componente
    this.query = query;
    this.searchBy = searchBy;
  
    console.log('Query:', query, 'Search By:', searchBy, 'Page Size:', this.pageSize);  // Log para depuração
  
    if (query && (searchBy === 'title' || searchBy === 'author')) {
      const apiUrl = `https://openlibrary.org/search.json?${searchBy}=${query}&page=${page}&limit=${this.pageSize}`;
      this.http.get<{ docs: Book[], num_found: number }>(apiUrl)
        .subscribe((data) => {
          this.books = data.docs.map(book => ({
            ...book,
            description: book.first_sentence || book.description || 'Descrição não disponível'
          }));
          
          this.totalBooksFound = data.num_found;
          this.totalPages = Math.ceil(data.num_found / this.pageSize);  // Calcula o número total de páginas
          this.currentPage = page;
  
          // Após obter os livros, verificamos se algum deles já está nos favoritos
          this.checkFavorites();
        });
    } else if (query && searchBy === 'todo') {
      const titleRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?title=${query}&limit=${this.pageSize}`);
      const authorRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?author=${query}&limit=${this.pageSize}`);
  
      forkJoin([titleRequest, authorRequest]).subscribe(([titleData, authorData]) => {
        const combinedBooks = [...titleData.docs, ...authorData.docs];
        this.books = this.removeDuplicates(combinedBooks).map(book => ({
          ...book,
          description: book.first_sentence || book.description || 'Descrição não disponível'
        }));
  
        this.totalPages = Math.ceil(combinedBooks.length / this.pageSize);  // Calcula o número total de páginas
        this.currentPage = page;
  
        // Verificar se algum livro está favoritado
        this.checkFavorites();
      });
    } else {
      alert('Por favor, insira uma consulta válida.');
    }
  } 

  // Navegação entre páginas (anterior e próxima)
  prevPage(): void {
    if (this.currentPage > 1) {
      this.search(this.query, this.searchBy, this.currentPage - 1);
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.search(this.query, this.searchBy, this.currentPage + 1);
    }
  } 

  // Novo método para verificar se os livros estão favoritados
  checkFavorites(): void {
    const userId = localStorage.getItem('userId');
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

          if (this.currentBook) {
            this.currentBook.isFavorited = true;
          }

          this.closeModal();
        }, () => {
          alert('Erro ao favoritar o livro.');
        });
    }
  }


  
}
