import { Component, OnInit, OnChanges, SimpleChanges, Input, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from '../../highlight.directive';
import { CapitalizePipe } from '../../captilize-content.pipe';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule,HighlightDirective,CapitalizePipe],
  providers: [AuthService],
})
export class BlogDetailsComponent implements OnInit, OnChanges, DoCheck {
  @Input() blogId: string | null = null; 
  blog: any;
  comments: any[] = [];
  newComment: string = '';
  reactions: any = {
    like: 0,
    love: 0,
    sad: 0,
    haha: 0,
    informative: 0,
  };
  currentReaction: string | null = null; // To track the current reaction
  currentUser: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
  }

  ngOnInit(): void {
    if (!this.blogId) {
      this.blogId = this.route.snapshot.paramMap.get('id');
    }
    this.fetchBlogDetails(this.blogId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blogId'] && !changes['blogId'].isFirstChange()) {
      this.fetchBlogDetails(changes['blogId'].currentValue);
    }
  }

  ngDoCheck(): void {
   
    console.log('ngDoCheck: Change detection run');
    
    
    if (this.blog && this.comments.length !== this.blog.comments.length) {
      console.log('Comments array has changed');
    }
  }

  fetchBlogDetails(blogId: string | null) {
    if (blogId) {
      this.http.get<any>(`${environment.apiBaseUrl}/blogs/${blogId}`).subscribe((data) => {
        this.blog = data;
        this.comments = data.comments || [];
        this.reactions = data.reactions || this.reactions;
        this.currentReaction = data.userReaction || null;
      });
    }
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment = {
        user: this.currentUser?.email || 'Anonymous',
        content: this.newComment.trim(),
        date: new Date(),
      };
      this.comments.push(comment);
      this.blog.comments = this.comments;

      this.http.put(`${environment.apiBaseUrl}/blogs/${this.blog.id}`, { comments: this.comments }).subscribe(() => {
        this.newComment = '';
      });
    }
  }

  handleReaction(reaction: string): void {
    // If the user has already reacted, update the reaction
    if (this.currentReaction) {
      this.reactions[this.currentReaction] -= 1; // Remove the previous reaction count
    }

    // Add the new reaction
    this.reactions[reaction] += 1;

    // Update the current reaction to the new one
    this.currentReaction = reaction;

    this.updateReactions();
  }

  updateReactions() {
    this.http.put(`${environment.apiBaseUrl}/blogs/${this.blog.id}`, {
      reactions: this.reactions,
      userReaction: this.currentReaction,
    }).subscribe();
  }
}