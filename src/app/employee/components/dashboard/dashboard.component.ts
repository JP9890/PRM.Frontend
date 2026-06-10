import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EmployeeService } from '../../employee.service';
import { AllocationDto, Timesheet } from '../../models/employee.models';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employeeName = '';
  userId = 0;
  allocations: AllocationDto[] = [];
  recentTimesheets: Timesheet[] = [];
  hasMissingTimesheet = false;
  totalUtilization = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user) { this.router.navigate(['/auth/login']); return; }
    this.userId = user.id;
    this.employeeName = user.username;
    this.loadData();
  }

  private loadData(): void {
    this.employeeService.getMyAllocations(this.userId).subscribe({
      next: (allocations) => {
        this.allocations = allocations;
        this.totalUtilization = allocations.reduce((sum, a) => sum + a.utilizationPercent, 0);
        if (allocations.length > 0) {
          this.loadTimesheets(allocations[0].employeeId);
        } else {
          this.loading = false;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  private loadTimesheets(employeeId: number): void {
    this.employeeService.getMyTimesheets(employeeId).subscribe({
      next: (timesheets) => {
        this.recentTimesheets = timesheets.slice(0, 5);
        this.hasMissingTimesheet = timesheets.length > 0 && timesheets[0].status === 'MISSED';
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get allocationEmployeeId(): number {
    return this.allocations.length > 0 ? this.allocations[0].employeeId : 0;
  }
}
