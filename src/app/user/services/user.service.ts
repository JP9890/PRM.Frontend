import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto, CreateUserDto, UpdateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, user);
  }

  updateUser(id: number, user: UpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${id}`, user);
  }

  deactivateUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/deactivate`, {});
  }

  reactivateUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reactivate`, {});
  }

  resetPassword(id: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reset-password`, { newPassword });
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/roles`);
  }

  getManagers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }
}
