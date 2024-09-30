import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model'; // Adjust import based on your structure
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <label for="email">Email:</label>
        <input id="email" formControlName="email" type="email" required />

        <label for="password">Password:</label>
        <input id="password" formControlName="password" type="password" required />

        <label for="role">Role:</label>
        <select id="role" formControlName="role" required>
          <option value="admin">Admin</option>
          <option value="receptionist">Receptionist</option>
        </select>

        <button type="submit" [disabled]="registerForm.invalid">Register</button>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
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
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
        // Handle successful registration (e.g., redirect to login or dashboard)
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }
  }
}
