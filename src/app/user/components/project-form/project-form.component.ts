import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Milestone } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../models/user.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  milestoneForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  projectId?: number;
  milestones: Milestone[] = [];
  managers: UserDto[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['PLANNED', Validators.required],
      managerId: ['', Validators.required],
      totalStoryPoints: [0, [Validators.required, Validators.min(0)]]
    });
    this.milestoneForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      storyPoints: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadManagers();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.projectId = parseInt(id, 10);
      this.loadProject();
    }
  }

  loadManagers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.managers = users.filter(u => u.roleName === 'Manager' && u.isActive);
      },
      error: () => {
        this.toastr.error('Failed to load managers');
      }
    });
  }

  loadProject(): void {
    if (!this.projectId) return;
    this.isLoading = true;
    this.projectService.getById(this.projectId).subscribe({
      next: (p) => {
        this.projectForm.patchValue({
          name: p.name,
          description: p.description,
          startDate: this.toInputDate(p.startDate),
          endDate: this.toInputDate(p.endDate),
          status: p.status,
          managerId: p.managerId,
          totalStoryPoints: p.totalStoryPoints
        });
        this.milestones = p.milestones || [];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Project not found');
        this.router.navigate(['/user/projects']);
      }
    });
  }

  onSaveProject(): void {
    if (this.projectForm.invalid) return;
    this.isSaving = true;
    const data = {
      ...this.projectForm.value,
      managerId: +this.projectForm.value.managerId,
      totalStoryPoints: +this.projectForm.value.totalStoryPoints
    };

    const request = this.isEditMode && this.projectId
      ? this.projectService.update(this.projectId, data)
      : this.projectService.create(data);

    request.subscribe({
      next: (p) => {
        this.toastr.success('Project saved');
        this.router.navigate(['/user/projects']);
        this.isSaving = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Save failed');
        this.isSaving = false;
      }
    });
  }

  onAddMilestone(): void {
    if (!this.projectId || this.milestoneForm.invalid) return;
    const data = {
      ...this.milestoneForm.value,
      storyPoints: +this.milestoneForm.value.storyPoints
    };
    this.projectService.addMilestone(this.projectId, data).subscribe({
      next: () => {
        this.toastr.success('Milestone added');
        this.milestoneForm.reset({ storyPoints: 0 });
        this.loadProject();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to add milestone')
    });
  }

  updateMilestoneStatus(milestone: Milestone, event: Event): void {
    if (!this.projectId) return;
    const status = (event.target as HTMLSelectElement).value;
    this.projectService.updateMilestoneStatus(this.projectId, milestone.id, status).subscribe({
      next: () => this.toastr.success('Milestone status updated'),
      error: () => this.toastr.error('Failed to update status')
    });
  }

  private toInputDate(ddMmYyyy: string): string {
    const parts = ddMmYyyy.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return ddMmYyyy;
  }
}
