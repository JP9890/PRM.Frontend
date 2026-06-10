import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  createForm: FormGroup;
  isLoading = false;
  availableRoles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => this.availableRoles = roles,
      error: () => this.toastr.error('Failed to load roles')
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = { ...this.createForm.value, roleId: parseInt(this.createForm.value.roleId, 10) };

    this.userService.createUser(formValue).subscribe({
      next: () => {
        this.toastr.success('Account created. User must change password on first login.');
        this.router.navigate(['/user/users']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to create user');
        this.isLoading = false;
      }
    });
  }
}
