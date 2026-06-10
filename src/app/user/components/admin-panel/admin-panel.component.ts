import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  menuItems = [
    { title: 'Manage Employees', description: 'View, update, deactivate employees and manage skills', route: '/user/employees', icon: '👥' },
    { title: 'Manage Projects', description: 'Create and update projects and milestones', route: '/user/projects', icon: '📁' },
    { title: 'View Allocations', description: 'Company-wide allocation matrix', route: '/user/allocations', icon: '📊' },
    { title: 'Manage Users', description: 'Create accounts, reset passwords, deactivate users', route: '/user/users', icon: '🔐' },
    { title: 'System Configuration', description: 'LLM settings, scheduler, max weekly hours', route: '/user/settings', icon: '⚙️' }
  ];
}
