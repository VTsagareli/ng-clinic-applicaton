import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <label for="email">Email</label>
          <input id="email" formControlName="email" type="email" />

          <label for="password">Password</label>
          <input id="password" formControlName="password" type="password" />

          <button type="submit" [disabled]="loginForm.invalid">Login</button>
          <button type="button" class="secondary-button" (click)="navigateToRegister()">Register</button>
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      height: 100vh; /* Full viewport height */
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      box-sizing: border-box;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.3rem;
      font-weight: bold;
    }

    input {
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 0.75rem;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #aaa;
    }

    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }

    .success-message {
      color: green;
      margin-top: 1rem;
      text-align: center;
    }

    .secondary-button {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .secondary-button:hover {
    background-color: #d5d5d5;
  }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.signIn(email, password);
        this.errorMessage = null;
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/appointments']), 2000);
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
  
}
