import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SliceContentPipe } from '../../slice-content.pipe';
import { CapitalizePipe } from '../../captilize-content.pipe';
import { environment } from '../../environments/environment';  // Import environment

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule, SliceContentPipe, CapitalizePipe],
  providers: [AuthService]
})
export class HomeComponent implements OnInit {
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  featuredPosts: any[] = [];
  latestPosts: any[] = [];
  searchQuery: string = '';
  userReactions: { [key: number]: string } = {};  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    const apiUrl = `${environment.apiBaseUrl}/blogs`;  // Use the apiBaseUrl from environment
    this.http.get<any[]>(apiUrl).subscribe((blogs) => {
      this.blogs = blogs;
      this.featuredPosts = this.getFeaturedPosts(blogs);
      this.latestPosts = this.getLatestPosts(blogs);
      this.filteredBlogs = blogs;
    });
  }

  getFeaturedPosts(blogs: any[]): any[] {
    return blogs.filter((blog) => blog.featured);
  }

  getLatestPosts(blogs: any[]): any[] {
    return blogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  searchBlogs(): void {
    if (this.searchQuery) {
      this.filteredBlogs = this.blogs.filter((blog) =>
        this.isMatch(blog, this.searchQuery)
      );
    } else {
      this.filteredBlogs = this.blogs;
    }
    console.log(this.filteredBlogs);  
  }

  isMatch(blog: any, query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return (
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.category?.toLowerCase().includes(lowerQuery)
    );
  }

  handleReaction(post: any, reactionType: string): void {
    if (!post.likes) post.likes = 0;
    if (!post.unlike) post.unlike = 0;
    if (!post.love) post.love = 0;
    if (!post.sad) post.sad = 0;
    if (!post.haha) post.haha = 0;
    if (!post.informative) post.informative = 0;

    if (this.userReactions[post.id]) {
      if (this.userReactions[post.id] !== reactionType) {
        this.removeReaction(post, this.userReactions[post.id]);
        this.addReaction(post, reactionType);
      } else {
        alert('You have already reacted with this reaction.');
      }
    } else {
      this.addReaction(post, reactionType);
    }

    this.updateBlog(post);
  }

  addReaction(post: any, reactionType: string): void {
    if (reactionType === 'like') {
      post.likes += 1;
    } else if (reactionType === 'unlike') {
      post.unlike += 1;
    } else if (reactionType === 'love') {
      post.love += 1;
    } else if (reactionType === 'sad') {
      post.sad += 1;
    } else if (reactionType === 'haha') {
      post.haha += 1;
    } else if (reactionType === 'informative') {
      post.informative += 1;
    }

    this.userReactions[post.id] = reactionType;
  }

  removeReaction(post: any, reactionType: string): void {
    if (reactionType === 'like') {
      post.likes -= 1;
    } else if (reactionType === 'unlike') {
      post.unlike -= 1;
    } else if (reactionType === 'love') {
      post.love -= 1;
    } else if (reactionType === 'sad') {
      post.sad -= 1;
    } else if (reactionType === 'haha') {
      post.haha -= 1;
    } else if (reactionType === 'informative') {
      post.informative -= 1;
    }
  }

  updateBlog(post: any): void {
    const apiUrl = `${environment.apiBaseUrl}/blogs/${post.id}`;  // Use the apiBaseUrl from environment
    this.http.put(apiUrl, post).subscribe({
      next: () => console.log(`Blog ${post.id} updated successfully.`),
      error: (err) => console.error('Error updating blog:', err)
    });
  }
}
