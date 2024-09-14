import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserResponse {
  userId: number;
}

interface FavoriteResponse {
  favoriteId: number;
}

interface Favorite {
  id: number;
  book_id: string;
  note: string;
  rating: number;
  tags: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://localhost:3000/register', { username, password });
  }
  
  login(username: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://localhost:3000/login', { username, password });
  }
  
  addFavorite(userId: number, bookId: string, note: string, rating: number, tags: string): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>('http://localhost:3000/favorites', { user_id: userId, book_id: bookId, note, rating, tags });
  }
  
  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`http://localhost:3000/favorites/${userId}`);
  }
  
}
