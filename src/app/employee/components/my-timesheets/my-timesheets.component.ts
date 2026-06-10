import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EmployeeService } from '../../employee.service';
import { Timesheet } from '../../models/employee.models';

@Component({
  selector: 'app-my-timesheets',
  templateUrl: './my-timesheets.component.html',
  styleUrls: ['./my-timesheets.component.css']
})
export class MyTimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  expandedId: number | null = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user) { this.router.navigate(['/auth/login']); return; }

    // We need employeeId. Load allocations first to get it.
    this.employeeService.getMyAllocations(user.id).subscribe({
      next: (allocations) => {
        if (allocations.length === 0) {
          this.loading = false;
          return;
        }
        const employeeId = allocations[0].employeeId;
        this.loadTimesheets(employeeId);
      },
      error: () => {
        this.error = 'Failed to load data.';
        this.loading = false;
      }
    });
  }

  private loadTimesheets(employeeId: number): void {
    this.employeeService.getMyTimesheets(employeeId).subscribe({
      next: (ts) => { this.timesheets = ts; this.loading = false; },
      error: () => { this.error = 'Failed to load timesheets.'; this.loading = false; }
    });
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  get totalSubmitted(): number { return this.timesheets.filter(t => t.status === 'SUBMITTED').length; }
  get totalMissed(): number { return this.timesheets.filter(t => t.status === 'MISSED').length; }
  get totalHoursLogged(): number { return this.timesheets.reduce((sum, t) => sum + t.totalHours, 0); }
}
