import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
})
export class EditPostComponent implements OnInit {
  post: any = {};
  hasUnsavedChanges = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.fetchPost(postId);
  }

  trackChanges(): void {
    this.hasUnsavedChanges = true;
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  fetchPost(postId: string | null) {
    if (postId) {
      this.http.get<any>(`${environment.apiBaseUrl}/blogs/${postId}`).subscribe((data) => {
        this.post = data;
      });
    }
  }

  updatePost() {
    this.http.put(`${environment.apiBaseUrl}/blogs/${this.post.id}`, this.post).subscribe(() => {
      alert('Post updated successfully');
      this.hasUnsavedChanges = false; // Reset the flag
      this.router.navigate(['/home']);
    });
  }
}
