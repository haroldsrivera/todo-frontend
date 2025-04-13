import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private loginUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
