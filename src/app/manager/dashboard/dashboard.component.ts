import { Component, OnInit } from '@angular/core';
import { ManagerService, ManagerDashboard, EmployeeDashboard } from '../manager.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: ManagerDashboard | null = null;
  loading = true;
  error = '';
  selectedEmployee: EmployeeDashboard | null = null;

  constructor(private managerService: ManagerService, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.managerService.getDashboard(user.id).subscribe({
        next: (data) => {
          this.dashboard = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load dashboard data.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Manager ID not found.';
      this.loading = false;
    }
  }

  viewEmployee(emp: EmployeeDashboard): void {
    this.selectedEmployee = this.selectedEmployee?.id === emp.id ? null : emp;
  }

  closeDetail(): void {
    this.selectedEmployee = null;
  }
}

