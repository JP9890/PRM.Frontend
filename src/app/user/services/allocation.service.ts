import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Allocation {
  id: number;
  employeeName: string;
  projectName: string;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  private apiUrl = `${environment.apiUrl}/api/allocations`;

  constructor(private http: HttpClient) {}

  getAll(employeeId?: number, projectId?: number): Observable<Allocation[]> {
    let params = new HttpParams();
    if (employeeId) params = params.set('employeeId', employeeId.toString());
    if (projectId) params = params.set('projectId', projectId.toString());
    return this.http.get<Allocation[]>(this.apiUrl, { params });
  }
}
