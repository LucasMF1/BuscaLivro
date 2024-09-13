import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importando o CommonModule
import { forkJoin } from 'rxjs'; // Importando forkJoin do RxJS

// Interface para definir o formato dos dados dos livros
interface Book {
  title: string;
  author_name?: string[]; // Autor pode ser opcional e uma lista de strings
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule], // Incluindo o CommonModule nos imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BuscadorLivros.app';
  
  books: Book[] = [];

  constructor(private http: HttpClient) {}

  // Função para realizar a pesquisa por título, autor ou ambos
  search(query: string, searchBy: string): void {
    if (query && (searchBy === 'title' || searchBy === 'author')) {
      // Usando const pois o valor de apiUrl não muda
      const apiUrl = `https://openlibrary.org/search.json?${searchBy}=${query}`;

      // Faz a requisição à API com base no tipo de pesquisa
      this.http.get<{ docs: Book[] }>(apiUrl)
        .subscribe((data) => {
          this.books = data.docs; // Atribui os livros retornados à variável books
        });
    } else if (query && searchBy === 'todo') {
      // Usando forkJoin para fazer as duas requisições simultaneamente
      const titleRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?title=${query}`);
      const authorRequest = this.http.get<{ docs: Book[] }>(`https://openlibrary.org/search.json?author=${query}`);

      // Combina os resultados de título e autor e remove duplicatas
      forkJoin([titleRequest, authorRequest]).subscribe(([titleData, authorData]) => {
        const combinedBooks = [...titleData.docs, ...authorData.docs];
        this.books = this.removeDuplicates(combinedBooks);
      });
    } else {
      console.error('Tipo de pesquisa inválido');
    }
  }

  // Função para remover livros duplicados
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
}