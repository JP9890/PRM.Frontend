import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, data);
  }

  addMilestone(projectId: number, data: { title: string; dueDate: string; storyPoints: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/milestones`, data);
  }

  updateMilestoneStatus(projectId: number, milestoneId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}/milestones/${milestoneId}/status`, { status });
  }
}
