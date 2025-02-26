import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class BlogPostComponent {
  blogForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  goBack() {
    this.router.navigate(['/view-all-post']);
  }

  onSubmit() {
    if (this.blogForm.valid) {
      const postData = {
        ...this.blogForm.value,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }) // Manila time
      };

      this.authService.createPost(postData).subscribe({
        next: () => {
          alert('Post submitted successfully!');
          this.blogForm.reset(); // ✅ Clears the form fields
          this.router.navigate(['/view-all-post']); // ✅ Redirects to /admin
        },
        error: (err) => alert('Error: ' + err.message),
      });
    }
  }
}
