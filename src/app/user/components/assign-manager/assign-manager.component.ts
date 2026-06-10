import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-assign-manager',
  templateUrl: './assign-manager.component.html',
  styleUrls: ['./assign-manager.component.css']
})
export class AssignManagerComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeUserId: ['', Validators.required],
      managerUserId: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const { employeeUserId, managerUserId } = this.form.value;
    this.employeeService.assignManager(+employeeUserId, +managerUserId).subscribe({
      next: () => {
        this.toastr.success('Manager assigned successfully');
        this.router.navigate(['/user/employees']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to assign manager');
        this.isLoading = false;
      }
    });
  }
}
