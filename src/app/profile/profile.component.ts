import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  updatedUser: any = {};
  profileSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : null;
    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      this.updatedUser = { ...this.user };
    }
  }

  updateProfile(): void {
    if (!this.updatedUser) return;
    
    this.profileSubscription = this.http
      .put(`${environment.apiBaseUrl}/users/${this.user.id}`, this.updatedUser)
      .subscribe({
        next: () => {
          localStorage.setItem('user', JSON.stringify(this.updatedUser));
          alert('Profile updated successfully');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Error updating profile');
        },
      });
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}
