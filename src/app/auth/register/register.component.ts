import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <label for="email">Email</label>
          <input id="email" formControlName="email" type="email" />

          <label for="password">Password</label>
          <input id="password" formControlName="password" type="password" />

          <label for="role">Role</label>
          <select id="role" formControlName="role">
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <button type="submit" [disabled]="registerForm.invalid">Register</button>
          <button type="button" class="secondary-button" (click)="navigateToLogin()">Back to Login</button>

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
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
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

    input, select {
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
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, role } = this.registerForm.value;
      try {
        await this.authService.signUp(email, password);
        this.errorMessage = null;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } catch (err) {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
}
