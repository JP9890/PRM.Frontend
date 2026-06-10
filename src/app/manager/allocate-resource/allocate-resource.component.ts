import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import {
  ManagerService,
  ManagerProject,
  EmployeeDashboard,
  ResourceAllocation
} from '../manager.service';

type AllocateStep = 'selectProject' | 'selectEmployee' | 'confirm';

@Component({
  selector: 'app-allocate-resource',
  templateUrl: './allocate-resource.component.html',
  styleUrls: ['./allocate-resource.component.css']
})
export class AllocateResourceComponent implements OnInit {
  managerId!: number;
  step: AllocateStep = 'selectProject';

  projects: ManagerProject[] = [];
  employees: EmployeeDashboard[] = [];
  activeAllocations: ResourceAllocation[] = [];

  selectedProject: ManagerProject | null = null;
  selectedEmployee: EmployeeDashboard | null = null;

  allocationForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private managerService: ManagerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.allocationForm = this.fb.group({
      utilizationPercent: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user?.id) {
      this.managerId = user.id;
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.isLoading = true;
    this.managerService.getProjects(this.managerId).subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load projects.';
        this.isLoading = false;
      }
    });
  }

  selectProject(project: ManagerProject): void {
    this.selectedProject = project;
    this.loadTeamEmployeesAndAllocations();
  }

  loadTeamEmployeesAndAllocations(): void {
    if (!this.selectedProject) return;
    this.isLoading = true;
    this.managerService.getTeamEmployees(this.managerId).subscribe({
      next: (emps) => {
        this.employees = emps;
        // Load current allocations for the selected project
        this.managerService.getProjectDetail(this.managerId, this.selectedProject!.id).subscribe({
          next: (detail) => {
            this.activeAllocations = detail.allocatedResources;
            this.step = 'selectEmployee';
            this.isLoading = false;
          },
          error: () => {
            this.activeAllocations = [];
            this.step = 'selectEmployee';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load team employees.';
        this.isLoading = false;
      }
    });
  }

  selectEmployee(employee: EmployeeDashboard): void {
    this.selectedEmployee = employee;
    this.step = 'confirm';
  }

  submitAllocation(): void {
    if (this.allocationForm.invalid || !this.selectedProject || !this.selectedEmployee) return;

    const { utilizationPercent, fromDate, toDate } = this.allocationForm.value;
    this.isLoading = true;

    this.managerService.allocateEmployee({
      employeeId: this.selectedEmployee.id,
      projectId: this.selectedProject.id,
      utilizationPercent,
      fromDate,
      toDate
    }).subscribe({
      next: () => {
        this.toastr.success(
          `${this.selectedEmployee!.name} allocated to ${this.selectedProject!.name} at ${utilizationPercent}%`
        );
        this.resetFlow();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Allocation failed.');
        this.isLoading = false;
      }
    });
  }

  endAllocation(allocation: ResourceAllocation): void {
    if (!confirm(`End ${allocation.employeeName}'s allocation on this project?`)) return;
    this.managerService.endAllocation(allocation.allocationId).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Allocation ended.');
        this.loadTeamEmployeesAndAllocations();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to end allocation.')
    });
  }

  resetFlow(): void {
    this.step = 'selectProject';
    this.selectedProject = null;
    this.selectedEmployee = null;
    this.activeAllocations = [];
    this.allocationForm.reset({ utilizationPercent: 50 });
    this.isLoading = false;
    this.loadProjects();
  }

  goBack(): void {
    if (this.step === 'confirm') {
      this.step = 'selectEmployee';
      this.selectedEmployee = null;
    } else if (this.step === 'selectEmployee') {
      this.step = 'selectProject';
      this.selectedProject = null;
    }
  }

  get freeCapacity(): number {
    return this.selectedEmployee ? 100 - this.selectedEmployee.allocationPercentage : 100;
  }
}
