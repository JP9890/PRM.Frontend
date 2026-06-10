import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllocationDto, Timesheet, SubmitTimesheetDto } from './models/employee.models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyAllocations(userId: number): Observable<AllocationDto[]> {
    return this.http.get<AllocationDto[]>(`${this.baseUrl}/api/allocations/employee/${userId}`);
  }

  getMyTimesheets(employeeId: number): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.baseUrl}/api/timesheets/my/${employeeId}`);
  }

  submitTimesheet(employeeId: number, dto: SubmitTimesheetDto): Observable<Timesheet> {
    return this.http.post<Timesheet>(`${this.baseUrl}/api/timesheets/${employeeId}`, dto);
  }
}
