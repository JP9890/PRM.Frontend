import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeSummary } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeSummary[] = [];
  isLoading = false;
  filterStatus = '';
  filterDepartment = '';

  constructor(private employeeService: EmployeeService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  get allocatedCount(): number {
    return this.employees.filter(e => e.status === 'ALLOCATED').length;
  }

  get benchCount(): number {
    return this.employees.filter(e => e.status === 'BENCH').length;
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAll(this.filterStatus || undefined, this.filterDepartment || undefined).subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load employees');
        this.isLoading = false;
      }
    });
  }
}
