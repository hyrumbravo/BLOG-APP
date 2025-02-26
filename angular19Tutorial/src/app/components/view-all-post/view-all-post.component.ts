import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgFor, NgIf, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Post {
  _id: string;  // CouchDB document ID
  _rev: string; // CouchDB revision
  title: string;
  content: string;
  timestamp: string; 
  fullname: string;
  isEditing?: boolean; // Property to track editing state
}

@Component({
  selector: 'app-view-all-post',
  templateUrl: './view-all-post.component.html',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  styleUrl: './view-all-post.component.css'
})
export class ViewAllPostComponent implements OnInit {
  posts: Post[] = [];
  fullname: string = ''; // Store the logged-in user's fullname


  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchPosts();
    this.fullname = localStorage.getItem('fullname') || 'Guest';
  }
  
  fetchPosts() {
    this.authService.getPosts().subscribe({
      next: (data: any) => {
        console.log('Fetched Posts:', data.posts); // Debugging ✅
        
        if (data.posts) {
          this.posts = data.posts
            .map((post: any) => ({
              _id: post._id,
              _rev: post._rev,  // ✅ Ensure _rev is included in the UI
              title: post.title,
              content: post.content,
              timestamp: post.timestamp,
              fullname: post.fullname,
              isEditing: false,
            }))
            .sort((a: Post, b: Post) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        }
      },
      error: (err) => {
        console.error("Error fetching posts:", err);
      }
    });
  }
  
  
  

  enterEditMode(post: Post) {
    post.isEditing = true;  // Enable edit mode
  }

  savePost(post: Post) {
    this.authService.updatePost(post).subscribe({
      next: (updatedPost) => {
        alert('Post updated successfully!');
  
        // ✅ Ensure we update the _rev with the new one returned by CouchDB
        post._rev = updatedPost.rev;
        post.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating post:', err);
        alert('Failed to update post. Please try again.');
      }
    });
  }


  

  deletePost(post: Post) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      this.authService.deletePost(post._id, post._rev).subscribe({
        next: () => {
          alert('Post deleted successfully!');
          this.fetchPosts(); // Refresh posts
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete post.');
        }
      });
    }
  }
}

