import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmployeeAllocationSummary {
  projectName: string;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

export interface EmployeeDashboard {
  id: number;
  name: string;
  department: string;
  skills: string;
  allocationPercentage: number;
  availability: string;
  recentActivityTags: string;
  activeAllocations: EmployeeAllocationSummary[];
}

export interface ManagerDashboard {
  onBench: EmployeeDashboard[];
  active: EmployeeDashboard[];
  benchCount: number;
  partialCount: number;
}

export interface ManagerProject {
  id: number;
  name: string;
  endDate: string;
  health: string;
}

export interface MilestoneDetail {
  id: number;
  sortOrder: number;
  title: string;
  dueDate: string;
  storyPoints: number;
  status: string;
  isOverdue: boolean;
}

export interface ResourceAllocation {
  allocationId: number;
  employeeId: number;
  employeeName: string;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

export interface ManagerProjectDetail {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  health: string;
  riskFlags: string[];
  milestones: MilestoneDetail[];
  allocatedResources: ResourceAllocation[];
  totalStoryPoints: number;
  completedStoryPoints: number;
}

export interface CreateAllocationRequest {
  employeeId: number;
  projectId: number;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = `${environment.apiUrl}/api/manager`;
  private allocationsUrl = `${environment.apiUrl}/api/allocations`;
  private aiUrl = `${environment.apiUrl}/api/ai`;

  constructor(private http: HttpClient) { }

  getDashboard(managerId: number): Observable<ManagerDashboard> {
    return this.http.get<ManagerDashboard>(`${this.apiUrl}/dashboard/${managerId}`);
  }

  getProjects(managerId: number): Observable<ManagerProject[]> {
    return this.http.get<ManagerProject[]>(`${this.apiUrl}/projects/${managerId}`);
  }

  getProjectDetail(managerId: number, projectId: number): Observable<ManagerProjectDetail> {
    return this.http.get<ManagerProjectDetail>(`${this.apiUrl}/projects/${managerId}/${projectId}/detail`);
  }

  getTeamEmployees(managerId: number): Observable<EmployeeDashboard[]> {
    return this.http.get<EmployeeDashboard[]>(`${this.apiUrl}/employees/${managerId}`);
  }

  allocateEmployee(dto: CreateAllocationRequest): Observable<any> {
    return this.http.post<any>(this.allocationsUrl, dto);
  }

  endAllocation(allocationId: number): Observable<any> {
    return this.http.post<any>(`${this.allocationsUrl}/${allocationId}/end`, {});
  }

  getRiskSummary(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.aiUrl}/risk-summary/${projectId}`);
  }

  getSkillMatch(projectId: number, employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.aiUrl}/skill-match/${projectId}/${employeeId}`);
  }
}

