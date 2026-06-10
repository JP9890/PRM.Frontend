import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employee: Employee | null = null;
  editForm: FormGroup;
  skillForm: FormGroup;
  isLoading = false;
  isSaving = false;
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      department: ['', Validators.required]
    });
    this.skillForm = this.fb.group({
      skillName: ['', Validators.required],
      category: ['Backend', Validators.required],
      proficiency: ['Intermediate', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/user/employees']);
      return;
    }
    this.employeeId = parseInt(id, 10);
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getById(this.employeeId).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.editForm.patchValue({ fullName: emp.fullName, department: emp.department });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Employee not found');
        this.router.navigate(['/user/employees']);
      }
    });
  }

  onUpdate(): void {
    if (this.editForm.invalid) return;
    this.isSaving = true;
    this.employeeService.update(this.employeeId, this.editForm.value).subscribe({
      next: () => {
        this.toastr.success('Employee updated');
        this.loadEmployee();
        this.isSaving = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Update failed');
        this.isSaving = false;
      }
    });
  }

  onDeactivate(): void {
    if (!confirm('Deactivate this employee? Active allocations will end and login will be blocked.')) return;
    this.employeeService.deactivate(this.employeeId).subscribe({
      next: () => {
        this.toastr.success('Employee deactivated');
        this.router.navigate(['/user/employees']);
      },
      error: (err) => this.toastr.error(err.error?.message || 'Deactivation failed')
    });
  }

  onAddSkill(): void {
    if (this.skillForm.invalid) return;
    this.employeeService.addSkill(this.employeeId, this.skillForm.value).subscribe({
      next: () => {
        this.toastr.success('Skill added');
        this.skillForm.reset({ category: 'Backend', proficiency: 'Intermediate' });
        this.loadEmployee();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to add skill')
    });
  }

  updateProficiency(skill: any, event: Event): void {
    const proficiency = (event.target as HTMLSelectElement).value;
    this.employeeService.updateSkillProficiency(this.employeeId, skill.id, proficiency).subscribe({
      next: () => this.toastr.success('Proficiency updated'),
      error: () => this.toastr.error('Failed to update proficiency')
    });
  }

  removeSkill(skillId: number): void {
    if (!confirm('Remove this skill?')) return;
    this.employeeService.removeSkill(this.employeeId, skillId).subscribe({
      next: () => {
        this.toastr.success('Skill removed');
        this.loadEmployee();
      },
      error: () => this.toastr.error('Failed to remove skill')
    });
  }
}
