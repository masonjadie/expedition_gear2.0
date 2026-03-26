import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  loginRole: 'user' | 'admin' = 'user';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  setRole(role: 'user' | 'admin') {
    this.loginRole = role;
    this.errorMessage = '';
    if (role === 'admin') {
      this.loginForm.patchValue({ email: 'admin@trailpeak.com', password: 'admin123' });
    } else {
      this.loginForm.reset();
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      const success = await this.authService.login(email, password);
      this.isLoading = false;
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
    }
  }
}
