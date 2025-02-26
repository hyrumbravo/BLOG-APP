import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink], // ✅ Import ReactiveFormsModule
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required,]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful! Redirecting to login...');
          this.router.navigateByUrl('/login'); // ✅ Redirect to login page
        },
        error: (err) => {
          if (err.error.message === "Username already exists") {
            alert("Username is already taken! Please choose another one.");
          } else {
            alert("Error: " + err.message);
          }
        }
      });
    }
  }
  
  
}
