import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isLoading = false;
  isFirstLogin = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  toggleOldPasswordVisibility(): void { this.showOldPassword = !this.showOldPassword; }
  toggleNewPasswordVisibility(): void { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPasswordVisibility(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isFirstLogin = !!user.requiresPasswordChange;

    if (!this.isFirstLogin) {
      this.changePasswordForm.get('oldPassword')?.setValidators([Validators.required]);
    }
    this.changePasswordForm.get('oldPassword')?.updateValueAndValidity();
  }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.changePasswordForm.value;
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirmation do not match.');
      return;
    }

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      oldPassword: this.changePasswordForm.value.oldPassword || '',
      newPassword: this.changePasswordForm.value.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully. Please log in with your new password.');
        this.authService.logout();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to change password.');
        this.isLoading = false;
      }
    });
  }
}
