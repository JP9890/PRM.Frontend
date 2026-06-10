import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;
  isSaving = false;
  userId!: number;
  availableRoles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => this.availableRoles = roles,
      error: () => this.toastr.error('Failed to load roles')
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = parseInt(idParam, 10);
      this.loadUser();
    } else {
      this.router.navigate(['/user/users']);
    }
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.editForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          roleId: user.roleId,
          isActive: user.isActive
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load user');
        this.router.navigate(['/user/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;
    this.isSaving = true;
    const formValue = { ...this.editForm.value, roleId: parseInt(this.editForm.value.roleId, 10) };

    this.userService.updateUser(this.userId, formValue).subscribe({
      next: () => {
        this.toastr.success('User updated');
        this.router.navigate(['/user/users']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update');
        this.isSaving = false;
      }
    });
  }
}
