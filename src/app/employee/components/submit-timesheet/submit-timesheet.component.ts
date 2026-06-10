import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';
import { EmployeeService } from '../../employee.service';
import { AllocationDto, SubmitEntryDto } from '../../models/employee.models';

interface TimesheetRow {
  allocation: AllocationDto;
  hoursWorked: number;
  selectedTags: string[];
}

const ACTIVITY_TAGS = [
  'Backend API Development',
  'Microservices / Architecture',
  'Database Design & Queries',
  'WebSocket / Real-time Features',
  'Frontend Development',
  'Code Review / Mentoring',
  'Bug Fixing',
  'DevOps / Deployment',
  'Testing & QA',
  'Documentation'
];

@Component({
  selector: 'app-submit-timesheet',
  templateUrl: './submit-timesheet.component.html',
  styleUrls: ['./submit-timesheet.component.css']
})
export class SubmitTimesheetComponent implements OnInit {
  userId = 0;
  employeeId = 0;
  weekStartDate = '';
  rows: TimesheetRow[] = [];
  activityTags = ACTIVITY_TAGS;
  maxWeeklyHours = 40;
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user) { this.router.navigate(['/auth/login']); return; }
    this.userId = user.id;
    this.weekStartDate = this.getLastMonday();
    this.loadAllocations();
  }

  private getLastMonday(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split('T')[0];
  }

  loadAllocations(): void {
    this.loading = true;
    this.employeeService.getMyAllocations(this.userId).subscribe({
      next: (allocations) => {
        if (allocations.length > 0) {
          this.employeeId = allocations[0].employeeId;
        }
        this.rows = allocations.map(a => ({ allocation: a, hoursWorked: 0, selectedTags: [] }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your allocations.';
        this.loading = false;
      }
    });
  }

  get totalHours(): number {
    return this.rows.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
  }

  get totalHoursExceeded(): boolean {
    return this.totalHours > this.maxWeeklyHours;
  }

  toggleTag(row: TimesheetRow, tag: string): void {
    const idx = row.selectedTags.indexOf(tag);
    if (idx > -1) {
      row.selectedTags.splice(idx, 1);
    } else {
      row.selectedTags.push(tag);
    }
  }

  isTagSelected(row: TimesheetRow, tag: string): boolean {
    return row.selectedTags.includes(tag);
  }

  onSubmit(): void {
    this.error = '';
    if (!this.weekStartDate) { this.error = 'Please select a week start date.'; return; }
    if (this.totalHours === 0) { this.error = 'Please log at least 1 hour.'; return; }
    if (this.totalHoursExceeded) { this.error = `Total hours (${this.totalHours}) cannot exceed ${this.maxWeeklyHours}.`; return; }

    const filledRows = this.rows.filter(r => r.hoursWorked > 0);
    if (filledRows.length === 0) { this.error = 'Please enter hours for at least one project.'; return; }

    const entries: SubmitEntryDto[] = filledRows.map(r => ({
      projectId: r.allocation.projectId,
      hoursWorked: r.hoursWorked,
      activityTags: r.selectedTags.join(', ')
    }));

    this.submitting = true;
    this.employeeService.submitTimesheet(this.employeeId, { weekStartDate: this.weekStartDate, entries }).subscribe({
      next: () => {
        this.toastr.success('Timesheet submitted successfully!');
        this.router.navigate(['/employee/timesheets']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Submission failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
