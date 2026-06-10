import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EmployeeService } from '../../employee.service';
import { AllocationDto } from '../../models/employee.models';

@Component({
  selector: 'app-my-allocations',
  templateUrl: './my-allocations.component.html',
  styleUrls: ['./my-allocations.component.css']
})
export class MyAllocationsComponent implements OnInit {
  allocations: AllocationDto[] = [];
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

    this.employeeService.getMyAllocations(user.id).subscribe({
      next: (allocations) => { this.allocations = allocations; this.loading = false; },
      error: () => { this.error = 'Failed to load allocations.'; this.loading = false; }
    });
  }

  get totalUtilization(): number {
    return this.allocations.reduce((sum, a) => sum + a.utilizationPercent, 0);
  }

  isActive(a: AllocationDto): boolean {
    const today = new Date();
    const toDate = this.parseDate(a.toDate);
    return toDate >= today;
  }

  private parseDate(dateStr: string): Date {
    // Handle dd-MM-yyyy or yyyy-MM-dd
    if (dateStr.includes('-') && dateStr.length === 10) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) return new Date(dateStr);
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
  }
}
