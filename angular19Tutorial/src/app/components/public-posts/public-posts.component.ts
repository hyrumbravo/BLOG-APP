import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgFor, NgIf } from '@angular/common';


interface Post {
  _id: string;
  title: string;
  content: string;
  timestamp: string;
  fullname:string;
}

@Component({
  selector: 'app-public-posts',
  templateUrl: './public-posts.component.html',
  styleUrl: './public-posts.component.css',
  imports: [NgFor, NgIf]
})
export class PublicPostsComponent implements OnInit {
  posts: Post[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchPublicPosts();
  }

  fetchPublicPosts() {
    this.authService.getAllPosts().subscribe({
      next: (data: any) => {
        if (data.rows) {
          this.posts = data.rows.map((row: any) => ({
            _id: row.id,
            title: row.doc.title,
            content: row.doc.content,
            timestamp: row.doc.timestamp,
            fullname:row.doc.fullname
          })).sort((a: Post, b: Post) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        }
      },
      error: (err) => {
        console.error('Error fetching public posts:', err);
      }
    });
  }
}
