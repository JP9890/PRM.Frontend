import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, EmployeeSummary } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/api/employees`;

  constructor(private http: HttpClient) {}

  getAll(status?: string, department?: string): Observable<EmployeeSummary[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (department) params = params.set('department', department);
    return this.http.get<EmployeeSummary[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(data: { fullName: string; department: string; userId?: number }): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, data);
  }

  update(id: number, data: { fullName: string; department: string }): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, data);
  }

  deactivate(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/deactivate`, {});
  }

  assignManager(employeeUserId: number, managerUserId: number): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/assign-manager`, { employeeUserId, managerUserId });
  }

  addSkill(employeeId: number, data: { skillName: string; category: string; proficiency: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/skills`, data);
  }

  updateSkillProficiency(employeeId: number, skillId: number, proficiency: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employeeId}/skills/${skillId}`, { proficiency });
  }

  removeSkill(employeeId: number, skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}/skills/${skillId}`);
  }
}
