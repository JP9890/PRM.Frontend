import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamTimesheetsComponent } from './team-timesheets/team-timesheets.component';
import { ManagerProjectsComponent } from './manager-projects/manager-projects.component';
import { AllocateResourceComponent } from './allocate-resource/allocate-resource.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'team-timesheets', component: TeamTimesheetsComponent },
  { path: 'projects', component: ManagerProjectsComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'allocate', component: AllocateResourceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }

