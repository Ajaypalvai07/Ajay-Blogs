import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SliceContentPipe } from '../../slice-content.pipe';
import { environment } from '../../environments/environment'; // Import the environment config

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule, SliceContentPipe],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit {
  userBlogs: any[] = [];
  currentUser: any;

  newBlog = {
    title: '',
    content: '',
    category: '',
    featured: false,
    private: false,
    image: '',
    date: new Date(),
    likes: 0,
    author: '',
    comments: [],
  };

  selectedImage: string | ArrayBuffer | null = null;

  isEditing: boolean = false;
  editingBlogId: number | null = null;

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
  }

  ngOnInit(): void {
    alert(
      'Please post only meaningful and appropriate content. Let\'s maintain a respectful and constructive environment.'
    );
    
    this.fetchUserBlogs();
  }

  fetchUserBlogs() {
    // Using the environment apiUrl for development or production
    this.http.get<any[]>(`${environment.apiBaseUrl}/blogs?author=${this.currentUser.email}`).subscribe((blogs) => {
      // Filter blogs based on the 'private' status
      this.userBlogs = blogs.filter(blog => !blog.private || blog.author === this.currentUser.email);
    });
  }

  saveBlog() {
    if (this.isEditing) {
      this.updateBlog();
    } else {
      this.createBlog();
    }
  }

  createBlog() {
    const blog = { ...this.newBlog, author: this.currentUser.email };
    // Using environment.apiUrl to create blog
    this.http.post(`${environment.apiBaseUrl}/blogs`, blog).subscribe(() => {
      this.fetchUserBlogs();
      this.resetForm();
    });
  }

  updateBlog() {
    // Using environment.apiUrl to update blog
    this.http.put(`${environment.apiBaseUrl}/blogs/${this.editingBlogId}`, this.newBlog).subscribe(() => {
      this.fetchUserBlogs();
      this.resetForm();
    });
  }

  editBlog(blog: any) {
    this.isEditing = true;
    this.editingBlogId = blog.id;
    this.newBlog = { ...blog };
    this.selectedImage = blog.image || null;
  }

  deleteBlog(blogId: number) {
    // Using environment.apiUrl to delete blog
    this.http.delete(`${environment.apiBaseUrl}/blogs/${blogId}`).subscribe(() => {
      this.fetchUserBlogs();
    });
  }

  resetForm() {
    this.isEditing = false;
    this.editingBlogId = null;
    this.selectedImage = null;
    this.newBlog = {
      title: '',
      content: '',
      category: '',
      featured: false,
      private: false,
      image: '',
      date: new Date(),
      likes: 0,
      author: '',
      comments: [],
    };
  }

  onImageUrlInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.value;
    this.newBlog.image = input.value;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        this.newBlog.image = file.name;
      };
      reader.readAsDataURL(file);
    }
  }
}
