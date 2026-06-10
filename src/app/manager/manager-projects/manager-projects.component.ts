import { Component, OnInit } from '@angular/core';
import { ManagerService, ManagerProject } from '../manager.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-manager-projects',
  templateUrl: './manager-projects.component.html',
  styleUrls: ['./manager-projects.component.css']
})
export class ManagerProjectsComponent implements OnInit {
  projects: ManagerProject[] = [];
  loading = true;
  error = '';
  selectedProjectRisk: string | null = null;
  riskLoading = false;

  constructor(private managerService: ManagerService, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.managerService.getProjects(user.id).subscribe({
        next: (data) => {
          this.projects = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load projects.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Manager ID not found.';
      this.loading = false;
    }
  }

  viewRiskSummary(projectId: number): void {
    this.riskLoading = true;
    this.selectedProjectRisk = null;
    this.managerService.getRiskSummary(projectId).subscribe({
      next: (res) => {
        this.selectedProjectRisk = res.summary;
        this.riskLoading = false;
      },
      error: () => {
        this.selectedProjectRisk = 'Failed to get risk summary.';
        this.riskLoading = false;
      }
    });
  }
}
