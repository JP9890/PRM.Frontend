import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  isLoading = false;
  showResetModal = false;
  selectedUser: UserDto | null = null;
  newPassword = '';

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get activeCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  get inactiveCount(): number {
    return this.users.filter(u => !u.isActive).length;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load users');
        this.isLoading = false;
      }
    });
  }

  deactivateUser(user: UserDto): void {
    if (!confirm(`Deactivate ${user.fullName}? They will not be able to log in.`)) return;
    this.userService.deactivateUser(user.id).subscribe({
      next: () => {
        this.toastr.success('User deactivated');
        this.loadUsers();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to deactivate user')
    });
  }

  reactivateUser(user: UserDto): void {
    if (!confirm(`Reactivate ${user.fullName}?`)) return;
    this.userService.reactivateUser(user.id).subscribe({
      next: () => {
        this.toastr.success('User reactivated');
        this.loadUsers();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to reactivate user')
    });
  }

  openResetPassword(user: UserDto): void {
    this.selectedUser = user;
    this.newPassword = '';
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
    this.selectedUser = null;
  }

  confirmResetPassword(): void {
    if (!this.selectedUser || !this.newPassword) return;
    this.userService.resetPassword(this.selectedUser.id, this.newPassword).subscribe({
      next: () => {
        this.toastr.success('Password reset. User must change it on next login.');
        this.closeResetModal();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to reset password')
    });
  }
}
