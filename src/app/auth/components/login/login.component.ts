import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const roles = this.authService.getCurrentUserRoles();
      if (roles.includes('Admin')) {
        this.router.navigate(['/user']);
      } else if (roles.includes('Manager')) {
        this.router.navigate(['/manager/dashboard']);
      } else if (roles.includes('Employee')) {
        this.router.navigate(['/employee/dashboard']);
      } else {
        this.authService.logout();
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Please enter your username and password.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.requiresPasswordChange) {
          this.router.navigate(['/auth/change-password']);
        } else {
          this.toastr.success('Logged in successfully!');
          const roles = response.roles || [];
          if (roles.includes('Admin')) {
            this.router.navigate(['/user']);
          } else if (roles.includes('Manager')) {
            this.router.navigate(['/manager/dashboard']);
          } else if (roles.includes('Employee')) {
            this.router.navigate(['/employee/dashboard']);
          } else {
            this.toastr.warning('Unknown role. Please contact admin.');
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Login failed. Invalid credentials.';
        this.toastr.error(msg, 'Error');
      }
    });
  }
}
