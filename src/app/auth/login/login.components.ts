import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { User } from '../../core/models/user.model'; // Adjust import based on your structure
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label for="email">Email:</label>
        <input id="email" formControlName="email" type="email" required />

        <label for="password">Password:</label>
        <input id="password" formControlName="password" type="password" required />

        <button type="submit" [disabled]="loginForm.invalid">Login</button>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div> <!-- Success message -->
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: auto;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .error-message {
      color: red;
    }
    .success-message {
      color: green; /* Style for success message */
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Success message variable

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        // Attempt to log in the user
        await this.authService.signIn(email, password); // Use the correct login method
        this.errorMessage = null; // Clear any previous error messages
        this.successMessage = 'Login successful! Redirecting...'; // Set success message
        
        // Redirect to appointments after a brief delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/appointments']); // Redirect to appointments page
        }, 2000); // Adjust the delay time as needed
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.'; // Set an error message
        console.error('Login error:', error); // Log error for debugging
      }
    }
  }
}
