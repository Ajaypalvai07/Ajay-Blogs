import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, HttpClientModule, RouterModule,ReactiveFormsModule],
  providers: [AuthService],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    console.log('Login button clicked');
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((users: any) => {
        if (users.length > 0) {
          localStorage.setItem('user', JSON.stringify(users[0])); 
          alert('Login successful!');
          this.router.navigate(['/']); 
        } else {
          this.loginError = 'Invalid email or password.';
        }
      });
    }
    
  }
  onSignUp(): void {
    this.router.navigate(['/signup']);
  }
}

