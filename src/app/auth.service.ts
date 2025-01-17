import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl; // Use the apiBaseUrl from the environment

  constructor(private http: HttpClient) {}

  // Signup method to create a new user
  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user).pipe(
      catchError((error) => {
        console.error('Signup failed', error);
        return of({ error: 'Signup failed. Please try again later.' }); // Provide a meaningful error message
      })
    );
  }

  // Login method that validates user credentials
  login(credentials: any): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users`, {
        params: { email: credentials.email, password: credentials.password },
      })
      .pipe(
        catchError((error) => {
          console.error('Login failed', error);
          return of({ error: 'Login failed. Please check your credentials.' }); // Provide a meaningful error message
        })
      );
  }

  // Set the login status and store user in localStorage
  setLoginStatus(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Check if user is logged in by checking localStorage
  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null; // Simplified check
  }

  // Logout the user by removing user data from localStorage
  logout(): void {
    localStorage.removeItem('user');
  }

  // Get the user from localStorage
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
