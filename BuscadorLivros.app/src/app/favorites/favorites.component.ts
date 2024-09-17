import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

interface Favorite {
  id: number;
  book_id: string;
  note: string;
  rating: number;
  tags: string;
  cover_i?: number;
  title?: string;
  author_name?: string[];
  isEditing?: boolean;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  filteredFavorites: Favorite[] = [];
  username = '';
  filterTag = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Você precisa estar logado para acessar seus favoritos.');
      this.router.navigate(['/login']);
      return;
    }

    this.username = localStorage.getItem('username') || '';

    this.authService.getFavorites(parseInt(userId, 10))
      .pipe(
        mergeMap((favorites) => from(favorites)),
        mergeMap((favorite) => this.fetchBookDetails(favorite)),
        toArray()
      )
      .subscribe({
        next: (favorites) => {
          this.favorites = favorites;
          this.filteredFavorites = favorites;
        },
        error: () => { 
          alert('Erro ao carregar seus favoritos. Por favor, tente novamente.');
        }
      });
  }

  // Função para buscar os detalhes do livro (título, capa e autores) usando o book_id na API Open Library
  fetchBookDetails(favorite: Favorite) {
    const apiUrl = `https://openlibrary.org/works/${favorite.book_id}.json`;
    return this.http.get<{ title: string; covers?: number[], authors?: { name: string }[] }>(apiUrl).pipe(
      map((data) => ({
        ...favorite,
        title: data.title,
        cover_i: data.covers && data.covers.length > 0 ? data.covers[0] : undefined,
        author_name: data.authors ? data.authors.map(author => author.name) : [] // Adicionando autores
      }))
    );
  }

  // Função para obter a URL da capa do livro
  getBookCoverUrl(cover_i?: number): string {
    if (cover_i) {
      return `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
    }
    return 'assets/images/default-cover.jpg';
  }

  // Função para ativar o modo de edição para um favorito
  editFavorite(favorite: Favorite) {
    favorite.isEditing = true; 
  }

  // Função para salvar as alterações feitas no favorito
  saveFavorite(favorite: Favorite) {
    this.authService.updateFavorite(favorite.id, favorite.note, favorite.rating, favorite.tags)
      .subscribe({
        next: () => {
          favorite.isEditing = false; 
          alert('Favorito atualizado com sucesso!');
        },
        error: () => {
          alert('Erro ao atualizar o favorito. Por favor, tente novamente.');
        }
      });
  }

  // Função para cancelar a edição
  cancelEdit(favorite: Favorite) {
    favorite.isEditing = false; 
  }

  // Função para filtrar os favoritos por tag
  filterFavoritesByTag(): void {
    if (this.filterTag.trim()) {
      this.filteredFavorites = this.favorites.filter(favorite => 
        favorite.tags.toLowerCase().includes(this.filterTag.toLowerCase())
      );
    } else {
      this.filteredFavorites = this.favorites; 
    }
  }

  // Função para limpar o campo de tag e atualizar os favoritos
  clearFilter(): void {
    this.filterTag = '';
    this.filterFavoritesByTag(); // Chama a função de filtragem para atualizar a lista
  }
  
}

