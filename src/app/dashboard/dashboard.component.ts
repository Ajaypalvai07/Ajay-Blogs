import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SliceContentPipe } from '../../slice-content.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule,SliceContentPipe], 
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
    this.http.get<any[]>(`http://localhost:3000/blogs?author=${this.currentUser.email}`).subscribe((blogs) => {
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
    this.http.post('http://localhost:3000/blogs', blog).subscribe(() => {
      this.fetchUserBlogs();
      this.resetForm();
    });
  }

  updateBlog() {
    this.http
      .put(`http://localhost:3000/blogs/${this.editingBlogId}`, this.newBlog)
      .subscribe(() => {
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
    this.http.delete(`http://localhost:3000/blogs/${blogId}`).subscribe(() => {
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
