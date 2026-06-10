import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TimesheetEntry {
  id?: number;
  projectId: number;
  projectName?: string;
  hoursWorked: number;
  activityTags?: string;
}

export interface Timesheet {
  id: number;
  employeeId: number;
  employeeName: string;
  weekStartDate: string;
  status: string;
  totalHours: number;
  entries: TimesheetEntry[];
}

export interface SubmitTimesheetDto {
  weekStartDate: string;
  entries: TimesheetEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = `${environment.apiUrl}/api/timesheets`;

  constructor(private http: HttpClient) { }

  submitTimesheet(employeeId: number, dto: SubmitTimesheetDto): Observable<Timesheet> {
    return this.http.post<Timesheet>(`${this.apiUrl}/${employeeId}`, dto);
  }

  getMyTimesheets(employeeId: number): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.apiUrl}/my/${employeeId}`);
  }

  getTeamTimesheets(managerId: number, weekStart: string): Observable<Timesheet[]> {
    let params = new HttpParams().set('weekStart', weekStart);
    return this.http.get<Timesheet[]>(`${this.apiUrl}/team/${managerId}`, { params });
  }
}
