import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { ManagerService, ManagerProjectDetail, ResourceAllocation } from '../manager.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: ManagerProjectDetail | null = null;
  managerId!: number;
  projectId!: number;
  loading = true;
  error = '';
  riskSummary = '';
  riskLoading = false;

  constructor(
    private managerService: ManagerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user?.id) {
      this.error = 'Manager ID not found.';
      this.loading = false;
      return;
    }
    this.managerId = user.id;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'No project ID provided.';
      this.loading = false;
      return;
    }
    this.projectId = parseInt(idParam, 10);
    this.loadProjectDetail();
  }

  loadProjectDetail(): void {
    this.loading = true;
    this.managerService.getProjectDetail(this.managerId, this.projectId).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load project detail.';
        this.loading = false;
      }
    });
  }

  getAiRiskSummary(): void {
    this.riskLoading = true;
    this.riskSummary = '';
    this.managerService.getRiskSummary(this.projectId).subscribe({
      next: (res) => {
        this.riskSummary = res.summary;
        this.riskLoading = false;
      },
      error: () => {
        this.riskSummary = 'Failed to get AI risk summary.';
        this.riskLoading = false;
      }
    });
  }

  endAllocation(allocation: ResourceAllocation): void {
    if (!confirm(`End ${allocation.employeeName}'s allocation on this project?`)) return;
    this.managerService.endAllocation(allocation.allocationId).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Allocation ended.');
        this.loadProjectDetail();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to end allocation.')
    });
  }

  get completionPercentage(): number {
    if (!this.project || this.project.totalStoryPoints === 0) return 0;
    return Math.round((this.project.completedStoryPoints / this.project.totalStoryPoints) * 100);
  }
}
